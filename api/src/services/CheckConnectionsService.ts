import { ConneSUS } from "../database/entities";
import { ConnectDBs } from "../database/init";
import { ConneSUSRepository } from "../database/repository/API_DB_Repositorys";

/** 
 * 
 * Proposta inicial de checagem de conexões disponíveis.
 * Service dedicado a buscar conexões estáveis voltados para
 * confirmação do usuário antes dos processos de busca e extração.
 * 
 * 
 * DEV: Gabriel S. Nogueira
 */
interface ConnectionErrorMap {
    [key: string]: string[];
}


export class checkConnectionsService {

    CONNECTDB: ConnectDBs /* Objeto de conexão com BD. */
    CONN_ERRORS: Object /* Objeto receptor das possíveis falhas */

    constructor() {
        this.CONNECTDB = new ConnectDBs()
    }


    /**
     * 
     * @param query_params --> Request.Query transmitido pelo Controller
     * @returns Object{} contendo os resultados da operação de checagem. 
     */

    async execute(query_params: any, ip) {

        this.CONN_ERRORS = {} as ConnectionErrorMap;

        if (!query_params.order) {
            return new Error('Falha na solicitação.')
        }

        const ORDERS = Array.isArray(query_params.order) ? query_params.order : Array(query_params.order)

        for (let ORDER of ORDERS) {

            let errors: string[] = [];

            const CONNECTIONS = await ConneSUSRepository.createQueryBuilder("jsonIP")
                .where("jsonIP.dados @> :dados", { dados:JSON.stringify({ municipio: ORDER })})
                .getMany()

            for (let inst of CONNECTIONS) {

                const instData = inst.dados as ConneSUS["dados"]

                console.log(`PEDIDO IP: ${ip} - ${ORDER} - TESTANDO: ${instData.instalacao_esus}... `)


                if (await this.CONNECTDB.changeDB('psql', {
                    host: instData.ip_esus!,
                    port: instData.port_esus!,
                    database: instData.db_name_esus!,
                    user: instData.db_user_esus!,
                    password: instData.db_password_esus!,
                    connectionTimeoutMillis: 500
                }) instanceof Error) {
                    console.log(`PEDIDO IP: ${ip} - ${ORDER} - FALHA: ${instData.instalacao_esus}... `)
                    errors.push(instData.instalacao_esus!)
                }


                else {
                    console.log(`PEDIDO IP: ${ip} - ${ORDER} - ESTÁVEL: ${instData.instalacao_esus}... `)
                    continue
                };
            }
            if (errors.length > 0) this.CONN_ERRORS[ORDER] = errors
        }
        return {
            msg: Object.keys(this.CONN_ERRORS).length > 0 ? 'Falha' : 'Estável',
            result: this.CONN_ERRORS
        }

    }
}