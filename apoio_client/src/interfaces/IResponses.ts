export interface IIEDResponse {
    [key:string]:{
        municipio: string,
        ubs:string,
        latitude:string, 
        longitude: string, 
        cnes: string, 
        ine: string,
        qtd_indi: number,
        param: number,
        max: number,
        ied: string,
        tp_equipe: string
    }[]
}