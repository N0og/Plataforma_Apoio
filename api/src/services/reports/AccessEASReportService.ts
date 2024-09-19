import { ExecuteSQL } from "../../database/execute";
import { ConnectDBs } from "../../database/init";
import { IAcessosEAS } from "../../interfaces";
import { DynamicParameters } from "../../utils";
import { SQL_ACCESS_EAS } from "./SQL";

export class AccessEASReportService {
    async execute(dbtype: string, dbClient: ConnectDBs, filtros_params: IAcessosEAS) {

        const SQL = new SQL_ACCESS_EAS();
        const DYNAMIC_PARAMETERS = new DynamicParameters()

        let SQL_BASE = SQL.getBase();
        let QUERY_FILTERS = ""

        if (filtros_params.data_inicial == null || !filtros_params.data_final == null) {
            return new Error("Filtro de período obrigatório")
        }

        QUERY_FILTERS += "AND  DATE(DataHora) BETWEEN DATE(:dataInicial) AND DATE(:dataFinal)";
        DYNAMIC_PARAMETERS.Add("dataInicial", filtros_params.data_inicial)
        DYNAMIC_PARAMETERS.Add("dataFinal", filtros_params.data_final)

        SQL_BASE +=
            `
            ${QUERY_FILTERS}
            ${SQL.getFrom()}
            `

        const REPORT = await ExecuteSQL(dbtype, SQL_BASE, DYNAMIC_PARAMETERS, dbClient)

        if (!REPORT) return new Error('Falha na extração')

        return REPORT;
    }
}