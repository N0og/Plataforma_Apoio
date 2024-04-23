import { Request, Response } from "express";
import VisitasPrioritariasQuery from "../querys/VisitasPrioritariasQuery";
import ProdutividadeACS_PorDiaQuery from "../querys/ProdutividadeACSQuery";
import ProdutividadeACS_ConsolidadoQuery from "../querys/ProdutividadeACSQuery";
import ProdutividadeUBS_Consolidado from "../querys/ProdutividadeUBSQuery";



export default class ReportController{
    async executeHandler(req:Request, res: Response, serviceClass: any, serviceParams:any) {
        try {
            const serviceInstance = new serviceClass();
            const result = await serviceInstance.execute(serviceParams);

            if (result instanceof Error){
                return res.status(400).json({error: result.message})
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
        this.executeHandler(req, res, VisitasPrioritariasQuery, params)       
    }

    handleProdutividadeACS_Consolidado = async (req: Request, res: Response) => {
        const params = req.body
        this.executeHandler(req, res, ProdutividadeACS_PorDiaQuery, params)
    }

    handleProdutividadeACS_PorDia = async (req:Request, res: Response) => {
        const params = req.body
        this.executeHandler(req, res, ProdutividadeACS_ConsolidadoQuery, params)
    }

    handleProdutividadeUBS_Consolidado = async (req:Request, res: Response) => {
        const params = req.body
        this.executeHandler(req, res, ProdutividadeUBS_Consolidado, params)
    }

}