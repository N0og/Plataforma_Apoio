export interface IProdutividadeUBS{
    
    //Filtros Vínculo e Data.
    unidade?: string;
    equipe?: number;
    profissionalId?: number;
    cartao_sus?: string;
    cpf?: string;
    data_inicial: Date;
    data_final: Date;
    cbo: { [key: string]: IFiltro_CBO[] };
    //#endregion

}

export interface IFiltro_CBO{
    categoria: string;
    cbo: string ;
}

export interface ICBO{
    TIPO: string;
    CATEGORIA: string;
    CBO: string;
}

export interface IDATA_ProdutividadeUBS{
    ESTABELECIMENTO: string;
    CNES:string;
    INE:string;
    "NOME EQUIPE":string;
    MUNICIPIO: string;
    UF: string;
    [categoria:string]: string
}