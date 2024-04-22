import 'reflect-metadata'
import { config as DotenvConfig } from 'dotenv';
import { Pool as PGPool, PoolConfig as PGConfig, PoolClient } from "pg";
import { createPool as MDPool, PoolOptions, PoolConnection} from "mysql2/promise";

DotenvConfig()


class ConfigPostgresDatabase implements PGConfig{
    host = process.env.PGDBHOST;
    user = process.env.PGDBUSER;
    database = process.env.PGDBNAME;
    password = process.env.PGDBPASSWORD;
    port = parseInt(process.env.PGDBPORT || "5432");
}

class ConfigMariaDBDatabase implements PoolOptions{
    host = process.env.MDBHOST;
    user = process.env.MDBUSER;
    database = process.env.MDBNAME;
    password = process.env.MDBPASSWORD;
    port = parseInt(process.env.MDBPORT || "3306");
    namedPlaceholders = true;

}

export default class ConnectDB{
    PSQLClient: PoolClient;
    MDBClient: PoolConnection;

    async start(){
        const PSQLDataBase = new PGPool(new ConfigPostgresDatabase());
        const MariaDBDatabase = MDPool(new ConfigMariaDBDatabase());

        try {
            this.PSQLClient = await PSQLDataBase.connect()
            this.MDBClient = await MariaDBDatabase.getConnection();
            return console.log(`DBs Connectados.`)
        } catch (error) {
            throw new Error(`Falha ao conectar com o banco de dados. ${error}`)
        }
        
    }
}