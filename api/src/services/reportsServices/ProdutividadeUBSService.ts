import DynamicParameters from "../../utils/reports/DynamicParameters"
import { IFilterProdutividadeUBS } from "../../interfaces/IProdutividadeUBS"
import { queryConvert } from "../../utils/bd/pg/pgPlaceHolders"
import { ConnectDBs } from "../../database/init"
import {SQL_PROD_UBS} from "./SQL"
import { ExecuteSQL } from "../../database/execute"

export default class ProdutividadeUBS_ConsolidadoQuery {
    async execute(dbtype:string, dbClient:ConnectDBs, filtros_params: IFilterProdutividadeUBS) {
        
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

        if (filtros_params.cnes != null) {
            QUERY_FILTERS += 
            `
                and subquery."CNES" = :unidade
            `
            DYNAMIC_PARAMETERS.Add('unidade', filtros_params.cnes);
        }

        if (filtros_params.ine != null) {
            QUERY_FILTERS += 
            `
                and subquery."INE" = :equipe
            `
            DYNAMIC_PARAMETERS.Add('equipe', filtros_params.ine);
        }

        if (filtros_params.profissional != null) {
            QUERY_FILTERS += 
            `
                and subquery."PROFISSIONAL" = :profissional
            `
            DYNAMIC_PARAMETERS.Add('profissional', filtros_params.profissional);
        }


        if(filtros_params.cbo != null){
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