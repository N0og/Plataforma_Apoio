import { DynamicParameters } from "../utils"
import { IFilterProdutividadeUBS } from "../interfaces"
import { ConnectDBs } from "../database/init"
import { SQL_PROD_UBS } from "./SQL"
import { ExecuteSQL } from "../database/execute"

export class TeamProductivityReportService {
    async execute(dbtype: string, dbClient: ConnectDBs, filtros_params: IFilterProdutividadeUBS) {

        const DYNAMIC_PARAMETERS = new DynamicParameters()
        let QUERY_FILTERS = ""

        const SQL = new SQL_PROD_UBS()

        let SQL_BASE = SQL.getBase()


        if (filtros_params.data_inicial != null && filtros_params.data_final != null) {
            QUERY_FILTERS +=
                `
                and subquery.dt_registro between :data_inicio and :data_final
            `
            DYNAMIC_PARAMETERS.Add('data_inicio', filtros_params.data_inicial);
            DYNAMIC_PARAMETERS.Add('data_final', filtros_params.data_final);
        }


        if (filtros_params.unit) {
            const units = Array.isArray(filtros_params.unit) ? filtros_params.unit : Array(filtros_params.unit) as string[]
            const formattedUnits = units.map(unit => `'${unit}'`);
            QUERY_FILTERS += `AND (subquery."CNES" = ${formattedUnits.join(' or subquery."CNES" = ')})`;
        }

        if (filtros_params.team) {
            const teams = Array.isArray(filtros_params.team) ? filtros_params.team : Array(filtros_params.team) as string[]
            const formattedTeams = teams.map(team => `'${team}'`);
            QUERY_FILTERS += `AND (subquery."INE" = ${formattedTeams.join(' or subquery."INE" = ')})`;
        }

        if (filtros_params.profissional != null) {
            QUERY_FILTERS +=
                `
                and subquery."PROFISSIONAL" = :profissional
            `
            DYNAMIC_PARAMETERS.Add('profissional', filtros_params.profissional);
        }


        if (filtros_params.cbo != null) {
            QUERY_FILTERS +=
                `
                and subquery."CBO" = :cbo
            `
            DYNAMIC_PARAMETERS.Add('cbo', filtros_params.cbo);
        }


        SQL_BASE += `${QUERY_FILTERS}${SQL.getFrom()}`

        const REPORT = await ExecuteSQL(dbtype, SQL_BASE, DYNAMIC_PARAMETERS, dbClient)

        if (!REPORT) return new Error('Falha na extração')

        return REPORT;


    }

}