import { Response, NextFunction } from "express"
import { IReportControllerRequest } from "../interfaces"

export class ExtractRulesMiddleware {
    execute = async (req: IReportControllerRequest, res: Response, next: NextFunction) => {

        if (req.download && req.dbtype === 'psql' && req.order!.length > 3){
            return res.status(400).json({ msg: 'Excesso de municípios solicitados.' });
        }

        if (!req.download && req.dbtype === 'psql' && req.order!.length > 1){
            return res.status(400).json({ msg: 'Excesso de municípios solicitados.' });
        }

        next()
    }
}