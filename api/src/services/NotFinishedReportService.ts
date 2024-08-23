import { ExecuteSQL } from "../database/execute";
import { ConnectDBs } from "../database/init";
import { INotFinishedReport } from "../interfaces";
import { DynamicParameters } from "../utils";
import { SQL_NOT_FINISHED } from "./SQL";

export class NotFinishedReportService {
    async execute(dbtype: string, dbClient: ConnectDBs, filtros_params: INotFinishedReport){
        const DYNAMIC_PARAMETERS = new DynamicParameters()

        const SQL = new SQL_NOT_FINISHED()

        let SQL_BASE = SQL.getBase()

        let SQL_WHERE = SQL.getWhere()

        let SQL_FROM = SQL.getFrom()

        if (filtros_params.data_inicial != null && filtros_params.data_final != null) {
            SQL_WHERE +=
            `
                and tb_atend.dt_inicio between :data_inicio and :data_final
            `
            DYNAMIC_PARAMETERS.Add('data_inicio', filtros_params.data_inicial);
            DYNAMIC_PARAMETERS.Add('data_final', filtros_params.data_final);
        }

        if (filtros_params.late !== undefined) {
            let late_param = Boolean(Number(filtros_params.late)) ? '1' : '0'
            SQL_WHERE +=
            `
                and tb_atend.st_registro_tardio = :late
            `
            DYNAMIC_PARAMETERS.Add('late', late_param)
        }

        if (filtros_params.schedule !== undefined) {
            let schedule_param = Boolean(Number(filtros_params.schedule)) ? 'IS NOT NULL' : 'IS NULL'
            SQL_WHERE +=
            `
                and tb_atend.co_agendado ${schedule_param}
            `
        }

        SQL_BASE += `${SQL_FROM}${SQL_WHERE}`

        const REPORT = await ExecuteSQL(dbtype, SQL_BASE, DYNAMIC_PARAMETERS, dbClient)

        if (!REPORT) return new Error('Falha na extração')

        return REPORT;
    }
}