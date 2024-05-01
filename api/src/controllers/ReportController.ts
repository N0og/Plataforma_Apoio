import { Request, Response } from "express";
import VisitasPrioritariasQuery from "../services/queryServices/VisitasPrioritariasQuery";
import {ProdutividadeACS_PorDiaQuery, ProdutividadeACS_ConsolidadoQuery} from "../services/queryServices/ProdutividadeACSQuery";
import ProdutividadeUBS_ConsolidadoQuery from "../services/queryServices/ProdutividadeUBSQuery";
import ExcelBuilder from "../utils/excel_builder/ExcelBuilder"
import CompletudeQuery from "../services/queryServices/CompletudeQuery";


export default class ReportController{
    async executeHandler(req:Request, res: Response, serviceClass: any, body_params:any, query_params:any, tipo:string) {
        
        try {
            const serviceInstance = new serviceClass();
            const result = await serviceInstance.execute(body_params, query_params);

            if (result instanceof Error){
                return res.status(400).json({error: result.message})
            }
            if ("download" in query_params && query_params["download"] === 'true'){
                res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.set('Content-Disposition', `attachment; filename="${tipo}.xlsx"`);
                return res.send(await new ExcelBuilder().execute(result))
            } 
            return res.json(result)
        } catch (error) {
            console.error(error)
            return res.status(500).json({
                error: "Erro Interno do Servidor."
            });
        }
    }

    handleVisitaGrupoPrioritario = async (req: Request, res: Response) => {
        const params = req.body
        const req_params = req.query
        this.executeHandler(req, res, VisitasPrioritariasQuery, params, req_params, `VisitasPrioritariasACS${new Date().toLocaleDateString('pt-BR')}`)       
    }

    handleProdutividadeACS_PorDia = async (req: Request, res: Response) => {
        const params = req.body
        const req_params = req.query
        this.executeHandler(req, res, ProdutividadeACS_PorDiaQuery, params, req_params, `VisitasPorDiaACS${new Date().toLocaleDateString('pt-BR')}`)
    }

    handleProdutividadeACS_Consolidado = async (req:Request, res: Response) => {
        const params = req.body
        const req_params = req.query
        this.executeHandler(req, res, ProdutividadeACS_ConsolidadoQuery, params, req_params, `ProdutividadeACS${new Date().toLocaleDateString('pt-BR')}`)
    }

    handleProdutividadeUBS_Consolidado = async (req:Request, res: Response) => {
        const params = req.body
        const req_params = req.query
        this.executeHandler(req, res, ProdutividadeUBS_ConsolidadoQuery, params, req_params, `ProdutividadeUBS${new Date().toLocaleDateString('pt-BR')}`)
    }

    handleCompletude = async (req:Request, res: Response) => {
        const params = req.body
        const req_params = req.query
        this.executeHandler(req, res, CompletudeQuery, req.body, req.query, `Completude${new Date().toLocaleDateString('pt-BR')}`)
    }

}