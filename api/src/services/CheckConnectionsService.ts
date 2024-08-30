import { ObjectLiteral } from "typeorm";
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

        if (!query_params.clients) {
            return new Error('Falha na solicitação.')
        }

        const CLIENTS = Array.isArray(query_params.clients) ? query_params.clients : Array(query_params.clients)
        const INSTALLATIONS = query_params.installations ? (Array.isArray(query_params.installations) ? query_params.installations : Array(query_params.installations)) : null;

        for (let CLIENT of CLIENTS) {

            let errors: string[] = [];

            let CONNECTIONS = INSTALLATIONS && INSTALLATIONS.length > 0 ?
                await ConneSUSRepository.createQueryBuilder("jsonIP")
                    .where("jsonIP.dados @> :dados", { dados: JSON.stringify({ municipio: CLIENT }) })
                    .andWhere(`"jsonIP".dados->>'id_instalacao_esus'::text IN (:...installationIds)`, { installationIds: INSTALLATIONS })
                    .getMany()
                :
                await ConneSUSRepository.createQueryBuilder("jsonIP")
                    .where("jsonIP.dados @> :dados", { dados: JSON.stringify({ municipio: CLIENT }) })
                    .getMany();

            for (let inst of CONNECTIONS) {

                const instData = inst.dados as ConneSUS["dados"]

                console.log(`PEDIDO IP: ${ip} - ${CLIENT} - TESTANDO: ${instData.instalacao_esus}... `)


                if (await this.CONNECTDB.changeDB('psql', {
                    host: instData.ip_esus!,
                    port: instData.port_esus!,
                    database: instData.db_name_esus!,
                    user: instData.db_user_esus!,
                    password: instData.db_password_esus!,
                    connectionTimeoutMillis: 1300
                }) instanceof Error) {
                    console.log(`PEDIDO IP: ${ip} - ${CLIENT} - FALHA: ${instData.instalacao_esus}... `)
                    errors.push(instData.instalacao_esus!)
                }


                else {
                    console.log(`PEDIDO IP: ${ip} - ${CLIENT} - ESTÁVEL: ${instData.instalacao_esus}... `)
                    continue
                };
            }
            if (errors.length > 0) this.CONN_ERRORS[CLIENT] = errors
        }
        return {
            msg: Object.keys(this.CONN_ERRORS).length > 0 ? 'Falha' : 'Estável',
            result: this.CONN_ERRORS
        }

    }
}