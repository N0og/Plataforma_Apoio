import { Request } from "express"
import { ParsedQs } from "qs";
import { IResultConnection } from "./IResultConnection";

export interface IReportControllerRequest extends Request{
    dbtype?: 'psql' | "mdb" 
    order?: string[] | ParsedQs[]
    download?: boolean;
    organize?: boolean;
    installations?: string[] | ParsedQs[]
}

export interface IOrderError{
    order:string,
    result: IResultConnection
}