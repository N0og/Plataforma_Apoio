import { ConnectDBs } from "../../database/init";
import { IAcessosEAS } from "../../interfaces/ReportsInterfaces/IAcessosEAS";
import { DefaultTypesJSON } from "../../utils/bd/DefaultTypesJSON";
import DynamicParameters from "../../utils/reports/DynamicParameters";
import { SQL_ACESSOS_EAS } from "./SQL/SQLAcessosEAS";

export default class AcessosEASService{
    async execute(dbtype:string, dbClient:ConnectDBs, filtros_body:IAcessosEAS, filtros_query:any){

        const SQL = new SQL_ACESSOS_EAS();
        const DYNAMIC_PARAMETERS = new DynamicParameters()

        let SQL_BASE = SQL.getBase();
        let QUERY_FILTERS = ""

        if (filtros_body.data_inicial == null || !filtros_body.data_final == null){
            return new Error("Filtro de período obrigatório")
        }

        QUERY_FILTERS += "AND  DATE(DataHora) BETWEEN DATE(:dataInicial) AND DATE(:dataFinal)";
        DYNAMIC_PARAMETERS.Add("dataInicial", filtros_body.data_inicial)
        DYNAMIC_PARAMETERS.Add("dataFinal", filtros_body.data_final)

        SQL_BASE += 
            `
            ${QUERY_FILTERS}
            ${SQL.getFrom()}
            `

        const REPORT = await dbClient.getMariaDB().query(SQL_BASE, DYNAMIC_PARAMETERS.GetAll())

        return DefaultTypesJSON(REPORT[0])
    }
}