import {
    Request,
    Response
} from "express";

import {
    ClientsFilterService,
    InstallationsFilterService,
    UnitsFilterService,
    TeamsFilterService,
    VaccinesFilterService
} from "../services/";

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
        this.executeHandler(req, res, ClientsFilterService)
    }

    handlerInstalacoesFilter = async (req: Request, res: Response) => {
        this.executeHandler(req, res, InstallationsFilterService)
    }

    handlerUnidadesFilter = async (req: Request, res: Response) => {
        this.executeHandler(req, res, UnitsFilterService)
    }

    handlerEquipesFilter = async (req: Request, res: Response) => {
        this.executeHandler(req, res, TeamsFilterService)
    }

    handlerImunosFilter = async (req: Request, res: Response) => {
        this.executeHandler(req, res, VaccinesFilterService)
    }
}