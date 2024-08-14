import { Pool as PGPool } from "pg"; // Importa a classe Pool do pacote pg e renomeia para PGPool
import { createPool as MDPool } from "mysql2/promise"; // Importa a função createPool do pacote mysql2/promise e renomeia para MDPool
import { DataSource } from 'typeorm'; // Importa a classe DataSource do pacote typeorm
import {
    ConfigAPIDatabase,
    ConfigMariaDBDatabase,
    ConfigPostgresDatabase
} from './datasource'; // Importa configurações para diferentes tipos de bancos de dados
import { IDatabaseConfig } from "../interfaces";


// Instancia um DataSource para a API usando a configuração definida
export const API_DB_DataSource = new DataSource(ConfigAPIDatabase)

export class ConnectDBs {

    // Definição das propriedades privadas que armazenam as configurações e pools de conexão
    private MDBConfig: ConfigMariaDBDatabase // Armazena as configurações do MariaDB
    private PSQLConfig: ConfigPostgresDatabase // Armazena as configurações do PostgreSQL

    private PSQLPool: PGPool // Pool de conexões do PostgreSQL
    private MDBPool: ReturnType<typeof MDPool> // Pool de conexões do MariaDB

    // Construtor da classe, inicializa as configurações para cada banco de dados
    constructor() {
        this.MDBConfig = new ConfigMariaDBDatabase();
        this.PSQLConfig = new ConfigPostgresDatabase();
    }

    /**
     * Conecta ao banco de dados especificado
     * @param driver - O nome do banco de dados (ex: 'mdb' para MariaDB, 'psql' para PostgreSQL)
     * @returns Promise<boolean> - Retorna true se a conexão for bem-sucedida
     */
    async connect(driver: string): Promise<boolean | Error> {
        try {
            switch (driver) {
                case 'mdb':
                    this.MDBPool = MDPool(this.MDBConfig); // Cria um pool de conexões para MariaDB
                    await this.MDBPool.getConnection(); // Testa a conexão
                    break;

                case 'psql':
                    this.PSQLPool = new PGPool(this.PSQLConfig); // Cria um pool de conexões para PostgreSQL
                    await this.PSQLPool.connect(); // Testa a conexão
                    break;

                default:
                    throw new Error("Banco de dados não selecionado."); // Lança um erro se o banco de dados não for reconhecido
            }
            return true;
        } catch (error) {
            return new Error(`Falha ao conectar com o banco de dados. ${(error as { message?: any }).message}`);
        }
    }

    /**
     * Altera a configuração do banco de dados e reconecta
     * @param driver - O nome do banco de dados (ex: 'mdb', 'psql')
     * @param config - As novas configurações parciais do banco de dados
     * @returns Promise<boolean | Error> - Retorna true se a configuração for alterada e a conexão restabelecida, ou um erro
     */
    async changeDB(driver: string, config: Partial<IDatabaseConfig>): Promise<boolean | Error> {
        let change: boolean;

        switch (driver) {
            case 'mdb':
                change = this.MDBConfig.changeConfig(config); // Altera a configuração do MariaDB
                break;

            case 'psql':
                change = this.PSQLConfig.changeConfig(config); // Altera a configuração do PostgreSQL
                break;

            default:
                return new Error("DB Driver não compatível."); // Retorna um erro se o driver não for compatível
        }

        if (change) {
            await this.disconnect(driver); // Desconecta do banco de dados atual
            return this.connect(driver); // Reconecta com as novas configurações
        }

        return false;
    }

    /**
     * Desconecta do banco de dados especificado
     * @param driver - O nome do banco de dados (ex: 'mdb', 'psql')
     */
    async disconnect(driver: string) {
        try {
            switch (driver) {
                case 'mdb':
                    if (this.PSQLPool) {
                        this.PSQLPool.removeAllListeners(); // Remove todos os listeners para o pool PostgreSQL
                        this.PSQLPool.end().catch(err => {
                            console.error('Erro ao fechar pool PostgreSQL:', err);
                        });
                    }
                    break; // Adicionado para evitar queda no case 'psql'
                case 'psql':
                    if (this.MDBPool) {
                        this.MDBPool.end().catch(err => {
                            console.error('Erro ao fechar pool MariaDB:', err);
                        });
                    }
                    break; // Adicionado para evitar queda no default
                default:
                    throw new Error("Driver não compatível."); // Lança um erro se o driver não for reconhecido
            }
        } catch (error) {
            console.error(`Erro ao desconectar do pool ${driver}: `, error);
        }
    }

    /**
     * Retorna o pool de conexões do MariaDB
     * @returns MDBPool - Pool de conexões do MariaDB
     */
    getMariaDB() {
        return this.MDBPool;
    }

    /**
     * Retorna o pool de conexões do PostgreSQL
     * @returns PSQLPool - Pool de conexões do PostgreSQL
     */
    getPostgDB() {
        return this.PSQLPool;
    }
}
