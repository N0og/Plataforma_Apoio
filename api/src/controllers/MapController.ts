import { Request, Response } from "express";
import clientsFilterService from "../services/filterServices/clientFilterService";
import { ConnectDBs } from "../database/init";
import { ConnEASRepository } from "../database/repository/API_DB_Repositorys";
import IEDService from "../services/mapsServices/IEDService";

export default class MapController {
    async executeHandler(req: Request, res: Response, serviceClass: any, body_params: any, query_params: any) {

        try {
            const dbClient = new ConnectDBs();

            const dbname = Array.isArray(req.query.dbname) ? req.query.dbname : Array(req.query.dbname)
            const { dbtype } = query_params

            let resultTotal: { [key: string]: any }[] = []

            for (const municipio in dbname) {

                let mun = dbname[municipio]

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

        this.executeHandler(req, res, IEDService, body_params, query_params)
    }
}