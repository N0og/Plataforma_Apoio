import { Response, NextFunction } from "express";
import { ConnEASRepository, ConneSUSRepository, municipioRepository } from "../database/repository/API_DB_Repositorys";
import { IReportControllerRequest } from "../interfaces/ControllersInterfaces/IReportController";

export default class CheckDBTypeMiddleware {

    ConnRepository: typeof ConnEASRepository | typeof ConneSUSRepository | null = null;

    execute = async (req: IReportControllerRequest, res: Response, next: NextFunction) => {

        if (req.query.dbtype === 'mdb'){
            this.ConnRepository = ConnEASRepository;
            req.dbtype = "mdb"
            
        }
        else if(req.query.dbtype === 'psql'){
            this.ConnRepository = ConneSUSRepository;
            req.dbtype = "psql"
        }

        else {
            return res.status(400).json({error:'Driver DB não compatível.'})
        }

        if (!this.ConnRepository) {
            return res.status(500).json({ error: 'Repositório de conexão não definido.' });
        }

        if (typeof req.query.download === 'undefined'){
            req.download = false
            
        }
        else req.download = Boolean(req.query.download) ? req.query.download === "true" : false

        if (!req.query.dbname){
            if (req.download){
                let _municipios = await municipioRepository.find()

                if (!_municipios){
                    console.error("Falha na solicitação")
                    return res.status(400).json({ error: 'Nenhum cliente encontrado.' })
                }
                const _CONNECTIONS = _municipios.map(client=>{
                    return client.no_municipio
                })
                req.dbname = _CONNECTIONS
            }
            else{
                console.error("Falha na solicitação")
                return res.status(400).json({ error: 'Falha na solicitação' })
            }
        }
        else{
            req.dbname = Array.isArray(req.query.dbname) ? req.query.dbname : Array(req.query.dbname) as string[]
        }
        

        if (typeof req.query.organize === 'undefined'){
            req.organize = false
        }
        else req.organize = Boolean(req.query.organize) ? req.query.organize === 'true': false

        next()
    }
}