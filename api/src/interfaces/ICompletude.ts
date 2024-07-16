export interface IATT_CPF {
    cds_id?: number,
    cns_prof?: string,
    cbo_prof?: string,
    nu_cnes?: string,
    nu_ine?: string,
    dt_registro?: Date,
    doc_cid?: string,
    st_responsavel_familiar?: boolean,
    doc_resp?: string,
    no_cidadao?: string,
    nu_micro_area?: string,
    no_nome_social?: string,
    dt_nascimento?: Date,
    ds_sexo?: string,
    ds_raca_cor?: string,
    no_etnia?: string,
    nu_pis_pasep?: string,
    no_mae_cidadao?: string,
    no_pai_cidadao?: string,
    st_desconhece_mae?: boolean,
    st_desconhece_pai?: boolean,
    no_identificador?: string,
    no_pais?: string,
    dt_naturalizacao?: Date,
    nu_portaria_naturalizacao?: string,
    no_municipio?: string,
    sg_uf?: string,
    dt_entrada_brasil?: Date,
    nu_celular_cidadao?: string,
    no_email?: string,
    ds_tipo_parentesco?: string,
    cbo_cidadao?: string,
    st_frequenta_creche?: boolean,
    ds_dim_tipo_escolaridade?: string,
    ds_dim_situacao_trabalho?: string,
    st_respons_crianca_adulto_resp?: boolean,
    st_respons_crianca_outra_crian?: boolean,
    st_respons_crianca_adolescente?: boolean,
    st_respons_crianca_sozinha?: boolean,
    st_respons_crianca_creche?: boolean,
    st_respons_crianca_outro?: boolean,
    st_frequenta_cuidador?: boolean,
    st_participa_grupo_comunitario?: boolean,
    st_plano_saude_privado?: boolean,
    st_comunidade_tradicional?: boolean,
    ds_povo_comunidade_tradicional?: string,
    st_informar_orientacao_sexual?: boolean,
    ds_dim_tipo_orientacao_sexual?: string,
    st_informar_identidade_genero?: boolean,
    ds_identidade_genero?: string,
    st_deficiencia?: boolean,
    st_defi_auditiva?: boolean,
    st_defi_intelectual_cognitiva?: boolean,
    st_defi_outra?: boolean,
    st_defi_visual?: boolean,
    st_defi_fisica?: boolean,
    st_alimentos_acab_sem_dinheiro?: boolean,
    st_comeu_que_tinha_dnheir_acab?: boolean,
    co_dim_tipo_saida_cadastro?: string,
    dt_obito?: Date,
    nu_obito_do?: string,
    st_gestante?: boolean,
    no_maternidade_referencia?: string,
    ds_dim_tipo_condicao_peso?: string,
    st_fumante?: boolean,
    st_alcool?: boolean,
    st_outra_droga?: boolean,
    st_hipertensao_arterial?: boolean,
    st_diabete?: boolean,
    st_avc?: boolean,
    st_infarto?: boolean,
    st_doenca_cardiaca?: boolean,
    st_doenca_card_insuficiencia?: boolean,
    st_doenca_card_outro?: boolean,
    st_doenca_card_n_sabe?: boolean,
    st_problema_rins?: boolean,
    st_problema_rins_insuficiencia?: boolean,
    st_problema_rins_outro?: boolean,
    st_problema_rins_nao_sabe?: boolean,
    st_doenca_respiratoria?: boolean,
    st_doenca_respira_asma?: boolean,
    st_doenca_respira_dpoc_enfisem?: boolean,
    st_doenca_respira_outra?: boolean,
    st_doenca_respira_n_sabe?: boolean,
    st_hanseniase?: boolean,
    st_tuberculose?: boolean,
    st_cancer?: boolean,
    st_internacao_12?: boolean,
    no_causa_internacao12?: null,
    st_tratamento_psiquiatra?: boolean,
    st_acamado?: boolean,
    st_domiciliado?: boolean,
    st_usa_planta_medicinal?: boolean,
    no_plantas_medicinais?: null,
    st_morador_rua?: boolean,
    ds_dim_tempo_morador_rua?: string,
    st_recebe_beneficio?: boolean,
    st_referencia_familiar?: boolean,
    ds_dim_frequencia_alimentacao?: string,
    st_orig_alimen_restaurante_pop?: boolean,
    st_orig_alimen_doacao_rest?: boolean,
    st_orig_alimen_outros?: boolean,
    st_orig_alimen_doacao_reli?: boolean,
    st_orig_alimen_doacao_popular?: boolean,
    st_acompanhado_instituicao?: boolean,
    no_acompanhado_instituicao?: string,
    st_visita_familiar_frequente?: boolean,
    no_visita_familiar_parentesco?: string,
    st_higiene_pessoal_acesso?: boolean,
    st_hig_pess_banho?: boolean,
    st_hig_pess_sanitario?: boolean,
    st_hig_pess_higiene_bucal?: boolean,
    st_hig_pess_outros?: boolean,
    st_recusa_cadastro?: boolean,
    "CIDADÃO"?: string,
    "DOCUMENTO PESSOAL"?: string,
    "É RESPONSÁVEL FAMILIAR"?: string,
    "ULTIMA ATUALIZAÇÃO"?: Date,
    "STATUS DOCUMENTO"?: string,
    "TEMPO SEM ATUALIZAR"?: string,
    "MESES SEM ATUALIZAR"?: string,
    "DISTRITO"?: string,
    "MICRO ÁREA"?: string,
    "PROFISSIONAL CADASTRANTE"?: string,
    "CBO PROFISSIONAL"?: string,
    "DESCRIÇÃO CBO"?: string,
    "UNIDADE DE SAÚDE"?: string,
    "CNES"?: string,
    "NOME EQUIPE"?: string,
    "INE"?: string,
    "TIPO DE EQUIPE"?: string,
    "STATUS DE RECUSA"?: string,
    "COMPLETUDE": string,
    "ERROS": string 
}

export interface ICompletudeFilters{
    distritoId?: number;
    cnes?: string;
    ine?: string;
    profissionalId?: number;
    micro_area?: string;
    data_inicial: Date;
    data_final: Date;
}

export type CheckedFCI = {
    erros: string[],
    status: number;
}