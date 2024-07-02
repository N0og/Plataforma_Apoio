import { Request } from "express"
import { ParsedQs } from "qs";

export interface IReportControllerRequest extends Request{
    dbtype?: 'psql' | "mdb" 
    dbname?: string[] | ParsedQs[]
    download?: boolean;
    organize?: boolean;
}

export interface IReportControllerBDError{
    [key: string]: { address: string, error: string }
}