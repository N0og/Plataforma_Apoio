import { Response, NextFunction } from "express";
import { ConnEASRepository, ConneSUSRepository, municipioRepository } from "../database/repository/API_DB_Repositorys";
import { IReportControllerRequest } from "../interfaces/ControllersInterfaces/IReportController";

export default class CheckDBTypeMiddleware {

    ConnRepository: typeof ConnEASRepository | typeof ConneSUSRepository | null = null;

    execute = async (req: IReportControllerRequest, res: Response, next: NextFunction) => {

        if (['dbtype', 'download','order'].filter(prop => !req.query.hasOwnProperty(prop)).length > 0){
            return res.status(400).json({ error: 'Solicitação Incorreta: Sintaxe de solicitação malformada'})
        }

        if (req.query.dbtype?.toString().toLocaleLowerCase() === 'mdb'){
            this.ConnRepository = ConnEASRepository;
            req.dbtype = "mdb"
            
        }
        else if(req.query.dbtype?.toString().toLocaleLowerCase() === 'psql'){
            this.ConnRepository = ConneSUSRepository;
            req.dbtype = "psql"
        }

        else {
            return res.status(400).json({error:'Driver DB não compatível.'})
        }

        if (typeof req.query.download === 'undefined') req.download = false

        if (req.query.order === "") return res.status(400).json({ error: 'Nenhum pedido requisitado.'})

        else req.download = Boolean(req.query.download) ? req.query.download === "true" : false

        if (req.query.order!.toString().toLocaleLowerCase() == 'all'){
            if (req.download){
                let _municipios = await municipioRepository.find()

                if (!_municipios){
                    console.error("Falha na solicitação")
                    return res.status(404).json({ error: 'Nenhum cliente encontrado.' })
                }
                const _CONNECTIONS = _municipios.map(client=>{
                    return client.no_municipio
                })
                req.order = _CONNECTIONS
            }
            else{
                console.error("Falha na solicitação")
                return res.status(400).json({ error: 'Falha na solicitação' })
            }
        }

        else{
            req.order = Array.isArray(req.query.order) ? req.query.order : Array(req.query.order) as string[]
        }

        next()
    }
}