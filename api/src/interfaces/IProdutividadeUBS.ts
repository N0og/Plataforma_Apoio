export interface IProdutividadeUBS{
    //Filtros Vínculo e Data.
    unidade?: number;
    equipe?: number;
    profissional?: number;
    micro_area?: number;
    cartao_sus?: string;
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

/*

ESF - Atendimento individual - Médico - Enfermeiro - Tec.Enfermargem - Aux. Enfermagem.
ESB - Atendimento odonto individual - Cirurgião Dentista - Aux. Saúde Bucal - Tec. Saúde Bucal.
E-MULTI - Atendimento individual - Psicólogo, Fisioterapeuta, etc...

tb_fat_atendimento_individual; -->
tb_fat_atendimento_individual_odonto; -->
tb_fat_procedimento; -->

*/