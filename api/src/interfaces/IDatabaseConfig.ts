export interface IDatabaseConfig {
    host?: string;
    user?: string;
    database?: string;
    password?: string;
    port?: number;
    connectionTimeoutMillis?: number;
}