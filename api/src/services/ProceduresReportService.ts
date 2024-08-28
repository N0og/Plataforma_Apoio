import { ExecuteSQL } from "../database/execute";
import { ConnectDBs } from "../database/init";
import { IProceduresReport } from "../interfaces";
import { DynamicParameters } from "../utils";
import { SQL_PROCEDURES } from "./SQL";

export class ProceduresReportService{
    async execute (dbtype: string, dbClient: ConnectDBs, filtros_params: IProceduresReport){
        const DYNAMIC_PARAMETERS = new DynamicParameters()

        const SQL = new SQL_PROCEDURES()

        let SQL_BASE = SQL.getBase()

        let SQL_FROM = SQL.getFrom()

        let SQL_WHERE = SQL.getWhere()

        let SQL_END = SQL.getEnd()

        if (filtros_params.data_inicial != null && filtros_params.data_final != null) {
            SQL_WHERE +=`and tdt.dt_registro between :data_inicio and :data_final`
            SQL.setDynamicWhere(`and tdt.dt_registro between :data_inicio and :data_final`)

            DYNAMIC_PARAMETERS.Add('data_inicio', filtros_params.data_inicial);
            DYNAMIC_PARAMETERS.Add('data_final', filtros_params.data_final);
        }

        //Filtros de consulta dinâmica.
        const DYNAMIC_FILTER_MAP = {
            citologico: SQL.getCitologico.bind(SQL),
            rastreamento_cito: SQL.getRastreamentoMicroFlora.bind(SQL),
            rastreamento_mama: SQL.getRastreamentoMama.bind(SQL),
            pre_natal_parceiro: SQL.getPreNatal.bind(SQL),
            visita_domiciliar: SQL.getVisitaDomiciliar.bind(SQL),
            diu: SQL.getDiu.bind(SQL)
        };

        if (filtros_params.procedures) {
            const procedures = Array.isArray(filtros_params.procedures) ? filtros_params.procedures : Array(filtros_params.procedures) as string[]
            for (const condition of procedures) {
                if (condition && DYNAMIC_FILTER_MAP[condition]) {
                    let dynamic_select: {select: string, from: string} = DYNAMIC_FILTER_MAP[condition]();
                    SQL_BASE += dynamic_select.select
                    SQL_FROM += dynamic_select.from
                }
            }
        }

        if (filtros_params.unit) {
            const units = Array.isArray(filtros_params.unit) ? filtros_params.unit : Array(filtros_params.unit) as string[]
            const formattedUnits = units.map(unit => `'${unit}'`);
            SQL_WHERE += `and (tdus.nu_cnes = ${formattedUnits.join(' or tdus.nu_cnes = ')})`;
        }

        if (filtros_params.professional) {
            const professionals = Array.isArray(filtros_params.professional) ? filtros_params.professional : Array(filtros_params.professional) as string[]
            const formattedProf = professionals.map(professional => `'${professional}'`);
            SQL_WHERE += `and (tdp.no_profissional = ${formattedProf.join(' or tdp.no_profissional = ')})`;
        }

        if (filtros_params.cbo) {
            const cbos = Array.isArray(filtros_params.cbo) ? filtros_params.cbo : Array(filtros_params.cbo) as string[]
            const formattedCbos = cbos.map(cbo => `'${cbo}'`);
            SQL_WHERE += `and (tdc.nu_cbo = ${formattedCbos.join(' or tdc.nu_cbo = ')})`;
        }

        SQL_BASE += `${SQL_FROM}${SQL_WHERE}${SQL_END}`

        const REPORT = await ExecuteSQL(dbtype, SQL_BASE, DYNAMIC_PARAMETERS, dbClient)

        if (!REPORT) return new Error('Falha na extração')

        return REPORT;
    }
}