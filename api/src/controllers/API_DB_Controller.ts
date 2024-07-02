import { Response, Request } from "express";
import UpdateDBService from "../services/dbServices/UpdateDBService";
import ProcessDBService from "../services/dbServices/ProcessDBService";
import { ConneSUSRepository, instalacaoESUSRepository, processamentoRepository } from "../database/repository/API_DB_Repositorys";
import { ConnectDBs } from "../database/init";

export default class API_DB_Controller {
    async executeHandler(req: Request, res: Response, serviceClass: any, serviceParams: any) {
        try {

            const serviceInstance = new serviceClass();
            const result = await serviceInstance.execute(serviceParams);

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
        this.executeHandler(req, res, UpdateDBService, {})
    }


    handleProcessDb = async (req: Request, res: Response) => {

        const dbClient = new ConnectDBs();

        const CONN_ESUS = await ConneSUSRepository.find()

        const ERROR: any[] = []

        let counter = 0

        if (CONN_ESUS) {
            for (const conn of CONN_ESUS) {
                console.log(conn.dados.municipio, conn.dados.instalacao_esus, conn.dados.ip_esus)

                const CHANGED = await dbClient.changeDB('psql', {
                    host: conn.dados.ip_esus!,
                    port: conn.dados.port_esus!,
                    user: conn.dados.db_user_esus!,
                    password: conn.dados.db_password_esus!
                })

                if (CHANGED instanceof Error) {
                    const err = {
                        uf: conn.dados.uf!,
                        municipio: conn.dados.municipio!,
                        instalacao: conn.dados.ip_esus!,
                        message: "Falha na conexão com Banco de Dados."
                    }

                    ERROR.push(err)

                    await instalacaoESUSRepository.update({ id_instalacao_esus: conn.dados.id_instalacao_esus! },
                        {
                            sucess_process: err.message
                        })
                    continue
                }

                console.log("Conectado.")
                counter += 1
                const DB = dbClient.getPostgDB()
                await new ProcessDBService().execute(DB, conn)
                console.log("Processado.")
                continue
            }

            await processamentoRepository.insert({
                nu_instalacoes_processadas: counter
            })

            return res.json(
                {
                    status: 200,
                    erros: ERROR
                })

        }

        return res.status(500).json(
            {
                status: 500,
                erros: "Sem instalações importadas, por favor, atualize a base interna."
            })
    }

}
