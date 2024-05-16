import { Request, Response } from "express";
import VisitasPrioritariasQuery from "../services/reportsServices/VisitasPrioritariasService";
import { ProdutividadeACS_PorDiaQuery, ProdutividadeACS_ConsolidadoQuery } from "../services/reportsServices/ProdutividadeACSService";
import ProdutividadeUBS_ConsolidadoQuery from "../services/reportsServices/ProdutividadeUBSService";
import ExcelBuilder from "../utils/excel_builder/ExcelBuilder"
import CompletudeQuery from "../services/reportsServices/CompletudeService";
import DuplicadosPECQuery from "../services/reportsServices/DuplicadosService";
import { ConnEASRepository, ConneSUSRepository } from "../database/repository/DBRepositorys";
import { ConnectDBs } from "../database/init";
import JSZip from "jszip";


export default class ReportController {
    async executeHandler(req: Request, res: Response, serviceClass: any, body_params: any, query_params: any, tipo: string) {

        try {

            const dbClient = new ConnectDBs();

            const dbname = Array.isArray(req.query.dbname) ? req.query.dbname : Array(req.query.dbname)

            const { dbtype } = query_params

            console.log(`\nSOLICITAÇÃO ATENDIDA PARA: ${dbname.join('|')} DE: ${req.ip}\n`) //LOGGER

            const MUNICIPIOS_EXCEL: { [key: string]: { excel_builder: ExcelBuilder, result: any[] } } = {}

            for (const municipio in dbname) {

                let mun = dbname[municipio]

                const IPSESUS = await ConneSUSRepository.createQueryBuilder("jsonIP")
                    .where("jsonIP.dados @> :dados", { dados: JSON.stringify({ municipio: mun }) })
                    .getMany()

                const IPSEAS = await ConnEASRepository.createQueryBuilder("jsonIP")
                    .where("jsonIP.dados @> :dados", { dados: JSON.stringify({ municipio: mun }) })
                    .getOne()

                let bd_error: { [key: string]: { address: string, error: string } }[] = []
            

                if (IPSEAS && dbtype === 'mdb') {
                    if (!(IPSEAS!.dados.municipio in MUNICIPIOS_EXCEL)) {
                        MUNICIPIOS_EXCEL[IPSEAS!.dados.municipio] = { excel_builder: new ExcelBuilder(), result: [] }
                    }

                    let bd_changed = await dbClient.changeDB(dbtype, { database: IPSEAS!.dados.db_name_eas! })

                    if (bd_changed instanceof Error) {
                        return res.status(400).json({ error: bd_changed.message })
                    }

                    const serviceInstance = new serviceClass();
                    const result = await serviceInstance.execute(dbClient, body_params, query_params);

                    MUNICIPIOS_EXCEL[IPSEAS!.dados.municipio].excel_builder.insert_columns(result)

                    MUNICIPIOS_EXCEL[IPSEAS!.dados.municipio].excel_builder.insert(result)

                    MUNICIPIOS_EXCEL[IPSEAS!.dados.municipio].result.concat(result)

                }

                else if (IPSESUS && dbtype === 'psql') {

                    for (let ip of IPSESUS) {

                        if (!(ip.dados.municipio in MUNICIPIOS_EXCEL)) {
                            MUNICIPIOS_EXCEL[ip.dados.municipio] = { excel_builder: new ExcelBuilder(), result: [] }
                        }

                        let bd_changed = await dbClient.changeDB(dbtype, {
                            host: ip.dados.ip_esus!,
                            port: ip.dados.port_esus!,
                            user: ip.dados.db_user_esus!,
                            password: ip.dados.db_password_esus!
                        })

                        if (bd_changed instanceof Error) {
                            const _instalacao = ip.dados.instalacao_esus!
                            const _ip = ip.dados.ip_esus!
                            const erro = { instalacao: { address: _ip, error: bd_changed.message } }
                            bd_error.push(erro)
                            continue
                        }

                        const serviceInstance = new serviceClass();
                        const result = await serviceInstance.execute(dbClient, body_params, query_params);

                        MUNICIPIOS_EXCEL[ip.dados.municipio].excel_builder.insert_columns(result)

                        MUNICIPIOS_EXCEL[ip.dados.municipio].excel_builder.insert(result)

                        MUNICIPIOS_EXCEL[ip.dados.municipio].result.concat(result)

                    }
                }

                else {
                    console.error("Falha na solicitação")
                    return res.status(400).json({ error: 'Falha na solicitação' })
                }

                if (bd_error.length == IPSESUS.length) {
                    return res.status(503).json({ error: `BD's indisponíveis: ${dbname}` })
                }
            }

            console.log(`\nSOLICITAÇÃO RESPONDIDA PARA: ${req.ip} DE: ${dbname.join('|')}\n`)

            const zip = new JSZip();
            for (let MunicipioExcel of Object.keys(MUNICIPIOS_EXCEL)) {

                if ("download" in query_params && query_params["download"] === 'true') {
                    const worksheetBuffer:Buffer = await MUNICIPIOS_EXCEL[MunicipioExcel].excel_builder.save_worksheet();
                    zip.file(`${tipo}-${MunicipioExcel}.xlsx`, worksheetBuffer);
                }
            }

            if ("download" in query_params && query_params["download"] === 'true') {
                const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
                res.set('Content-Type', 'application/zip');
                res.set('Content-Disposition', `attachment; filename="${tipo}-${new Date().toLocaleDateString('pt-BR')}.zip"`);
                res.send(zipBuffer);
            }

        } catch (error) {
            console.error(error)
            return res.status(500).json({
                message: "Erro Interno do Servidor.",
                error: error
            });
        }
    }

    handleVisitaGrupoPrioritario = async (req: Request, res: Response) => {
        const body_params = req.body
        const query_params = req.query
        this.executeHandler(req, res, VisitasPrioritariasQuery, body_params, query_params, `VisitasPrioritariasACS${new Date().toLocaleDateString('pt-BR')}`)
    }

    handleProdutividadeACS_PorDia = async (req: Request, res: Response) => {
        const body_params = req.body
        const query_params = req.query
        this.executeHandler(req, res, ProdutividadeACS_PorDiaQuery, body_params, query_params, `VisitasPorDiaACS${new Date().toLocaleDateString('pt-BR')}`)
    }

    handleProdutividadeACS_Consolidado = async (req: Request, res: Response) => {
        const body_params = req.body
        const query_params = req.query
        this.executeHandler(req, res, ProdutividadeACS_ConsolidadoQuery, body_params, query_params, `ProdutividadeACS${new Date().toLocaleDateString('pt-BR')}`)
    }

    handleProdutividadeUBS_Consolidado = async (req: Request, res: Response) => {
        const body_params = req.body
        const query_params = req.query
        this.executeHandler(req, res, ProdutividadeUBS_ConsolidadoQuery, body_params, query_params, `ProdutividadeUBS${new Date().toLocaleDateString('pt-BR')}`)
    }

    handleCompletude = async (req: Request, res: Response) => {
        const body_params = req.body
        const query_params = req.query
        this.executeHandler(req, res, CompletudeQuery, body_params, query_params, `Completude${new Date().toLocaleDateString('pt-BR')}`)
    }

    handleDuplicadosPEC = async (req: Request, res: Response) => {
        const body_params = req.body
        const query_params = req.query
        this.executeHandler(req, res, DuplicadosPECQuery, body_params, query_params, `DuplicadosPEC${new Date().toLocaleDateString('pt-BR')}`)
    }

}