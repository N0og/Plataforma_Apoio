export interface IVisitasPrioriFiltros{
    //Filtros Vínculo e Data.
    distritoId?: number;
    unidadeId?: number;
    equipeId?: number;
    profissionalId?: number;
    micro_area?: number;
    cartao_sus?: string;
    compartilhada?: boolean;
    desfecho?: string;
    tipo_visita?: number;
    cadastro_atualizacao?: number;
    fora_area?: boolean;
    micro_area_temp?: boolean;
    data_inicial?: Date;
    data_final?: Date;
    RegionalId?: number;
    //#endregion

    //Filtros Condições de Saúde.
    gestante?: boolean;
    idoso?: boolean;
    crianca?: boolean;
    hipertensao?:boolean;
    dpoc?:boolean;
    outras_doencas?:boolean;
    sintomas_respiratorio?:boolean;
    vulnerabilidade_social?:boolean;
    usuario_alcool?:boolean;
    puerpera?:boolean;
    desnutricao?:boolean;
    diabetes?:boolean;
    cancer?:boolean;
    hanseniase?:boolean;
    tabagista?:boolean;
    bolsa_familia?:boolean;
    outras_drogas?:boolean;
    recem_nascido?:boolean;
    reabilitacao_deficiencia?:boolean;
    asma?:boolean;
    outras_doencas_cronicas?:boolean;
    tuberculose?:boolean;
    domiciliados_acamados?:boolean;
    saude_mental?:boolean;
    diarreira?:boolean;
    egresso_internacao?:boolean;
    //#endregion
}