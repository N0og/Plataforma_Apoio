import { ConnectDBs } from "../../database/init";
import { SQL_DUP_PEC } from "./SQL";

export default class DuplicadosPECQuery{
    async execute(dbtype:string, dbClient:ConnectDBs, filtros_body:any){

        const SQL = new SQL_DUP_PEC()
        
        const SQL_BASE = SQL.getBase()

        const REPORT = await dbClient.getPostgDB().query(SQL_BASE)
    
        return REPORT.rows;
    }
}