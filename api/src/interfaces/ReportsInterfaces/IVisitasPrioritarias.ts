export interface IVisitasPrioriFiltros{

    //Filtros Vínculo e Data.
    distritoId?: number;
    unidadeId?: number;
    equipeId?: number;
    profissionalId?: number;
    micro_area?: number;
    cartao_sus?: string;
    compartilhada?: boolean;
    desfecho?: boolean;
    tipo_visita?: number;
    cadastro_atualizacao?: number;
    fora_area?: boolean;
    micro_area_temp?: boolean;
    data_inicial?: Date;
    data_final?: Date;
    //#endregion

    //Filtros Condições de Saúde.
    gestantes?: boolean;
    idosos?: boolean;
    criancas?: boolean;
    hipertensos?:boolean;
    dpoc?:boolean;
    outras_doencas?:boolean;
    sintomas_respiratorio?:boolean;
    vulnerabilidade_social?:boolean;
    alcoolatras?:boolean;
    puerperas?:boolean;
    desnutridos?:boolean;
    diabeticos?:boolean;
    cancer?:boolean;
    hanseniase?:boolean;
    tabagistas?:boolean;
    bolsa_familia?:boolean;
    outras_drogas?:boolean;
    recem_nascido?:boolean;
    reabilitacao_deficiencia?:boolean;
    asmaticos?:boolean;
    outras_doencas_cronicas?:boolean;
    tuberculose?:boolean;
    domiciliados_acamados?:boolean;
    saude_mental?:boolean;
    diarreira?:boolean;
    egresso_internacao?:boolean;
    //#endregion
    
}
