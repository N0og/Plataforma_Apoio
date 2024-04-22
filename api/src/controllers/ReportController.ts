import { Request, Response } from "express";
import VisitasPrioritariasQuery from "../querys/VisitasPrioritariasQuery";



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
}