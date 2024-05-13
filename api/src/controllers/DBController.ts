import { Response, Request } from "express";
import UpdateDBService from "../services/dbServices/UpdateDBService";

export default class DBController{
    async executeHandler(req:Request, res:Response, serviceClass:any, serviceParams:any){
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

    handleUpdateDb = async (req: Request, res: Response) => {
        this.executeHandler(req, res, UpdateDBService, {})
    }

}