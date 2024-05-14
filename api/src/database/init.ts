import 'reflect-metadata'
import { Pool as PGPool } from "pg";
import { createPool as MDPool } from "mysql2/promise";
import { DataSource } from 'typeorm';
import { ConfigAPIDatabase, ConfigMariaDBDatabase, ConfigPostgresDatabase, DatabaseConfig } from './datasource';

export const API_DB_DataSource = new DataSource(ConfigAPIDatabase)

export class ConnectDBs {

    private MDBConfig: ConfigMariaDBDatabase
    private PSQLConfig: ConfigPostgresDatabase

    private PSQLPool: PGPool
    private MDBPool: ReturnType<typeof MDPool>

    constructor(){
        this.MDBConfig = new ConfigMariaDBDatabase();
        this.PSQLConfig = new ConfigPostgresDatabase();
    }

    async connect(driver:string) {

        if (driver == 'mdb'){    
            this.MDBPool = MDPool(this.MDBConfig);
            try {
                await this.MDBPool.getConnection();
                return true
            } catch (error) {
                return new Error(`Falha ao conectar com o banco de dados. ${error}`)
            }
        }

        else if (driver == 'psql'){
            this.PSQLPool = new PGPool(this.PSQLConfig);
            try {
                await this.PSQLPool.connect()
                return true
            } catch (error) {
                return new Error(`Falha ao conectar com o banco de dados. ${error}`)
            }
        }

        else return new Error(`Banco de dados não selecionado.`)
        
    }

    async changeDB(driver: string, config: Partial<DatabaseConfig>) {

        let change = false

        if (driver === 'mdb') {
            change = this.MDBConfig.changeConfig(config)
        }

        else if (driver === 'psql') {
            change = this.PSQLConfig.changeConfig(config)
        }

        else return new Error("DB Driver não compatível.")

        if (change){
            await this.disconnect(driver);
            return await this.connect(driver);
        }

    }

    async disconnect(driver:string) {

        if (driver === 'mdb') {
            if (this.PSQLPool) {
                this.PSQLPool.removeAllListeners()
                this.PSQLPool.end().catch(err => {
                    console.error('Erro ao fechar pool PostgreSQL:', err);
                });
            }
        }

        if (driver === 'psql') {
            if (this.MDBPool) {
                this.MDBPool.end().catch(err => {
                    console.error('Erro ao fechar pool MariaDB:', err);
                });
            }
        }

    
    }

    getMariaDB() {
        return this.MDBPool
    }

    getPostgDB() {
        return this.PSQLPool
    }
}