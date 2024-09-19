import { ExecuteSQL } from "../../database/execute";
import { ConnectDBs } from "../../database/init";
import { IOralCareReport } from "../../interfaces";
import { DynamicParameters } from "../../utils";
import { SQL_PROD_ORAL_CARE } from "./SQL";
import { SQL_ORAL_HEALTH } from "./SQL/SQLOralHealth";

export class OralHealthReportService {
    async execute(dbtype: string, dbClient: ConnectDBs, filtros_params: IOralCareReport) {
        const DYNAMIC_PARAMETERS = new DynamicParameters()

        const SQL = new SQL_ORAL_HEALTH()

        let SQL_BASE = SQL.getBase()

        let SQL_FROM = SQL.getFrom()

        let SQL_WHERE = SQL.getWhere()

        let SQL_END = SQL.getEnd()

        if (filtros_params.data_inicial != null && filtros_params.data_final != null) {
            DYNAMIC_PARAMETERS.Add('data_inicio', filtros_params.data_inicial);
            DYNAMIC_PARAMETERS.Add('data_final', filtros_params.data_final);
        }

        if (filtros_params.unit) {
            const units = Array.isArray(filtros_params.unit) ? filtros_params.unit : Array(filtros_params.unit) as string[]
            const formattedUnits = units.map(unit => `'${unit}'`);
            SQL_WHERE += `and (tdus.nu_cnes = ${formattedUnits.join(' or tdus.nu_cnes = ')})`;
        }

        //Filtros de consulta dinâmica.
        const DYNAMIC_FILTER_MAP = {
            pupulacao: SQL.getPopulacao.bind(SQL),
            pessoasattnd: SQL.getPessoasAttnd.bind(SQL),
            procedimento: SQL.getProcedimentos.bind(SQL),
            attnds: SQL.getAttndRealizado.bind(SQL),
            tratamento_concluido: SQL.getTratConcluido.bind(SQL),
            ppt: SQL.getPPT.bind(SQL),
            exodontia: SQL.getExodontia.bind(SQL),
            preventivas: SQL.getPreventivos.bind(SQL),
            restauracao: SQL.getRestauracao.bind(SQL),
            tra: SQL.getTra.bind(SQL)
        };

        
        for (const condition of Object.keys(DYNAMIC_FILTER_MAP)) {
            if (condition && DYNAMIC_FILTER_MAP[condition]) {
                let dynamic_select: { select: string, from: string } = DYNAMIC_FILTER_MAP[condition]();
                SQL_BASE += dynamic_select.select
                SQL_FROM += dynamic_select.from
            }
        }

        SQL_BASE += `${SQL_FROM}${SQL_WHERE}${SQL_END}`

        const REPORT = await ExecuteSQL(dbtype, SQL_BASE, DYNAMIC_PARAMETERS, dbClient)

        if (!REPORT) return new Error('Falha na extração')

        return REPORT;
    }
}