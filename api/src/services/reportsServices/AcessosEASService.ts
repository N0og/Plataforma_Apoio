import { ConnectDBs } from "../../database/init";
import { DefaultTypesJSON } from "../../utils/bd/DefaultTypesJSON";
import DynamicParameters from "../../utils/reports/DynamicParameters";
import { SQL_ACESSOS_EAS } from "./SQL/SQLAcessosEAS";

export default class AcessosEASService{
    async execute(dbtype:string, dbClient:ConnectDBs, filtros_body:any, filtros_query:any){

        const SQL = new SQL_ACESSOS_EAS()

        let query_base = SQL.SQL_BASE

        const parametros_dinamicos = new DynamicParameters()
        let query_base_filtros = ""

        if (!filtros_body.data_inicial || !filtros_body.data_final){
            return new Error("Filtro de período obrigatório")
        }

        query_base_filtros += "AND  DATE(DataHora) BETWEEN DATE(:dataInicial) AND DATE(:dataFinal)";
        parametros_dinamicos.Add("dataInicial", filtros_body.data_inicial)
        parametros_dinamicos.Add("dataFinal", filtros_body.data_final)

        query_base += `${query_base_filtros}${SQL.SQL_END}`

        const result = await dbClient.getMariaDB().query(query_base, parametros_dinamicos.GetAll())

        return DefaultTypesJSON(result[0])
    }
}