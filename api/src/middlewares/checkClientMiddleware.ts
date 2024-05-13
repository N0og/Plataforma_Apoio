import { Request, Response, NextFunction } from "express";
import { ipsRepository } from "../database/repository/DBRepositorys";
import { copyFileSync } from "fs";



export default class CheckClientMiddleware {
    async execute(req: Request, res: Response, next: NextFunction) {
        const { dbname } = req.query

        const IPS = await ipsRepository.createQueryBuilder("jsonIP")
                .select("dados->>'municipio'", "municipio")
                .distinct(true).getRawMany()

        if (!(Object.values(IPS).some(valor => valor.municipio === dbname))){
            return res.status(400).json({error:'Cliente não identificado'})
        }

        next()
    }
}