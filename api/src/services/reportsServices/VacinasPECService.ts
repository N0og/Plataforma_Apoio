import { ExecuteSQL } from "../../database/execute";
import { ConnectDBs } from "../../database/init";
import { IVacinasPEC } from "../../interfaces";
import DynamicParameters from "../../utils/reports/DynamicParameters";
import { SQL_VAC_PEC } from "./SQL/SQLVacinasPEC";


export class VacinasPECService {
    async execute(dbtype: string, dbClient: ConnectDBs, filtros_params: IVacinasPEC) {

        const SQL = new SQL_VAC_PEC()
        const DYNAMIC_PARAMETERS = new DynamicParameters()

        let SQL_BASE = SQL.getBase()
        let SQL_FROM = SQL.getFrom()

        if (filtros_params.data_inicial && filtros_params.data_final) {

            SQL_FROM += `
                AND tdt.dt_registro BETWEEN :data_inicial AND :data_final
            `
            DYNAMIC_PARAMETERS.Add('data_inicial', filtros_params.data_inicial)
            DYNAMIC_PARAMETERS.Add('data_final', filtros_params.data_final)
        }

        if (filtros_params.imunobiologico && filtros_params.imunobiologico.length > 0) {

            const tupleString = filtros_params.imunobiologico.map(item => `'${item}'`).join(',');

            SQL_FROM += `
                AND tdi.sg_imunobiologico in (:imunobiologicos)
            `
            DYNAMIC_PARAMETERS.Add('imunobiologicos', tupleString)
        }


        /*
        if (filtros_params.idade_ano_inicio && filtros_params.idade_mes_inicio && filtros_params.idade_ano_final && filtros_params.idade_mes_final) {
            const interval_inicio = `${filtros_params.idade_ano_inicio} years ${filtros_params.idade_mes_inicio} months`
            const interval_final = `${filtros_params.idade_ano_final} years ${filtros_params.idade_mes_final} months`

            SQL_FROM += `
                AND Age(tdt.dt_registro, tfvac.dt_nascimento) BETWEEN INTERVAL :idade_inicio AND INTERVAL :idade_final
            `
            DYNAMIC_PARAMETERS.Add('idade_inicio', interval_inicio)
            DYNAMIC_PARAMETERS.Add('idade_final', interval_final)
        }


        else if (filtros_params.idade_ano_inicio && filtros_params.idade_mes_inicio) {
            SQL_FROM += `
                AND Age(tdt.dt_registro, tfvac.dt_nascimento) >= INTERVAL ':idade_ano_inicio years :idade_mes_inicio months'
            `
            DYNAMIC_PARAMETERS.Add('idade_ano_inicio', filtros_params.idade_ano_inicio)
            DYNAMIC_PARAMETERS.Add('idade_mes_inicio', filtros_params.idade_ano_inicio)
        }

        else if (filtros_params.idade_ano_final && filtros_params.idade_mes_final) {
            SQL_FROM += `
                AND Age(tdt.dt_registro, tfvac.dt_nascimento) <= INTERVAL ':idade_ano_final years :idade_mes_final months'
            `
            DYNAMIC_PARAMETERS.Add('idade_ano_final', filtros_params.idade_ano_final)
            DYNAMIC_PARAMETERS.Add('idade_mes_final', filtros_params.idade_mes_final)
        }*/


        SQL_BASE += SQL_FROM += SQL.getEnd()


        const REPORT = await ExecuteSQL(dbtype, SQL_BASE, DYNAMIC_PARAMETERS, dbClient)

        if (!REPORT) return new Error('Falha na extração')

        return REPORT;
    }
}