import { ExecuteSQL } from "../database/execute";
import { ConnectDBs } from "../database/init";
import { IOralCareReport } from "../interfaces";
import { DynamicParameters } from "../utils";
import { SQL_PROD_ORAL_CARE } from "./SQL";

export class OralCareReportService{
    async execute (dbtype: string, dbClient: ConnectDBs, filtros_params: IOralCareReport){
        const DYNAMIC_PARAMETERS = new DynamicParameters()

        const SQL = new SQL_PROD_ORAL_CARE()

        let SQL_BASE = SQL.getBase()

        let SQL_FROM = SQL.getFrom()

        let SQL_WHERE = SQL.getWhere()

        let SQL_END = SQL.getEnd()

        //Filtros de consulta dinâmica.
        const DYNAMIC_FILTER_MAP = {
            escovacao_supervisionada: SQL.getEscovSuper.bind(SQL),
            tratamento_concluido: SQL.getTratConcluido.bind(SQL),
            curativo_demora: SQL.getCurativoDem.bind(SQL),
            aplicacao_fluor: SQL.getFluor.bind(SQL),
            orientacao_saude: SQL.getOrientacao.bind(SQL),
            profilaxia: SQL.getProfilaxia.bind(SQL),
            exodontia: SQL.getExodontia.bind(SQL),
            tra: SQL.getTra.bind(SQL)
        };

        if (filtros_params.cares) {
            const cares = Array.isArray(filtros_params.cares) ? filtros_params.cares : Array(filtros_params.cares) as string[]
            for (const condition of cares) {
                if (condition && DYNAMIC_FILTER_MAP[condition]) {
                    let dynamic_select: {select: string, from: string} = DYNAMIC_FILTER_MAP[condition]();
                    SQL_BASE += dynamic_select.select
                    SQL_FROM += dynamic_select.from
                }
            }
        }

        if (filtros_params.data_inicial != null && filtros_params.data_final != null) {
            SQL_WHERE +=`and tdt.dt_registro between :data_inicio and :data_final`

            DYNAMIC_PARAMETERS.Add('data_inicio', filtros_params.data_inicial);
            DYNAMIC_PARAMETERS.Add('data_final', filtros_params.data_final);
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