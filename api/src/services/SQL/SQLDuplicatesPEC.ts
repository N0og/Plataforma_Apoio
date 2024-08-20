export class SQL_DUPLICATES_PEC{
    
    private SQL_BASE: string = `
        select distinct 
            tc.no_cidadao as "NOME",
            tc.nu_cpf as "CPF",
            tc.nu_cns as "CARTAO SUS",
            tc.dt_nascimento as "DATA DE NASCIMENTO",
            DATE_PART('year', AGE(tc.dt_nascimento)) as "IDADE",
            tc.no_sexo as "SEXO",
            tc.no_mae as "NOME DA MAE",
            tc.no_pai as "NOME DO PAI",
            tc.dt_atualizado as "DATA DA FICHA",
            fci.ds_dim_tipo_saida_cadastro as "TIPO DE SAIDA",
            fci.nu_micro_area as "MICRO AREA",
            tc.st_ativo as "ATIVO",
            tc.st_unificado as "UNIFICADO",
            case
                when tdus.nu_cnes is not null then tdus.nu_cnes
                when (tdus.nu_cnes is null and tdusCDS.nu_cnes is null) then 'SEM CNES'
                else tdusCDS.nu_cnes
            end::VARCHAR(50) as "CNES",
            case
                when tdus.nu_cnes is not null then tdus.no_unidade_saude 
                when (tdus.nu_cnes is null and tdusCDS.nu_cnes is null) then 'SEM CNES'
                else tdusCDS.no_unidade_saude 
            end::VARCHAR(50) as "UNIDADE DE SAUDE",
            case 
                when fci.co_seq_fat_cad_individual is null then 'MODULO CIDADAO'
                else 'MODULO CDS'
            end as "ORIGEM DUPLICADO",
            case
                when tde.no_equipe is not null then tde.nu_ine
                when (tde.no_equipe is null and tdeCDS.no_equipe is null) then 'SEM EQUIPE'
                else tdeCDS.nu_ine
            end::VARCHAR(50) as "INE",
            case
                when tde.no_equipe is not null then tde.no_equipe
                when (tde.no_equipe is null and tdeCDS.no_equipe is null) then 'SEM EQUIPE'
                else tdeCDS.no_equipe
            end::VARCHAR(50) as "EQUIPE",
            tdp.no_profissional as "PROFISSIONAL"
        from 
            tb_cidadao tc 
        inner join 
            tb_fat_cidadao_pec tfcp 
                on tfcp.co_cidadao = tc.co_seq_cidadao 
        left join (
            select tfci.*,
            	tdtsc.ds_dim_tipo_saida_cadastro
                from 
                    tb_fat_cad_individual tfci 
                inner join
                    tb_fat_cidadao tfc 
                        on tfc.co_fat_cad_individual = tfci.co_seq_fat_cad_individual
                left join 
                    tb_cds_cad_individual tcci 
                        on right(tcci.co_unico_ficha_origem, 36)  = right(tfc.nu_uuid_ficha_origem , 36)
                left join
        			tb_dim_tipo_saida_cadastro tdtsc on tdtsc.co_seq_dim_tipo_saida_cadastro = tfci.co_dim_tipo_saida_cadastro
                where 
                    tfc.co_dim_tempo_validade > cast(TO_CHAR(CURRENT_DATE, 'yyyymmdd') as INTEGER)
                    and tcci.st_ficha_inativa = 0
                    and tfc.st_ficha_inativa = 0
                    and tcci.st_versao_atual = 1
                    and tfc.co_fat_cidadao_raiz = tfc.co_seq_fat_cidadao
                    ) as fci on fci.co_fat_cidadao_pec = tfcp.co_seq_fat_cidadao_pec
        left join 
            tb_dim_equipe tdeCDS on tdeCDS.co_seq_dim_equipe = fci.co_dim_equipe 
        left join 
            tb_dim_unidade_saude tdusCDS on tdusCDS.co_seq_dim_unidade_saude = fci.co_dim_unidade_saude 
        left join 
            tb_dim_equipe tde on tde.co_seq_dim_equipe = tfcp.co_dim_equipe_vinc 
        left join 
            tb_dim_unidade_saude tdus on tdus.co_seq_dim_unidade_saude = tfcp.co_dim_unidade_saude_vinc 
        left join 
            tb_dim_profissional tdp on fci.co_dim_profissional = tdp.co_seq_dim_profissional
        where 
            tc.st_ativo = 1
            and tc.st_unificado = 0
            and (
                select
                    COUNT(tcid.no_cidadao) contagem_cid
                from
                    tb_cidadao tcid
                where
                    tcid.dt_nascimento = tc.dt_nascimento
                    AND tcid.no_sexo = tc.no_sexo
                    AND UPPER(tcid.no_cidadao) = UPPER(tc.no_cidadao)
                    AND SPLIT_PART(REVERSE(UPPER(tcid.no_mae)), ' ', 1) = SPLIT_PART(REVERSE(UPPER(tc.no_mae)), ' ', 1)
                    AND SPLIT_PART(UPPER(tcid.no_mae), ' ', 1) = SPLIT_PART(UPPER(tc.no_mae), ' ', 1)
            ) >= 2
        order by
            tc.no_cidadao asc
    `

    getBase() {
        return this.SQL_BASE
    }
    
}
