import { ExecuteSQL } from "../database/execute";
import { ConnectDBs } from "../database/init";
import { DynamicParameters } from "../utils";
import { SQL_PEC_VERSION } from "./SQL";

export class VersionPecReportService {
    async execute(dbtype: string, dbClient: ConnectDBs, filtros_params: any) {

        const DYNAMIC_PARAMETERS = new DynamicParameters()

        const SQL = new SQL_PEC_VERSION()

        const SQL_BASE = SQL.getBase()

        const REPORT = await ExecuteSQL(dbtype, SQL_BASE, DYNAMIC_PARAMETERS, dbClient)

        if (!REPORT) return new Error('Falha na extração')

        return REPORT;
    }
}