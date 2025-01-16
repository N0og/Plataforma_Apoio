import { ExecuteSQL } from "../../database/execute";
import { ConnectDBs } from "../../database/init";
import { IGenericFilterPEC } from "../../interfaces";
import { DynamicParameters } from "../../utils";
import { SQL_GUARANTEED_ACCESS, SQL_RAAS } from "./SQL";

export class RaasReportService {
    async execute(dbtype: string, dbClient: ConnectDBs, filtros_params: IGenericFilterPEC) {

        const DYNAMIC_PARAMETERS = new DynamicParameters()

        const SQL = new SQL_RAAS()

        let SQL_BASE = SQL.getBase()

        let SQL_END = SQL.getEnd()


        if (filtros_params.data_inicial && filtros_params.data_final){
            SQL_BASE += 'AND tdtcad.dt_registro between :datainicio and :datafinal'
            DYNAMIC_PARAMETERS.Add('datainicio', filtros_params.data_inicial)
            DYNAMIC_PARAMETERS.Add('datafinal', filtros_params.data_final)
        }

        if (filtros_params.unit){
            const units = Array.isArray(filtros_params.unit) ? filtros_params.unit : Array(filtros_params.unit) as string[]
            const formattedUnits = units.map(unit => `'${unit}'`);
            SQL_BASE += `AND (tdus.nu_cnes = ${formattedUnits.join(' or tdus.nu_cnes = ')})`;
        }

        if (filtros_params.team) {
            const teams = Array.isArray(filtros_params.team) ? filtros_params.team : Array(filtros_params.team) as string[]
            const formattedTeams = teams.map(team => `'${team}'`);
            SQL_BASE += `AND (tde.nu_ine = ${formattedTeams.join(' or tde.nu_ine = ')})`;
        }

        SQL_BASE += `${SQL_END}`

        const REPORT = await ExecuteSQL(dbtype, SQL_BASE, DYNAMIC_PARAMETERS, dbClient)

        if (!REPORT) return new Error('Falha na extração')

        return REPORT;
    }
}