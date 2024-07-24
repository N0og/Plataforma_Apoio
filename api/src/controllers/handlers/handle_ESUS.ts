import { ConnectDBs } from "../../database/init";
import { IReportControllerRequest } from "../../interfaces/IReportController";
import { IResultConnection, db_conn_error } from "../../interfaces/IResultConnection";

export async function handleIPSESUS(DB_CLIENT: ConnectDBs, IPSESUS: any[], DB_TYPE: string, SERVICE_INSTANCE: any, req: IReportControllerRequest): Promise<IResultConnection> {
    
    let successful: number = 0
    const BD_ERROS: Array<db_conn_error> = []
    let result = []

    for (let installation of IPSESUS) {
        const installation_local_name = installation.dados.municipio;

        console.log(`${installation_local_name} - Connectando: ${installation.dados.instalacao_esus}... `)

        if (await DB_CLIENT.changeDB(DB_TYPE, {
            host: installation.dados.ip_esus,
            port: installation.dados.port_esus,
            database: installation.dados.db_name_esus,
            user: installation.dados.db_user_esus,
            password: installation.dados.db_password_esus
        }) instanceof Error) {

            console.error(`${installation_local_name} - Falha na conexão: ${installation.dados.instalacao_esus}... `)

            BD_ERROS.push({ 
                    instalation_address: installation.dados.instalacao_esus , 
                    traceback: "Falha na conexão de banco" 
                });
            continue;
        }

        console.log(`${installation_local_name} - Conectado!: ${installation.dados.instalacao_esus}... `)

        let service_return = await SERVICE_INSTANCE.execute(DB_TYPE, DB_CLIENT, req.query, installation)

        if (!(service_return instanceof Error)){
            result = result.concat(service_return);
            successful+=1
        }   
        
    }

    if (successful === 0){
        return {
            expected: IPSESUS.length,
            successful: successful,
            errors: BD_ERROS,
            msg: "Falha na extração.",
            extracted: false,
            result: result
        }
    }

    return {
        expected: IPSESUS.length,
        successful: successful,
        errors: BD_ERROS,
        msg: (IPSESUS.length === successful) ? "Concluído sem erros" : "Concluído com falha",
        extracted: true,
        result: result
    }

}
