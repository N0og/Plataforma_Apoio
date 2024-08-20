import { ParsedQs } from "qs";

export interface IGenericFilterPEC {
  
    unit: string[] | ParsedQs[]
    team: string[] | ParsedQs[]
    professional: string[] | ParsedQs[]
    cbo: string[] | ParsedQs[]
    data_inicial: Date;
    data_final: Date;
}