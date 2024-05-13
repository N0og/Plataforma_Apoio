import { Request, Response } from "express";
import VisitasPrioritariasQuery from "../services/reportsServices/VisitasPrioritariasQuery";
import { ProdutividadeACS_PorDiaQuery, ProdutividadeACS_ConsolidadoQuery } from "../services/reportsServices/ProdutividadeACSQuery";
import ProdutividadeUBS_ConsolidadoQuery from "../services/reportsServices/ProdutividadeUBSQuery";
import ExcelBuilder from "../utils/excel_builder/ExcelBuilder"
import CompletudeQuery from "../services/reportsServices/CompletudeQuery";
import DuplicadosPECQuery from "../services/reportsServices/DuplicadosQuery";
import { ipsRepository } from "../database/repository/DBRepositorys";
import { ConnectDBs } from "../database/init";


export default class ReportController {
    async executeHandler(req: Request, res: Response, serviceClass: any, body_params: any, query_params: any, tipo: string) {

        try {

            const dbClient = new ConnectDBs();

            const { dbname } = req.query

            console.log(`\nSOLICITAÇÃO ATENDIDA PARA: ${dbname} DE: ${req.ip}\n`) //LOGGER

            const MUNICIPIOS_EXCEL: { [key: string]: { excel_builder: ExcelBuilder, result: any[] } } = {}

            const IPS = await ipsRepository.createQueryBuilder("jsonIP")
                .where("jsonIP.dados @> :dados", { dados: JSON.stringify({ municipio: dbname }) })
                .getMany()

            for (let ip of IPS) {

                //console.log(`\nINICIO DE EXTRAÇÃO: ${ip.dados.municipio} - ${ip.dados.ip}\n`) - LOGGER

                if (!(ip.dados.municipio in MUNICIPIOS_EXCEL)) {
                    MUNICIPIOS_EXCEL[ip.dados.municipio] = { excel_builder: new ExcelBuilder(), result: [] }
                }

                let bd_changed = await dbClient.changeDB("postgres", { host: ip.dados.ip })

                if (bd_changed instanceof Error) {
                    continue
                }

                else {
                    const serviceInstance = new serviceClass();
                    const result = await serviceInstance.execute(dbClient, body_params, query_params);

                    MUNICIPIOS_EXCEL[ip.dados.municipio].excel_builder.insert_columns(result)

                    MUNICIPIOS_EXCEL[ip.dados.municipio].excel_builder.insert(result)

                    MUNICIPIOS_EXCEL[ip.dados.municipio].result.concat(result)
                }

            }

            console.log(`\nSOLICITAÇÃO RESPONDIDA PARA: ${req.ip} DE: ${dbname}\n`)

            for (let MunicipioExcel of Object.keys(MUNICIPIOS_EXCEL)) {

                if ("download" in query_params && query_params["download"] === 'true') {
                    res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                    res.set('Content-Disposition', `attachment; filename="${tipo}${MunicipioExcel}.xlsx"`);
                    return res.send(await MUNICIPIOS_EXCEL[MunicipioExcel].excel_builder.save_worksheet())
                }
            }
            /*

            if (result instanceof Error){
                return res.status(400).json({error: result.message})
            }
            */
        } catch (error) {
            console.error(error)
            return res.status(500).json({
                error: "Erro Interno do Servidor."
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