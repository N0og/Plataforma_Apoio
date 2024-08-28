import { Response } from "express";

import { ConnectDBs } from "../database/init";

import {
    ConnEASRepository,
    ConneSUSRepository
} from "../database/repository/API_DB_Repositorys";

import { ExcelBuilder } from "../utils"

import {
    IOrder,
    IOrderError,
    IReportControllerRequest,
    IResultConnection
} from "../interfaces";

import {
    ACS_ProductivityReportService_Day,
    ACS_ProductivityReportService,
    TeamProductivityReportService,
    PriorityVisitsReportService,
    DuplicatesReportService,
    CompletenessReportService,
    AccessEASReportService,
    VaccinesReportService,
    ProceduresReportService,
    VersionPecReportService
} from "../services";

import {
    handleIPSEAS,
    handleIPSESUS
} from "./handlers";

import JSZip, { file } from "jszip";
import { OralCareReportService } from "../services/OralCareReportService";
import { NotFinishedReportService } from "../services/NotFinishedReportService";

export default class ReportController {

    DB_CLIENT: ConnectDBs;
    INSTALLATIONS: any;
    ORDERS_PROCESS: IOrder;
    ORDERS_ERRORS: IOrderError;


    private async executeHandler(req: IReportControllerRequest, res: Response, serviceClass: any, type: string) {

        try {

            this.DB_CLIENT = new ConnectDBs();
            this.ORDERS_PROCESS = {};
            this.ORDERS_ERRORS = {};
            this.INSTALLATIONS = req.installations;

            const SERVICE_INSTANCE = new serviceClass();
            const DB_TYPE = req.dbtype;
            const ORDERS = req.order;
            const DOWNLOAD = req.download;


            console.log(`PEDIDO IP: ${req.ip} - SOLICITAÇÃO RECEBIDA...`)
            for (const db_name of ORDERS!) {

                let result: IResultConnection = await this.processConnection(db_name, DB_TYPE!, SERVICE_INSTANCE, req);
                if (!result.extracted) {
                    this.ORDERS_ERRORS[db_name.toString()] = { json: result }
                }

                else if (!(db_name.toString() in this.ORDERS_PROCESS)) {
                    this.ORDERS_PROCESS[db_name.toString()] = { sheet: undefined, json: (result.result.length > 0 ? result: {...result, msg:'Sem Dados.'}) };
                }

                console.log(`PEDIDO IP: ${req.ip} - ${db_name}: PROCESSADO.`)

            }

            console.log(`PEDIDO IP: ${req.ip} - EM ROTA DE ENTREGA...`)

            if (ORDERS?.length == Object.keys(this.ORDERS_ERRORS).length) {
                return res.status(503).json(
                    {
                        msg: 'Houve uma falha na coleta de dados.',
                        orders: this.ORDERS_ERRORS
                    })
            }

            console.log(`PEDIDO IP: ${req.ip} - BUSCAS REALIZADAS.`)
            if (DOWNLOAD) {
                console.log(`PEDIDO IP: ${req.ip} - ENVIO PARA DOWNLOAD - SISTEMATIZANDO...`)
                const ZIP = await this.generateZip(type);

                if (!ZIP) {
                    return res.status(204).json(
                        {
                            msg: "Sem conteúdo para esta solicitação",
                            orders: this.ORDERS_PROCESS
                        })
                }

                const ZIP_BUFFER = ZIP.generateNodeStream({ type: "nodebuffer", streamFiles: true });

                ZIP_BUFFER.on('end', () => {
                    res.end();
                });

                res.set('Content-Type', 'application/zip');
                res.set('Content-Disposition', `attachment; filename="${type}${new Date().toLocaleDateString('pt-BR').replace(/\//g, "_")}.zip"`);
                res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
                ZIP_BUFFER.pipe(res)
            }

            else {
                console.log(`PEDIDO IP: ${req.ip} - ENVIO VIA JSON - SISTEMATIZANDO...`)

                let response_json = {}
                if (Object.keys(this.ORDERS_PROCESS).length === 0) {
                    res.status(404).json(this.ORDERS_ERRORS)
                }
                else {
                    for (let MUNICIPIO of Object.keys(this.ORDERS_PROCESS)) {
                        response_json[MUNICIPIO] = this.ORDERS_PROCESS[MUNICIPIO].json
                    }
                    response_json['ERRORS'] = this.ORDERS_ERRORS
                    res.status(200).json(response_json)
                }

            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Erro Interno do Servidor.",
                error: error
            });
        }
    }

    private async getConnections(repository: any, municipio: string) {
        return await repository.createQueryBuilder("jsonIP")
            .where("jsonIP.dados @> :dados", { dados: JSON.stringify({ municipio }) })
            .getMany();
    }

    private async processConnection(connection_name: any, DB_TYPE: string, SERVICE_INSTANCE: any, req: IReportControllerRequest): Promise<IResultConnection> {

        let IPSESUS = DB_TYPE === 'psql' ? await this.getConnections(ConneSUSRepository, connection_name) : null;
        let IPSEAS = DB_TYPE === 'mdb' ? await this.getConnections(ConnEASRepository, connection_name) : null;

        if (IPSEAS && IPSEAS.length > 0) {
            return await handleIPSEAS(this.DB_CLIENT, IPSEAS[0], DB_TYPE, SERVICE_INSTANCE, req);
        }
        else if (IPSESUS && IPSESUS.length > 0) {
            if (this.INSTALLATIONS) {
                IPSESUS = IPSESUS.filter(conneSUS =>
                    this.INSTALLATIONS.includes(conneSUS.id.toString()))
            }

            return await handleIPSESUS(this.DB_CLIENT, IPSESUS, DB_TYPE, SERVICE_INSTANCE, req);
        }
        else {
            return {
                expected: 0,
                successful: 0,
                errors: [],
                msg: "Conexões não encontradas.",
                extracted: false,
                result: []
            }
        }
    }


    async generateZip(type:any) {
        const zip = new JSZip();

        for (const SHEET of Object.keys(this.ORDERS_PROCESS)) {
            let file_name: string = SHEET;

            if (this.ORDERS_PROCESS[SHEET].json.result.length === 0) {
                this.ORDERS_PROCESS[SHEET].json.result = [{ 'FALHA': 'SEM DADOS' }]
                file_name = `${SHEET}_SEM_DADOS`
            }

            this.ORDERS_PROCESS[SHEET].sheet = new ExcelBuilder()
            this.ORDERS_PROCESS[SHEET].sheet.insert_columns(this.ORDERS_PROCESS[SHEET].json.result);
            this.ORDERS_PROCESS[SHEET].sheet.insert(this.ORDERS_PROCESS[SHEET].json.result);

            const worksheetBuffer: Buffer = await this.ORDERS_PROCESS[SHEET].sheet.save_worksheet();
            zip.file(`${file_name}_${type}${new Date().toLocaleDateString('pt-BR').replace(/\//g, "_")}.xlsx`, worksheetBuffer);
        }

        return zip
    }


    handleVisitaGrupoPrioritario = async (req: IReportControllerRequest, res: Response) => {
        this.executeHandler(req, res, PriorityVisitsReportService, `VisitasPrioritariasACS`)
    }

    handleProdutividadeACS_PorDia = async (req: IReportControllerRequest, res: Response) => {
        this.executeHandler(req, res, ACS_ProductivityReportService_Day, `VisitasPorDiaACS`)
    }

    handleProdutividadeACS_Consolidado = async (req: IReportControllerRequest, res: Response) => {
        this.executeHandler(req, res, ACS_ProductivityReportService, `ProdutividadeACS`)
    }

    handleProdutividadeUBS_Consolidado = async (req: IReportControllerRequest, res: Response) => {
        this.executeHandler(req, res, TeamProductivityReportService, `ProdutividadeUBS`)
    }

    handleCompletude = async (req: IReportControllerRequest, res: Response) => {
        this.executeHandler(req, res, CompletenessReportService, `Completude`)
    }

    handleDuplicadosPEC = async (req: IReportControllerRequest, res: Response) => {
        this.executeHandler(req, res, DuplicatesReportService, `DuplicadosPEC`)
    }

    handleAcessosRetaguarda = async (req: IReportControllerRequest, res: Response) => {
        this.executeHandler(req, res, AccessEASReportService, `AcessosEAS`)
    }

    handleVacinasPEC = async (req: IReportControllerRequest, res: Response) => {
        this.executeHandler(req, res, VaccinesReportService, `VacinasPEC`)
    }

    handleProdOralCare = async (req: IReportControllerRequest, res: Response) => {
        this.executeHandler(req, res, OralCareReportService, `CuidadosBucais`)
    }

    handleProcedures = async (req: IReportControllerRequest, res: Response) => {
        this.executeHandler(req, res, ProceduresReportService, `CuidadosIndividuais`)
    }

    handleNotFinished = async (req: IReportControllerRequest, res: Response) => {
        this.executeHandler(req, res, NotFinishedReportService, `NaoFinalizados`)
    }

    handlePecVersion = async (req: IReportControllerRequest, res: Response) => {
        this.executeHandler(req, res, VersionPecReportService, `VersoesPEC`)
    }
}