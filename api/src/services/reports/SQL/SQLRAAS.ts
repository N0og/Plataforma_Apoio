export class SQL_RAAS {
    private SQL_BASE: string =
        `
        select 
            tdus.nu_cnes as "CNES",
            tc.nu_cns as "CNS PACIENTE",
            tc.nu_cpf as "CPF PACIENTE",
            tdtcad.dt_registro as "DATA",
            tc.no_cidadao as "NOME",
            tc.no_sexo as "SEXO",
            tc.dt_nascimento as "DATA NASCIMENTO",
            tn.no_nacionalidade as "NACIONALIADE",
            trc.no_raca_cor as "RAÇA COR",
            te.no_etnia as "ETNIA",
            tc.ds_cep as "CEP",
            tu.no_uf as "UF",
            tdm.no_municipio as "MUNICIPIO",
            tc.no_mae as "NOME DA MAE",
            tc.ds_logradouro as "ENDEREÇO",
            tc.nu_numero as "NÚMERO",
            tc.ds_complemento as "COMPLEMENTO",
            tc.nu_telefone_celular as "CELULAR",
            tfai.ds_filtro_cids as "CID10",
            tfai.ds_filtro_ciaps as "CIAP2",
            tdp.no_profissional as "PROFISSIONAL",
            tdp.nu_cns  as "CNS PRFISSIONAL",
            tdc.nu_cbo as "CBO",
            tde.no_equipe "EQUIPE",
            tde.nu_ine as "INE"
        from tb_fat_atendimento_individual tfai
        left join tb_dim_unidade_saude tdus on tdus.co_seq_dim_unidade_saude = tfai.co_dim_unidade_saude_1 
        left join tb_dim_equipe tde on tde.co_seq_dim_equipe = tfai.co_dim_equipe_1 
        left join tb_fat_cidadao_pec tfcp on tfcp.co_seq_fat_cidadao_pec = tfai.co_fat_cidadao_pec 
        left join tb_cidadao tc on tc.co_seq_cidadao = tfcp.co_cidadao 
        left join tb_dim_tempo tdtcad on tdtcad.co_seq_dim_tempo = tfai.co_dim_tempo
        left join tb_nacionalidade tn on tc.co_nacionalidade = tn.co_nacionalidade 
        left join tb_raca_cor trc on trc.co_raca_cor = tc.co_raca_cor 
        left join tb_etnia te on te.co_etnia = tc.co_etnia 
        left join tb_uf tu on tu.co_uf = tc.co_uf 
        left join tb_dim_municipio tdm on tdm.co_seq_dim_municipio = tfai.co_dim_municipio 
        left join tb_dim_profissional tdp on tdp.co_seq_dim_profissional = tfai.co_dim_profissional_1 
        left join tb_dim_cbo tdc on tdc.co_seq_dim_cbo = tfai.co_dim_cbo_1 
        where 
            tfcp.co_cidadao  is not null
    `

    private SQL_END: string =
        `
        order by 
	    tc.no_cidadao ASC
    `

    getBase() {
        return this.SQL_BASE;
    }

    getEnd() {
        return this.SQL_END;
    }
}