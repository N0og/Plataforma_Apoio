import { Request, Response } from "express";
import clientsFilterService from "../services/filterServices/clientFilterService";

export default class FiltersController {
    async executeHandler(req: Request, res: Response, serviceClass: any, body_params: any, query_params: any) {

        try {
            const serviceInstance = new serviceClass()

            const result = await serviceInstance.execute(body_params, query_params)

            if (result instanceof Error) {
                return res.status(400).json({ error: "Falha na solicitação." })
            }

            return res.json(result)

        } catch (error) {
            console.log(error)
            return res.status(500).json(
                {
                message: "Falha  interna do servidor.",
                error: error
                })
        }
    }

    handlerClientsFilter = async (req: Request, res: Response) => {
        const body_params = req.body
        const query_params = req.query

        this.executeHandler(req, res, clientsFilterService, body_params, query_params)
    }
}