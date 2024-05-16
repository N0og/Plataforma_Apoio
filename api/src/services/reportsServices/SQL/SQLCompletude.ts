export class SQL_COMPLETUDE{
    SQL_BASE: string = `
        select 
            tcci.co_seq_cds_cad_individual as cds_id,
            tdp.nu_cns as cns_prof,
            tdcprof.nu_cbo as cbo_prof,
            tdus.nu_cnes,
            tde.nu_ine,
            tdtficha.dt_registro,
            CASE 
                WHEN tfc.nu_cpf_cidadao = '0          ' then tfc.nu_cns 
                else tfc.nu_cpf_cidadao
            end as doc_cid,
            tfci.st_responsavel_familiar,
            case 
            when tfci.nu_cns_responsavel is null then tfci.nu_cpf_responsavel 
            else tfci.nu_cns_responsavel 
            end as doc_resp,
            tcci.no_cidadao,
            tfci.nu_micro_area,
            tcci.no_social_cidadao,
            tfci.dt_nascimento,
            case
            when tds.nu_identificador = '3' then null
            else tds.ds_sexo
            end as ds_sexo,
            case 
                when tdrc.nu_identificador = '-' then null
                else tdrc.ds_raca_cor
            end as ds_raca_cor,
            case
                when tdetnia.nu_identificador = '-' then null
                else tdetnia.no_etnia 
            end as no_etnia,
            tcci.nu_pis_pasep,
            tcci.no_mae_cidadao,
            tcci.no_pai_cidadao,
            tfci.st_desconhece_mae,
            tfci.st_desconhece_pai,
            case 
                when tdn.co_nacionalidade  = '-' then null
                else tdn.no_identificador
            end as no_identificador,
            tdpais.no_pais,
            tfci.dt_naturalizacao,
            tfci.nu_portaria_naturalizacao,
            tdm.no_municipio,
            tdu.sg_uf,
            tfci.dt_entrada_brasil,
            tcci.nu_celular_cidadao,
            tfci.no_email,
            case
                when tdtp.nu_identificador  = '-' then null
                else tdtp.ds_tipo_parentesco
            end as ds_tipo_parentesco,
            tdc.no_cbo as cbo_cidadao,
            tfci.st_frequenta_creche,
            case 
                when tdte.nu_identificador  = '-' then null
                else tdte.ds_dim_tipo_escolaridade
            end as ds_dim_tipo_escolaridade,
            case 
                when tdst.nu_identificador = '-' then null
                else tdst.ds_dim_situacao_trabalho
            end as ds_dim_situacao_trabalho,
            tfci.st_respons_crianca_adulto_resp,
            tfci.st_respons_crianca_outra_crian,
            tfci.st_respons_crianca_adolescente,
            tfci.st_respons_crianca_sozinha,
            tfci.st_respons_crianca_creche,
            tfci.st_respons_crianca_outro,
            tfci.st_frequenta_cuidador,
            tfci.st_participa_grupo_comunitario,
            tfci.st_plano_saude_privado,
            tfci.st_comunidade_tradicional,
            tdpct.ds_povo_comunidade_tradicional,
            tfci.st_informar_orientacao_sexual,
            case 
                when tdtos.nu_identificador = '-' then null
                else tdtos.ds_dim_tipo_orientacao_sexual
            end as ds_dim_tipo_orientacao_sexual,
            tfci.st_informar_identidade_genero,
            case 
                when tdig.nu_identificador = '-' then null
                else tdig.ds_identidade_genero
            end as ds_identidade_genero,
            tfci.st_deficiencia,
            tfci.st_defi_auditiva,
            tfci.st_defi_intelectual_cognitiva,
            tfci.st_defi_outra,
            tfci.st_defi_visual,
            tfci.st_defi_fisica,
            tfci.st_alimentos_acab_sem_dinheiro, 
            tfci.st_comeu_que_tinha_dnheir_acab ,
            tfci.co_dim_tipo_saida_cadastro,
            tfci.dt_obito,
            tfci.nu_obito_do,
            tfci.st_gestante,
            tfci.no_maternidade_referencia,
            case 
                when tdtcp.nu_identificador = '-' then null
                else tdtcp.ds_dim_tipo_condicao_peso
            end as ds_dim_tipo_condicao_peso,
            tfci.st_fumante,
            tfci.st_alcool,
            tfci.st_outra_droga,
            tfci.st_hipertensao_arterial,
            tfci.st_diabete,
            tfci.st_avc,
            tfci.st_infarto,
            tfci.st_doenca_cardiaca,
            tfci.st_doenca_card_insuficiencia,
            tfci.st_doenca_card_outro,
            tfci.st_doenca_card_n_sabe,
            tfci.st_problema_rins,
            tfci.st_problema_rins_insuficiencia,
            tfci.st_problema_rins_outro,
            tfci.st_problema_rins_nao_sabe,
            tfci.st_doenca_respiratoria,
            tfci.st_doenca_respira_asma,
            tfci.st_doenca_respira_dpoc_enfisem,
            tfci.st_doenca_respira_outra,
            tfci.st_doenca_respira_n_sabe,
            tfci.st_hanseniase,
            tfci.st_tuberculose,
            tfci.st_cancer,
            tfci.st_internacao_12,
            tfci.no_causa_internacao12,
            tfci.st_tratamento_psiquiatra,
            tfci.st_acamado,
            tfci.st_domiciliado,
            tfci.st_usa_planta_medicinal, 
            tfci.no_plantas_medicinais,
            tfci.st_morador_rua,
            case 
                when tdtmr.nu_identificador = '-' then null
                else tdtmr.ds_dim_tempo_morador_rua
            end as ds_dim_tempo_morador_rua,
            tfci.st_recebe_beneficio,
            tfci.st_referencia_familiar,
            case 
                when tdfa.nu_identificador = '-' then null
                else tdfa.ds_dim_frequencia_alimentacao
            end ds_dim_frequencia_alimentacao,
            tfci.st_orig_alimen_restaurante_pop,
            tfci.st_orig_alimen_doacao_rest,
            tfci.st_orig_alimen_outros,
            tfci.st_orig_alimen_doacao_reli,
            tfci.st_orig_alimen_doacao_popular,
            tfci.st_acompanhado_instituicao,
            tfci.no_acompanhado_instituicao,
            tfci.st_visita_familiar_frequente,
            tfci.no_visita_familiar_parentesco,
            tfci.st_higiene_pessoal_acesso,
            tfci.st_hig_pess_banho,
            tfci.st_hig_pess_sanitario,
            tfci.st_hig_pess_higiene_bucal,
            tfci.st_hig_pess_outros,
            tfci.st_recusa_cadastro,
            tcci.no_cidadao as "CIDADÃO",
            CASE 
                WHEN tfc.nu_cpf_cidadao = '0          ' then tfc.nu_cns 
                else tfc.nu_cpf_cidadao
            end as "DOCUMENTO PESSOAL",
            case 
                when tfci.st_responsavel_familiar = 1 then 'SIM'
                else 'NÃO'
            end as "É RESPONSÁVEL FAMILIAR",
            tdtficha.dt_registro as "ULTIMA ATUALIZAÇÃO",
            CASE 
                WHEN tfc.nu_cpf_cidadao = '0          ' then 'SEM CPF' 
                WHEN tfc.nu_cpf_cidadao = '0          ' and tfc.nu_cns = '0              ' then 'SEM DOCUMENTO'
                else 'COM CPF'
            end as "STATUS DOCUMENTO",
            case 
                when (extract(year from justify_interval(now() - tdtficha.dt_registro))*12+extract(month from justify_interval(now() - tdtficha.dt_registro))) <= 3 then 'ATÉ 3 MESES'
                when (extract(year from justify_interval(now() - tdtficha.dt_registro))*12+extract(month from justify_interval(now() - tdtficha.dt_registro))) <= 12 then '4 A 12 MESES'
                when (extract(year from justify_interval(now() - tdtficha.dt_registro))*12+extract(month from justify_interval(now() - tdtficha.dt_registro))) <= 24 then '13 A 24 MESES'
                when (extract(year from justify_interval(now() - tdtficha.dt_registro))*12+extract(month from justify_interval(now() - tdtficha.dt_registro))) > 24 then 'MAIS DE 2 ANOS'
            end as "TEMPO SEM ATUALIZAÇÃO",
            case 
                when (extract(year from justify_interval(now() - tdtficha.dt_registro))*12+extract(month from justify_interval(now() - tdtficha.dt_registro))) = 1 then concat((extract(year from justify_interval(now() - tdtficha.dt_registro))*12+extract(month from justify_interval(now() - tdtficha.dt_registro))), ' MÊS')
                else concat((extract(year from justify_interval(now() - tdtficha.dt_registro))*12+extract(month from justify_interval(now() - tdtficha.dt_registro))), ' MESES')
            end as "MESES SEM ATUALIZAR",
            tfci.nu_micro_area as "MICRO ÁREA",
            tdp.no_profissional as "PROFISSIONAL CADASTRANTE",
            tdcprof.nu_cbo as "CBO PROFISSIONAL",
            tdcprof.no_cbo as "DESCRIÇÃO DO CBO",
            tdus.no_unidade_saude as "UNIDADE DE SAÚDE",
            tdus.nu_cnes as "CNES",
            tde.no_equipe as "NOME EQUIPE",
            tde.nu_ine as "INE",
            tte.sg_tipo_equipe as "TIPO DE EQUIPE",
            case 
                when tfci.st_recusa_cadastro = 1 then 'RECUSADO'
                else 'SEM RECUSA'
            end as "STATUS DE RECUSA"
        from
            tb_fat_cidadao tfc
            left join tb_cds_cad_individual tcci on right(tcci.co_unico_ficha_origem, 36)  = right(tfc.nu_uuid_ficha_origem , 36)
            left join tb_fat_cad_individual tfci on tfci.co_seq_fat_cad_individual = tfc.co_fat_cad_individual
            left join tb_fat_cidadao_pec tfcp on tfcp.co_seq_fat_cidadao_pec = tfci.co_fat_cidadao_pec
            left join tb_cidadao tc on tfcp.co_cidadao = tc.co_seq_cidadao
            left join tb_dim_unidade_saude tdus on tfci.co_dim_unidade_saude = tdus.co_seq_dim_unidade_saude
            left join tb_dim_tipo_saida_cadastro tdtsc on tfci.co_dim_tipo_saida_cadastro = tdtsc.co_seq_dim_tipo_saida_cadastro
            left join tb_dim_profissional tdp on tfci.co_dim_profissional = tdp.co_seq_dim_profissional
            left join tb_dim_cbo tdc on tfci.co_dim_cbo_cidadao = tdc.co_seq_dim_cbo
            left join tb_dim_equipe tde on tfci.co_dim_equipe = tde.co_seq_dim_equipe
            left join tb_equipe te on te.nu_ine = tde.nu_ine 
            left join tb_tipo_equipe tte on tte.co_seq_tipo_equipe = te.tp_equipe
            left join tb_dim_tipo_origem tdto on tfci.co_dim_cds_tipo_origem = tdto.co_seq_dim_tipo_origem
            left join tb_dim_tipo_origem_dado_transp tdtodt on tdtodt.co_seq_dim_tp_orgm_dado_transp = tfci.co_dim_tipo_origem_dado_transp
            left join tb_dim_pais tdpais on tfci.co_dim_pais_nascimento = tdpais.co_seq_dim_pais
            left join tb_dim_tipo_parentesco tdtp on tfci.co_dim_tipo_parentesco = tdtp.co_seq_dim_tipo_parentesco
            left join tb_dim_sexo tds on tfci.co_dim_sexo = tds.co_seq_dim_sexo
            left join tb_dim_raca_cor tdrc on tfci.co_dim_raca_cor = tdrc.co_seq_dim_raca_cor
            left join tb_dim_etnia tdetnia on tfci.co_dim_etnia = tdetnia.co_seq_dim_etnia
            left join tb_dim_nacionalidade tdn on tfci.co_dim_nacionalidade = tdn.co_seq_dim_nacionalidade
            left join tb_dim_municipio tdm on tfci.co_dim_municipio = tdm.co_seq_dim_municipio
            left join tb_dim_uf tdu on tdm.co_dim_uf = tdu.co_seq_dim_uf
            left join tb_dim_tipo_escolaridade tdte on tfci.co_dim_tipo_escolaridade = tdte.co_seq_dim_tipo_escolaridade
            left join tb_dim_situacao_trabalho tdst on tfci.co_dim_situacao_trabalho = tdst.co_seq_dim_situacao_trabalho
            left join tb_dim_tipo_orientacao_sexual tdtos on tfci.co_dim_tipo_orientacao_sexual = tdtos.co_seq_dim_tipo_orientacao_sxl
            left join tb_dim_tipo_condicao_peso tdtcp on tfci.co_dim_tipo_condicao_peso = tdtcp.co_seq_dim_tipo_condicao_peso
            left join tb_dim_identidade_genero tdig on tfci.co_dim_identidade_genero = tdig.co_seq_dim_identidade_genero
            left join tb_dim_tempo tdtficha on tdtficha.co_seq_dim_tempo = tfci.co_dim_tempo
            left join tb_dim_povo_comunidad_trad tdpct on tdpct.co_seq_dim_povo_comunidad_trad = tfci.co_dim_povo_comunidad_trad 
            left join tb_dim_tempo_morador_rua tdtmr on tdtmr.co_seq_dim_tempo_morador_rua = tfci.co_dim_tempo_morador_rua 
            left join tb_dim_frequencia_alimentacao tdfa on tdfa.co_seq_dim_frequencia_aliment = tfci.co_dim_frequencia_alimentacao
            left join tb_dim_cbo tdcprof on tdcprof.co_seq_dim_cbo = tfci.co_dim_cbo
        where
            tfc.co_dim_tempo_validade > cast(TO_CHAR(CURRENT_DATE, 'yyyymmdd') as INTEGER)
            and tcci.st_ficha_inativa = 0
            and tfc.st_ficha_inativa = 0
            and tcci.st_versao_atual = 1
            and tfci.co_dim_tipo_saida_cadastro = 3
            and tfc.co_fat_cidadao_raiz = tfc.co_seq_fat_cidadao
    `
}