import { ExecuteSQL } from "../database/execute";
import { ConnectDBs } from "../database/init";
import { IVacinasPEC } from "../interfaces";
import { DynamicParameters } from "../utils";
import { SQL_VACCINES } from "./SQL";


export class VaccinesReportService {
    async execute(dbtype: string, dbClient: ConnectDBs, filtros_params: IVacinasPEC) {

        const SQL = new SQL_VACCINES()
        const DYNAMIC_PARAMETERS = new DynamicParameters()

        let SQL_BASE = SQL.getBase()
        let SQL_FROM = SQL.getFrom()

        if (filtros_params.unit) {
            const units = Array.isArray(filtros_params.unit) ? filtros_params.unit : Array(filtros_params.unit) as string[]
            const formattedUnits = units.map(unit => `'${unit}'`);
            SQL_FROM += `AND (tdus.nu_cnes = ${formattedUnits.join(" or tdus.nu_cnes = ")})`;
        }

        if (filtros_params.team) {
            const teams = Array.isArray(filtros_params.team) ? filtros_params.team : Array(filtros_params.team) as string[]
            const formattedTeams = teams.map(team => `'${team}'`);
            SQL_FROM += `AND (tde.nu_ine = ${formattedTeams.join(" or tde.nu_ine = ")})`;
        }

        if (filtros_params.imunos) {
            const imunos = Array.isArray(filtros_params.imunos) ? filtros_params.imunos : Array(filtros_params.imunos) as string[]
            const formattedImunos = imunos.map(imuno => `'${imuno}'`);
            SQL_FROM += `AND (tdi.nu_identificador = ${formattedImunos.join(" or tdi.nu_identificador = ")})`;
        }

        if (filtros_params.data_inicial && filtros_params.data_final) {

            SQL_FROM += `
                AND tdt.dt_registro BETWEEN :data_inicial AND :data_final
            `
            DYNAMIC_PARAMETERS.Add('data_inicial', filtros_params.data_inicial)
            DYNAMIC_PARAMETERS.Add('data_final', filtros_params.data_final)
        }

        if (filtros_params.idade_ano_inicio && filtros_params.idade_mes_inicio && filtros_params.idade_ano_final && filtros_params.idade_mes_final) {
            const interval_inicio = `'${filtros_params.idade_ano_inicio} years ${filtros_params.idade_mes_inicio} months'`
            const interval_final = `'${filtros_params.idade_ano_final} years ${filtros_params.idade_mes_final} months'`

            SQL_FROM += `
                AND Age(tdt.dt_registro, tfvac.dt_nascimento) BETWEEN INTERVAL ${interval_inicio} AND INTERVAL ${interval_final}
            `
        }


        else if (filtros_params.idade_ano_inicio && filtros_params.idade_mes_inicio) {
            const interval_inicio = `'${filtros_params.idade_ano_inicio} years ${filtros_params.idade_mes_inicio} months'`

            SQL_FROM += `
                AND Age(tdt.dt_registro, tfvac.dt_nascimento) >= INTERVAL ${interval_inicio}
            `
        }

        else if (filtros_params.idade_ano_final && filtros_params.idade_mes_final) {
            const interval_final = `'${filtros_params.idade_ano_final} years ${filtros_params.idade_mes_final} months'`

            SQL_FROM += `
                AND Age(tdt.dt_registro, tfvac.dt_nascimento) <= INTERVAL ${interval_final}
            `
        }


        SQL_BASE += SQL_FROM += SQL.getEnd()

        const REPORT = await ExecuteSQL(dbtype, SQL_BASE, DYNAMIC_PARAMETERS, dbClient)

        if (!REPORT) return new Error('Falha na extração')

        return REPORT;
    }
}