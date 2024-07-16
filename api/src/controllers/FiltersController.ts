import { Request, Response } from "express";
import clientsFilterService from "../services/filterServices/clientFilterService";
import instalacaoFilterService from "../services/filterServices/instalacaoFilterService";
import unidadeFilterService from "../services/filterServices/unidadeFilterService";
import equipeFilterService from "../services/filterServices/equipeFilterService";

export default class FiltersController {
    async executeHandler(req: Request, res: Response, serviceClass: any) {

        try {
            const serviceInstance = new serviceClass()
            const result = await serviceInstance.execute(req.query)

            if (result instanceof Error) return res.status(400).json({ error: "Falha na solicitação." })
            
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
        this.executeHandler(req, res, clientsFilterService)
    }

    handlerInstalacoesFilter = async (req: Request, res: Response) => {
        this.executeHandler(req, res, instalacaoFilterService)
    }

    handlerUnidadesFilter = async (req: Request, res: Response) => {
        this.executeHandler(req, res, unidadeFilterService)
    }

    handlerEquipesFilter = async (req: Request, res: Response) => {
        this.executeHandler(req, res, equipeFilterService)
    }
}