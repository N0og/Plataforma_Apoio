import { Request, Response } from "express";
import { ConnectDBs } from "../database/init";
import { ConnEASRepository } from "../database/repository/API_DB_Repositorys";
import { IEDCollectService } from "../services";

export default class MapController {
    async executeHandler(req: Request, res: Response, serviceClass: any, body_params: any, query_params: any) {

        try {
            const dbClient = new ConnectDBs();

            const order = Array.isArray(req.query.order) ? req.query.order : Array(req.query.order)
            const { dbtype } = query_params

            let resultTotal: { [key: string]: any }[] = []

            for (const municipio in order) {

                let mun = order[municipio]

                body_params.municipio = mun

                const IPSEAS = await ConnEASRepository.createQueryBuilder("jsonIP")
                    .where("jsonIP.dados @> :dados", { dados: JSON.stringify({ municipio: mun }) })
                    .getOne()

                if (IPSEAS && typeof mun === 'string') {
                    let bd_changed = await dbClient.changeDB(dbtype, { database: IPSEAS!.dados.db_name_eas! })

                    if (bd_changed instanceof Error) {
                        return res.status(400).json({ error: bd_changed.message })
                    }
                }
                else {
                    continue
                    //return res.status(400).json({ error: 'Banco não localizado' })
                }


                const serviceInstance = new serviceClass();
                const result = await serviceInstance.execute(dbClient, body_params, query_params);

                resultTotal.push({ [mun]: result })

                if (result instanceof Error) {
                    return res.status(501).json({ error: "Falha na solicitação." })
                }
            }

            return res.json(resultTotal)

        } catch (error) {
            console.log(error)
            return res.status(500).json(
                {
                    message: "Falha  interna do servidor.",
                    error: error
                })
        }
    }

    handlerIED = async (req: Request, res: Response) => {
        const body_params = req.body
        const query_params = req.query

        this.executeHandler(req, res, IEDCollectService, body_params, query_params)
    }
}