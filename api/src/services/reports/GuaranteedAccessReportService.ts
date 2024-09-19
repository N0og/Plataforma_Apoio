import { ExecuteSQL } from "../../database/execute";
import { ConnectDBs } from "../../database/init";
import { IGenericFilterPEC } from "../../interfaces";
import { DynamicParameters } from "../../utils";
import { SQL_GUARANTEED_ACCESS } from "./SQL";

export class GuaranteedAccessReportService {
    async execute(dbtype: string, dbClient: ConnectDBs, filtros_params: IGenericFilterPEC) {

        const DYNAMIC_PARAMETERS = new DynamicParameters()

        const SQL = new SQL_GUARANTEED_ACCESS()

        let SQL_BASE = SQL.getBase()
        
        let SQL_FROM = SQL.getFrom()

        let SQL_WHERE = SQL.getWhere()

        let SQL_END = SQL.getEnd()


        if (filtros_params.data_inicial && filtros_params.data_final){
            SQL_WHERE += 'AND tle.dt_entrada between :datainicio and :datafinal'
            DYNAMIC_PARAMETERS.Add('datainicio', filtros_params.data_inicial)
            DYNAMIC_PARAMETERS.Add('datafinal', filtros_params.data_final)
        }

        if (filtros_params.unit){
            const units = Array.isArray(filtros_params.unit) ? filtros_params.unit : Array(filtros_params.unit) as string[]
            const formattedUnits = units.map(unit => `'${unit}'`);
            SQL_WHERE += `AND (tus.nu_cnes = ${formattedUnits.join(' or tus.nu_cnes = ')})`;
        }

        if (filtros_params.team) {
            const teams = Array.isArray(filtros_params.team) ? filtros_params.team : Array(filtros_params.team) as string[]
            const formattedTeams = teams.map(team => `'${team}'`);
            SQL_WHERE += `AND (te.nu_ine = ${formattedTeams.join(' or te.nu_ine = ')})`;
        }

        SQL_BASE += `${SQL_FROM}${SQL_WHERE}${SQL_END}`

        const REPORT = await ExecuteSQL(dbtype, SQL_BASE, DYNAMIC_PARAMETERS, dbClient)

        if (!REPORT) return new Error('Falha na extração')

        return REPORT;
    }
}