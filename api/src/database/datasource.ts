import 'reflect-metadata'
import { config as dotenvConfig } from 'dotenv';
import { PoolConfig as PGConfig } from "pg";
import { PoolOptions } from "mysql2/promise";
import { DataSourceOptions } from 'typeorm';
import { MAIN_PATH } from '../consts';
dotenvConfig()


export interface DatabaseConfig {
    host?: string;
    user?: string;
    database?: string;
    password?: string;
    port?: number;
}


export class ConfigPostgresDatabase implements PGConfig, DatabaseConfig {
    host: string;
    user: string;
    database: string = "esus";
    password: string;
    port: number;

    changeConfig(config: Partial<DatabaseConfig>) {
        if (
            this.host !== config.host || 
            this.user !== config.user || 
            this.database !== config.database || 
            this.password !== config.password || 
            this.port !== config.port
            ) {
                Object.assign(this, config);
                return true
            }
        return false
        
    }
}

export class ConfigMariaDBDatabase implements PoolOptions, DatabaseConfig {
    host = process.env.MDBHOST;
    user = process.env.MDBUSER;
    database:string;
    password = process.env.MDBPASSWORD;
    port = parseInt(process.env.MDBPORT || "3306");
    namedPlaceholders = true;

    changeConfig(config: Partial<DatabaseConfig>) {

        if (
            this.host !== config.host || 
            this.user !== config.user || 
            this.database !== config.database || 
            this.password !== config.password || 
            this.port !== config.port
            ) {
                Object.assign(this, config);
                return true
            }
        return false

    }

}

export const ConfigAPIDatabase: DataSourceOptions = {
    type: "postgres",
    host: process.env.APIDBHOST,
    port: parseInt(process.env.APIDBPORT!),
    username: process.env.APIDBUSER,
    password: process.env.APIDBPASSWORD,
    database: process.env.APIDBNAME,
    entities: [`${MAIN_PATH}/database/entities/*.{ts,js}`],
    migrations: [`${MAIN_PATH}/database/migrations/*.{ts,js}`],
    synchronize: true,
    logging: false
};

