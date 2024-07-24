import { Response, Request } from "express";
import UpdateDBService from "../services/dbServices/UpdateDBService";
import ProcessDBService from "../services/dbServices/ProcessDBService";
import { ConneSUSRepository, instalacaoESUSRepository, processamentoRepository } from "../database/repository/API_DB_Repositorys";
import { ConnectDBs } from "../database/init";
import { handleIPSESUS } from "./handlers";
import { IResultConnection } from "../interfaces";

export default class API_DB_Controller {
    async executeHandler(req: Request, res: Response, serviceClass: any) {
        try {

            const serviceInstance = new serviceClass();
            const result = await serviceInstance.execute(req.body);

            if (result instanceof Error) {
                return res.status(400).json({ error: result.message })
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
        this.executeHandler(req, res, UpdateDBService)
    }


    handleProcessDb = async (req: Request, res: Response) => {

        const dbClient = new ConnectDBs();
        const CONN_ESUS = await ConneSUSRepository.find()


        if (CONN_ESUS) {
            let result: IResultConnection = await handleIPSESUS(dbClient, CONN_ESUS, 'psql', new ProcessDBService(), req)

            await processamentoRepository.insert({
                nu_instalacoes_processadas: result.successful
            })

            return res.json(
                {
                    status: 200,
                    result
                })

        }

        return res.status(500).json(
            {
                status: 500,
                erros: "Sem instalações importadas, por favor, atualize a base interna."
            })
    }

}
