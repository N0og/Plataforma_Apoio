import { DefaultTypesJSON } from "../utils/bd/DefaultTypesJSON"
import { queryConvert } from "../utils/bd/pg/pgPlaceHolders"
import DynamicParameters from "../utils/reports/DynamicParameters"
import { ConnectDBs } from "./init"

export async function ExecuteSQL(DBTYPE: string, SQL_COMMAND: string, DYNAMIC_PARAMETERS: DynamicParameters, dbClient: ConnectDBs): Promise<any[] | null>{

    if (DBTYPE === 'psql') {
        try {
            const REPORT = await dbClient.getPostgDB().query(queryConvert(SQL_COMMAND, DYNAMIC_PARAMETERS.GetAll()))
            return REPORT.rows
        } catch (error) {
            return null
        }
        
    }
    else {

        try {
            const REPORT = await dbClient.getMariaDB().query(SQL_COMMAND, DYNAMIC_PARAMETERS.GetAll())
            return DefaultTypesJSON(REPORT[0])
        } catch (error) {
            return null
        }  
        
    }

}