import { ParsedQs } from "qs";

export interface IVacinasPEC {
    unit: string[] | ParsedQs[]
    team: string[] | ParsedQs[]
    imunos: string[] | ParsedQs[],
    data_inicial: string
    data_final: string,
    idade_ano_inicio?,
    idade_mes_inicio?,
    idade_ano_final?,
    idade_mes_final?
}