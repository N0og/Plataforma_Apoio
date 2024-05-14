import { Request, Response, NextFunction } from "express";
import { ConnEASRepository, ConneSUSRepository } from "../database/repository/DBRepositorys";

export default class CheckClientMiddleware {

    ConnRepository: typeof ConnEASRepository | typeof ConneSUSRepository | null = null;

    execute = async (req: Request, res: Response, next: NextFunction) => {
        const { dbname, dbtype } = req.query

        if (dbtype === 'mdb'){
            this.ConnRepository = ConnEASRepository;
            req.query.dbtype = "mdb"
        }
        else if(dbtype === 'psql'){
            this.ConnRepository = ConneSUSRepository;
            req.query.dbtype = "psql"
        }

        else {
            return res.status(400).json({error:'Driver DB não compatível.'})
        }

        if (!this.ConnRepository) {
            return res.status(500).json({ error: 'Repositório de conexão não definido.' });
        }

        const IPS = await this.ConnRepository.createQueryBuilder("jsonIP")
                .select("dados->>'municipio'", "municipio")
                .distinct(true).getRawMany()

        if (!(Object.values(IPS).some(valor => valor.municipio === dbname))){
            return res.status(400).json({error:'Cliente não identificado'})
        }

        next()
    }
}