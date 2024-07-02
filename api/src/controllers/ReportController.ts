import { Response } from "express";

import { ConnectDBs } from "../database/init";
import { ConnEASRepository, ConneSUSRepository } from "../database/repository/API_DB_Repositorys";
import ExcelBuilder from "../utils/excel_builder/ExcelBuilder"

import { IReportControllerBDError, IReportControllerRequest } from "../interfaces/ControllersInterfaces/IReportController";

import { ProdutividadeACS_PorDiaQuery, ProdutividadeACS_ConsolidadoQuery } from "../services/reportsServices/ProdutividadeACSService";
import ProdutividadeUBS_ConsolidadoQuery from "../services/reportsServices/ProdutividadeUBSService";
import VisitasPrioritariasQuery from "../services/reportsServices/VisitasPrioritariasService";
import DuplicadosPECQuery from "../services/reportsServices/DuplicadosService";
import CompletudeQuery from "../services/reportsServices/CompletudeService";
import AcessosEASService from "../services/reportsServices/AcessosEASService";

import { IEXCEL_SHEETS } from "../interfaces/IExcel";

import JSZip from "jszip";
import VisitasPrioritariasOrganizer from "../utils/excel_builder/Organizers/VisitasPrioritariasOrganizer";

export default class ReportController {

    DB_CLIENT: ConnectDBs
    SHEETS: IEXCEL_SHEETS 
    BD_ERROS: IReportControllerBDError[]
    

