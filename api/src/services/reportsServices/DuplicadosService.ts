import { ConnectDBs } from "../../database/init";
import { SQL_DUP_PEC } from "./SQL";

export default class DuplicadosPECQuery{
    async execute(dbClient:ConnectDBs ,filtros_body:any){

        const SQL = new SQL_DUP_PEC()
        
        const query_base = SQL.SQL_BASE

        const result = await dbClient.getPostgDB().query(query_base)
    
        return result.rows;
    }
}