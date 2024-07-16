export interface IResultConnection{
    expected: number,
    successful: number,
    errors: db_conn_error[]
    msg: string,
    extracted: boolean
    result: Array<any>
}

export type db_conn_error = {
    instalation_address: string,
    traceback: string
}