import DynamicParameters from "../../utils/reports/DynamicParameters"
import { IFilterProdutividadeUBS } from "../../interfaces/ReportsInterfaces/IProdutividadeUBS"
import { queryConvert } from "../../utils/bd/pg/pgPlaceHolders"
import { ConnectDBs } from "../../database/init"
import {SQL_PROD_UBS} from "./SQL"

export default class ProdutividadeUBS_ConsolidadoQuery {
    async execute(dbtype:string, dbClient:ConnectDBs, filtros_body: IFilterProdutividadeUBS) {
        
        const DYNAMIC_PARAMETERS = new DynamicParameters()
        let QUERY_FILTERS = ""

        const SQL = new SQL_PROD_UBS()

        let SQL_BASE = SQL.getBase()
        

        if (filtros_body.data_inicial != null && filtros_body.data_final != null) {
            QUERY_FILTERS += 
            `
                and subquery.dt_registro between :data_inicio and :data_final
            `
            DYNAMIC_PARAMETERS.Add('data_inicio', filtros_body.data_inicial);
            DYNAMIC_PARAMETERS.Add('data_final', filtros_body.data_final);
        }

        if (filtros_body.cnes != null) {
            QUERY_FILTERS += 
            `
                and subquery."CNES" = :unidade
            `
            DYNAMIC_PARAMETERS.Add('unidade', filtros_body.cnes);
        }

        if (filtros_body.ine != null) {
            QUERY_FILTERS += 
            `
                and subquery."INE" = :equipe
            `
            DYNAMIC_PARAMETERS.Add('equipe', filtros_body.ine);
        }

        if (filtros_body.profissional != null) {
            QUERY_FILTERS += 
            `
                and subquery."PROFISSIONAL" = :profissional
            `
            DYNAMIC_PARAMETERS.Add('profissional', filtros_body.profissional);
        }


        if(filtros_body.cbo != null){
            QUERY_FILTERS += 
            `
                and subquery."CBO" = :cbo
            `
            DYNAMIC_PARAMETERS.Add('cbo', filtros_body.cbo);
        }
                 

        SQL_BASE += `${QUERY_FILTERS}${SQL.getFrom()}`

        const REPORT = await dbClient.getPostgDB().query(queryConvert(SQL_BASE, DYNAMIC_PARAMETERS.GetAll()))

        return REPORT.rows;
           
         
    }

}