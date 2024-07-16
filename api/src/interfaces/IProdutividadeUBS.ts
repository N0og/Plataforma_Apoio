export interface IAtendimentosUBS {

    id_instalacao?: number;
    uf?: string;
    municipio?: string;
    instalacao?: string;
    data_processamento?: Date
    nu_cnes?: number;
    no_estabelecimento?: string;
    no_equipe?: string;
    tp_equipe?: string;
    nu_ine?:string;
    nu_cbo?:string;
    ds_cbo?:string;
    no_prof?:string;
    tp_reg?:string;
    tp_ficha?:string;
    tp_atend?:string;
    tp_consulta?:string;
    no_local_atend?:string;
    nu_ano?:string;
    nu_mes?:string;
    dia_01?:number;
    dia_02?:number;
    dia_03?:number;
    dia_04?:number;
    dia_05?:number;
    dia_06?:number;
    dia_07?:number;
    dia_08?:number;
    dia_09?:number;
    dia_10?:number;
    dia_11?:number;
    dia_12?:number;
    dia_13?:number;
    dia_14?:number;
    dia_15?:number;
    dia_16?:number;
    dia_17?:number;
    dia_18?:number;
    dia_19?:number;
    dia_20?:number;
    dia_21?:number;
    dia_22?:number;
    dia_23?:number;
    dia_24?:number;
    dia_25?:number;
    dia_26?:number;
    dia_27?:number;
    dia_28?:number;
    dia_29?:number;
    dia_30?:number;
    dia_31?:number;
    total_geral?:number
}

export interface IFilterProdutividadeUBS{
    
    //Filtros Vínculo e Data.
    data_inicial: Date;
    data_final: Date;
    cnes?: string;
    ine?: number;
    profissional?: number;
    cbo?: string;
    //#endregion

}