    private async executeHandler(req: IReportControllerRequest, res: Response, serviceClass: any, type: string) {

        try {

            this.DB_CLIENT = new ConnectDBs();
            this.SHEETS = {};
            this.BD_ERROS = [];

            const DB_TYPE = req.dbtype;
            const DB_NAMES = req.dbname;
            const DOWNLOAD = req.download;
            const ORGANIZE = req.organize;

            console.log(`PEDIDO IP: ${req.ip} - INÍCIO DE EXTRAÇÃO.`)
            for (const connection of DB_NAMES!) {
                await this.processConnection(connection, DB_TYPE!, serviceClass, req, res);
                console.log(`PEDIDO IP: ${req.ip} - EXTRAÇÃO: ${connection}.`)
            }

            console.log(`PEDIDO IP: ${req.ip} - EXTRAÇÃO REALIZADA.`)
            if (DOWNLOAD) {
                console.log(`PEDIDO IP: ${req.ip} - ENVIO PARA DOWNLOAD - SISTEMATIZANDO...`)
                await this.generateAndSendZip(type, res, ORGANIZE!);
            }

            else {
                console.log(`PEDIDO IP: ${req.ip} - ENVIO VIA JSON - SISTEMATIZANDO...`)
                let response_json = {}
                if (Object.keys(this.SHEETS).length === 0) {
                    res.status(404).json(this.BD_ERROS)
                }
                else{
                    for (let MUNICIPIO of Object.keys(this.SHEETS)) {
                        response_json[MUNICIPIO] = this.SHEETS[MUNICIPIO].result
                    }
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

    private async changeDB(DB_TYPE: string, config: any) {
        return await this.DB_CLIENT.changeDB(DB_TYPE, config);
    }

    private async getConnections(repository: any, municipio: string) {
        return await repository.createQueryBuilder("jsonIP")
            .where("jsonIP.dados @> :dados", { dados: JSON.stringify({ municipio }) })
            .getMany();
    }

    private async processConnection(connection_name: any, DB_TYPE: string, serviceClass: any, req: IReportControllerRequest, res: Response) {

        const IPSESUS = DB_TYPE === 'psql' ? await this.getConnections(ConneSUSRepository, connection_name) : null;
        const IPSEAS = DB_TYPE === 'mdb' ? await this.getConnections(ConnEASRepository, connection_name) : null;

        if (IPSEAS && IPSEAS.length > 0) {
            return await this.handleIPSEAS(IPSEAS[0], DB_TYPE, serviceClass, req, res);
        } 
        else if (IPSESUS && IPSESUS.length > 0) {
            return await this.handleIPSESUS(IPSESUS, DB_TYPE, serviceClass, req, res);
        } 
        else {
            this.BD_ERROS.push({ connection_name: { address:connection_name, error:`Conexões não identificadas: ${connection_name}`}});
        }
    }

    private async handleIPSEAS(IPSEAS: any, DB_TYPE: string, serviceClass: any, req: IReportControllerRequest, res: Response) {
        const municipio = IPSEAS.dados.municipio;
        if (!(municipio in this.SHEETS)) {
            this.SHEETS[municipio] = { excel_builder: undefined, result: [] };
        }

        if (await this.changeDB(DB_TYPE, { database: IPSEAS.dados.db_name_eas }) instanceof Error) {
            res.status(503).json({ error: "Falha na conexão de banco" });
        }

        const result = await this.executeService(serviceClass, DB_TYPE, req);

        this.SHEETS[municipio].result = this.SHEETS[municipio].result.concat(result);
    }

    private async handleIPSESUS(IPSESUS: any[], DB_TYPE: string, serviceClass: any, req: IReportControllerRequest, res: Response) {
        

        for (let ip of IPSESUS) {
            const municipio = ip.dados.municipio;
            if (!(municipio in this.SHEETS)) {
                this.SHEETS[municipio] = { excel_builder: undefined, result: [] };
            }

            console.log(`${municipio} - Connectando: ${ip.dados.instalacao_esus}... `)
            if (await this.changeDB(DB_TYPE, {
                host: ip.dados.ip_esus,
                port: ip.dados.port_esus,
                database: ip.dados.db_name_esus,
                user: ip.dados.db_user_esus,
                password: ip.dados.db_password_esus
            }) instanceof Error) {
                console.error(`${municipio} - Falha na conexão: ${ip.dados.instalacao_esus}... `)
                this.BD_ERROS.push({ [ip.dados.instalacao_esus]: { address: ip.dados.ip_esus, error: "Falha na conexão de banco" } });
                continue;
            }

            console.log(`${municipio} - Conectado!: ${ip.dados.instalacao_esus}... `)
            const result = await this.executeService(serviceClass, DB_TYPE, req);
            this.SHEETS[municipio].result = this.SHEETS[municipio].result.concat(result);
        }

        /*if (IPSESUS.length === this.BD_ERROS.length) {
            res.status(503).json({ error: `BD's indisponíveis` });
        }*/
    }

    async executeService(serviceClass: any, DB_TYPE: string, req: IReportControllerRequest) {
        const serviceInstance = new serviceClass();
        return await serviceInstance.execute(DB_TYPE, this.DB_CLIENT, req.body, req.query);
    }

    async generateAndSendZip(type: string, res: Response, organize: Boolean) {

        if (organize) {

            for (const SHEET of Object.keys(this.SHEETS)) {
                switch (type) {
                    case 'VisitasPrioritariasACS':
                        this.SHEETS[SHEET].excel_builder = new VisitasPrioritariasOrganizer()
                        this.SHEETS[SHEET].excel_builder.insert_columns(this.SHEETS[SHEET].result);
                        this.SHEETS[SHEET].excel_builder.insert_header()
                        this.SHEETS[SHEET].excel_builder.insert(this.SHEETS[SHEET].result);
                        break;
                }
            }
        }
        else {
            for (const SHEET of Object.keys(this.SHEETS)) {
                this.SHEETS[SHEET].excel_builder = new ExcelBuilder()
                this.SHEETS[SHEET].excel_builder.insert_columns(this.SHEETS[SHEET].result);
                this.SHEETS[SHEET].excel_builder.insert(this.SHEETS[SHEET].result);
            }
        }

        const zip = new JSZip();
        for (let SHEET of Object.keys(this.SHEETS)) {
            const worksheetBuffer: Buffer = await this.SHEETS[SHEET].excel_builder.save_worksheet();
            zip.file(`${SHEET}.xlsx`, worksheetBuffer);
        }

        const zipBuffer = zip.generateNodeStream({ type: "nodebuffer" , streamFiles: true});

        zipBuffer.on('end', () => {
            res.end();
        });

        res.set('Content-Type', 'application/zip');
        res.set('Content-Disposition', `attachment; filename="${type}${new Date().toLocaleDateString('pt-BR')}.zip"`);
        zipBuffer.pipe(res)
    }


    handleVisitaGrupoPrioritario = async (req: IReportControllerRequest, res: Response) => {
        this.executeHandler(req, res, VisitasPrioritariasQuery, `VisitasPrioritariasACS`)
    }

    handleProdutividadeACS_PorDia = async (req: IReportControllerRequest, res: Response) => {
        this.executeHandler(req, res, ProdutividadeACS_PorDiaQuery, `VisitasPorDiaACS`)
    }

    handleProdutividadeACS_Consolidado = async (req: IReportControllerRequest, res: Response) => {
        this.executeHandler(req, res, ProdutividadeACS_ConsolidadoQuery, `ProdutividadeACS`)
    }

    handleProdutividadeUBS_Consolidado = async (req: IReportControllerRequest, res: Response) => {
        this.executeHandler(req, res, ProdutividadeUBS_ConsolidadoQuery, `ProdutividadeUBS`)
    }

    handleCompletude = async (req: IReportControllerRequest, res: Response) => {
        this.executeHandler(req, res, CompletudeQuery, `Completude`)
    }

    handleDuplicadosPEC = async (req: IReportControllerRequest, res: Response) => {
        this.executeHandler(req, res, DuplicadosPECQuery, `DuplicadosPEC`)
    }

    handleAcessosRetaguarda = async (req: IReportControllerRequest, res: Response) => {
        this.executeHandler(req, res, AcessosEASService, `AcessosEAS`)
    }
}