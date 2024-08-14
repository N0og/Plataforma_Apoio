import { ConnectDBs } from "../../database/init";
import {
    IResultConnection,
    db_conn_error,
    IReportControllerRequest
} from "../../interfaces";

export async function handleIPSEAS(DB_CLIENT: ConnectDBs, IPSEAS: any, DB_TYPE: string, SERVICE_INSTANCE: any, req: IReportControllerRequest): Promise<IResultConnection> {

    let successful: number = 0
    const BD_ERROS: Array<db_conn_error> = []
    let result = []

    console.log(`PEDIDO IP: ${req.ip} - ${IPSEAS.dados.db_name_eas} - Connectando... `)
    if (await DB_CLIENT.changeDB(DB_TYPE, { database: IPSEAS.dados.db_name_eas }) instanceof Error) {
        console.log(`PEDIDO IP: ${req.ip} - ${IPSEAS.dados.db_name_eas} - Falha na conexão!... `)
        BD_ERROS.push({
            instalation_address: IPSEAS.dados.db_name_eas,
            traceback: "Falha na conexão de banco"
        });
        console.log(`PEDIDO IP: ${req.ip} - ${IPSEAS.dados.db_name_eas} - Conectado!... `)
        return {
            expected: IPSEAS.dados.length,
            successful: successful,
            errors: BD_ERROS,
            msg: "Falha na conexão com o BD.",
            extracted: false,
            result: result
        }
    }

    let service_return = await SERVICE_INSTANCE.execute(DB_TYPE, DB_CLIENT, req.query)

    if (!(service_return instanceof Error)) {
        result = result.concat(service_return);
        successful += 1
    }

    if (successful === 0) {
        return {
            expected: IPSEAS.dados.length,
            successful: successful,
            errors: BD_ERROS,
            msg: "Falha na extração.",
            extracted: false,
            result: result
        }
    }

    return {
        expected: IPSEAS.dados.length,
        successful: successful,
        errors: BD_ERROS,
        msg: "Concluído sem erros.",
        extracted: true,
        result: result
    }


}