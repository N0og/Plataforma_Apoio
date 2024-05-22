import DynamicParameters from "../../utils/reports/DynamicParameters"
import { IProdutividadeUBS } from "../../interfaces/IProdutividadeUBS"
import { queryConvert } from "../../utils/bd/pg/pgPlaceHolders"
import { ConnectDBs } from "../../database/init"
import {SQL_PROD_UBS} from "./SQL"

export default class ProdutividadeUBS_ConsolidadoQuery {
    async execute(dbtype:string, dbClient:ConnectDBs, filtros_body: IProdutividadeUBS) {
        
        const parametros_dinamicos = new DynamicParameters()
        let query_base_filtros = ""

        const SQL = new SQL_PROD_UBS()

        let query_base = SQL.SQL_BASE
        

        if (filtros_body.data_inicial != null && filtros_body.data_final != null) {
            query_base_filtros += `
                and subquery.dt_registro between :data_inicio and :data_final
            `
            parametros_dinamicos.Add('data_inicio', filtros_body.data_inicial);
            parametros_dinamicos.Add('data_final', filtros_body.data_final);
        }

        if (filtros_body.cnes) {
            query_base_filtros += `
                and subquery."CNES" = :unidade
            `
            parametros_dinamicos.Add('unidade', filtros_body.cnes);
        }

        if (filtros_body.ine) {
            query_base_filtros += `
                and subquery."INE" = :equipe
            `
            parametros_dinamicos.Add('equipe', filtros_body.ine);
        }

        if (filtros_body.profissional) {
            query_base_filtros += `
                and subquery."PROFISSIONAL" = :profissional
            `
            parametros_dinamicos.Add('profissional', filtros_body.profissional);
        }


        if(filtros_body.cbo){
            query_base_filtros += `
                and subquery."CBO" = :cbo
            `
            parametros_dinamicos.Add('cbo', filtros_body.cbo);
        }
                 

        query_base += `${query_base_filtros} ${SQL.SQL_END}`
        

        const result = await dbClient.getPostgDB().query(queryConvert(query_base, parametros_dinamicos.GetAll()))
    
        return result.rows;
           
         
    }

}