import { config as dotenvConfig } from 'dotenv'; // Importa a função de configuração do dotenv para carregar as variáveis de ambiente
import { PoolConfig as PGConfig } from "pg"; // Importa a interface PoolConfig do pacote pg e a renomeia como PGConfig
import { PoolOptions } from "mysql2/promise"; // Importa a interface PoolOptions do pacote mysql2/promise
import { DataSourceOptions } from 'typeorm'; // Importa a interface DataSourceOptions do TypeORM para definir as opções do DataSource
import { MAIN_PATH } from '../consts'; // Importa a constante MAIN_PATH que define o caminho base para as entidades e migrações

// Carrega as variáveis de ambiente do arquivo .env para que possam ser acessadas no código
dotenvConfig();

// Interface genérica que define as configurações comuns para diferentes tipos de bancos de dados
export interface DatabaseConfig {
    host?: string; // Host do banco de dados
    user?: string; // Usuário para autenticação no banco de dados
    database?: string; // Nome do banco de dados
    password?: string; // Senha para autenticação no banco de dados
    port?: number; // Porta na qual o banco de dados está escutando
}

// Classe que implementa as configurações para conectar a um banco de dados PostgreSQL
export class ConfigPostgresDatabase implements PGConfig, DatabaseConfig {
    host: string; // Host do banco de dados PostgreSQL
    user: string; // Usuário para autenticação no PostgreSQL
    database: string = "esus"; // Nome padrão do banco de dados
    password: string; // Senha para autenticação no PostgreSQL
    port: number; // Porta de conexão com o PostgreSQL
    connectionTimeoutMillis = 2000; // Tempo limite de conexão em milissegundos

    /**
     * Método para alterar as configurações do banco de dados PostgreSQL.
     * @param config - Objeto parcial contendo as novas configurações.
     * @returns boolean - Retorna true se alguma configuração foi alterada, caso contrário, false.
     */
    changeConfig(config: Partial<DatabaseConfig>): boolean {
        // Verifica se alguma das configurações foi alterada
        const hasChanged = Object.keys(config).some(key => this[key] !== config[key]);

        // Se houve alteração, atualiza as configurações e retorna true
        if (hasChanged) {
            Object.assign(this, config);
            return true;
        }
        return false; // Retorna false se não houve alteração
    }
}

// Classe que implementa as configurações para conectar a um banco de dados MariaDB
export class ConfigMariaDBDatabase implements PoolOptions, DatabaseConfig {
    host = process.env.MDBHOST; // Host do banco de dados MariaDB, carregado das variáveis de ambiente
    user = process.env.MDBUSER; // Usuário para autenticação no MariaDB, carregado das variáveis de ambiente
    database: string; // Nome do banco de dados MariaDB (a ser definido em tempo de execução)
    password = process.env.MDBPASSWORD; // Senha para autenticação no MariaDB, carregada das variáveis de ambiente
    port = parseInt(process.env.MDBPORT || "3306"); // Porta de conexão com o MariaDB, padrão 3306
    namedPlaceholders = true; // Permite o uso de placeholders nomeados nas queries SQL

    /**
     * Método para alterar as configurações do banco de dados MariaDB.
     * @param config - Objeto parcial contendo as novas configurações.
     * @returns boolean - Retorna true se alguma configuração foi alterada, caso contrário, false.
     */
    changeConfig(config: Partial<DatabaseConfig>): boolean {
        // Verifica se alguma das configurações foi alterada
        const hasChanged = Object.keys(config).some(key => this[key] !== config[key]);

        // Se houve alteração, atualiza as configurações e retorna true
        if (hasChanged) {
            Object.assign(this, config);
            return true;
        }
        return false; // Retorna false se não houve alteração
    }
}

// Configurações para o DataSource do TypeORM, utilizando PostgreSQL como banco de dados
export const ConfigAPIDatabase: DataSourceOptions = {
    type: "postgres", // Define o tipo de banco de dados como PostgreSQL
    host: process.env.APIDBHOST, // Host do banco de dados PostgreSQL, carregado das variáveis de ambiente
    port: parseInt(process.env.APIDBPORT!), // Porta de conexão com o PostgreSQL, carregada das variáveis de ambiente
    username: process.env.APIDBUSER, // Usuário para autenticação no PostgreSQL, carregado das variáveis de ambiente
    password: process.env.APIDBPASSWORD, // Senha para autenticação no PostgreSQL, carregada das variáveis de ambiente
    database: process.env.APIDBNAME, // Nome do banco de dados PostgreSQL, carregado das variáveis de ambiente
    entities: [`${MAIN_PATH}/database/entities/*.{ts,js}`], // Caminho para as entidades mapeadas pelo TypeORM
    migrations: [`${MAIN_PATH}/database/migrations/*.{ts,js}`], // Caminho para as migrações do banco de dados
    synchronize: true, // Habilita a sincronização automática do esquema do banco de dados com as entidades
    logging: false // Desativa o log de queries e operações realizadas pelo TypeORM
};
