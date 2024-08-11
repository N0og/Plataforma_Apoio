
/**
* Importa a classe que lida com parâmetros dinâmicos;
* Importa a função que converte os placeholders para PostgreSQL ;
* Importa a função que converte os tipos padrão de JSON;
*/
import {
    DynamicParameters,
    placeHolderConvert,
    BigIntConvertJSON
} from "../utils";
/**/
import { ConnectDBs } from "./init"; // Importa a classe que gerencia as conexões com os bancos de dados

/**
 * Executa um comando SQL em um banco de dados especificado
 * @param DBTYPE - O tipo de banco de dados (ex: 'psql' para PostgreSQL, 'mdb' para MariaDB)
 * @param SQL_COMMAND - A string do comando SQL a ser executado
 * @param DYNAMIC_PARAMETERS - Instância de DynamicParameters contendo os parâmetros dinâmicos para a consulta
 * @param dbClient - Instância da classe ConnectDBs que gerencia as conexões com os bancos de dados
 * @returns Promise<any[] | null> - Retorna os resultados da consulta como um array, ou null em caso de erro
 */
export async function ExecuteSQL(DBTYPE: string, SQL_COMMAND: string, DYNAMIC_PARAMETERS: DynamicParameters, dbClient: ConnectDBs): Promise<any[] | null> {

    switch (DBTYPE) {

        case 'psql':
            try {
                // Converte a consulta para PostgreSQL utilizando os placeholders adequados e executa a consulta
                const REPORT = await dbClient.getPostgDB().query(placeHolderConvert(SQL_COMMAND, DYNAMIC_PARAMETERS.GetAll()));
                return REPORT.rows; // Retorna as linhas do resultado da consulta
            } catch (error) {
                return null; // Retorna null em caso de erro
            }

        case 'mdb':
            try {
                // Executa a consulta no MariaDB utilizando os parâmetros dinâmicos
                const REPORT = await dbClient.getMariaDB().query(SQL_COMMAND, DYNAMIC_PARAMETERS.GetAll());
                return BigIntConvertJSON(REPORT[0]); // Converte os tipos padrão de JSON e retorna o resultado
            } catch (error) {
                return null; // Retorna null em caso de erro
            }

        default:
            throw new Error("Driver não compatível."); // Lança um erro se o tipo de banco de dados não for reconhecido
    }
}
