export class SQL_PROD_UBS{

    private SQL_BASE: string = 
    `
        select
            subquery."CNES" as nu_cnes,
            subquery."ESTABELECIMENTO" as no_estabelecimento,
            subquery."NOME EQUIPE" as no_equipe,
            subquery."TIPO DE EQUIPE" as tp_equipe,
            subquery."INE" as nu_ine,
            subquery."CBO" as nu_cbo,
            subquery."DESCRIÇÃO DO CBO" as ds_cbo,
            subquery."PROFISSIONAL" as no_prof,
            subquery."TIPO DE REGISTRO" as tp_reg,
            subquery."TIPO DE FICHA" as tp_ficha,
            subquery."TIPO ATENDIMENTO" as tp_atend,
            subquery."TIPO DE CONSULTA" as tp_consulta,
            subquery."LOCAL DE ATENDIMENTO" as no_local_atend,
            TO_CHAR(EXTRACT(YEAR FROM subquery.dt_registro), '9999') AS nu_ano,
            TO_CHAR(EXTRACT(MONTH FROM subquery.dt_registro), '99') AS nu_mes,
        SUM(case when extract(day from subquery.dt_registro) = 1 then subquery.REALIZADOS else 0 end) as dia_01,
        SUM(case when extract(day from subquery.dt_registro) = 2 then subquery.REALIZADOS else 0 end) as dia_02,
        SUM(case when extract(day from subquery.dt_registro) = 3 then subquery.REALIZADOS else 0 end) as dia_03,
        SUM(case when extract(day from subquery.dt_registro) = 4 then subquery.REALIZADOS else 0 end) as dia_04,
        SUM(case when extract(day from subquery.dt_registro) = 5 then subquery.REALIZADOS else 0 end) as dia_05,
        SUM(case when extract(day from subquery.dt_registro) = 6 then subquery.REALIZADOS else 0 end) as dia_06,
        SUM(case when extract(day from subquery.dt_registro) = 7 then subquery.REALIZADOS else 0 end) as dia_07,
        SUM(case when extract(day from subquery.dt_registro) = 8 then subquery.REALIZADOS else 0 end) as dia_08,
        SUM(case when extract(day from subquery.dt_registro) = 9 then subquery.REALIZADOS else 0 end) as dia_09,
        SUM(case when extract(day from subquery.dt_registro) = 10 then subquery.REALIZADOS else 0 end) as dia_10,
        SUM(case when extract(day from subquery.dt_registro) = 11 then subquery.REALIZADOS else 0 end) as dia_11,
        SUM(case when extract(day from subquery.dt_registro) = 12 then subquery.REALIZADOS else 0 end) as dia_12,
        SUM(case when extract(day from subquery.dt_registro) = 13 then subquery.REALIZADOS else 0 end) as dia_13,
        SUM(case when extract(day from subquery.dt_registro) = 14 then subquery.REALIZADOS else 0 end) as dia_14,
        SUM(case when extract(day from subquery.dt_registro) = 15 then subquery.REALIZADOS else 0 end) as dia_15,
        SUM(case when extract(day from subquery.dt_registro) = 16 then subquery.REALIZADOS else 0 end) as dia_16,
        SUM(case when extract(day from subquery.dt_registro) = 17 then subquery.REALIZADOS else 0 end) as dia_17,
        SUM(case when extract(day from subquery.dt_registro) = 18 then subquery.REALIZADOS else 0 end) as dia_18,
        SUM(case when extract(day from subquery.dt_registro) = 19 then subquery.REALIZADOS else 0 end) as dia_19,
        SUM(case when extract(day from subquery.dt_registro) = 20 then subquery.REALIZADOS else 0 end) as dia_20,
        SUM(case when extract(day from subquery.dt_registro) = 21 then subquery.REALIZADOS else 0 end) as dia_21,
        SUM(case when extract(day from subquery.dt_registro) = 22 then subquery.REALIZADOS else 0 end) as dia_22,
        SUM(case when extract(day from subquery.dt_registro) = 23 then subquery.REALIZADOS else 0 end) as dia_23,
        SUM(case when extract(day from subquery.dt_registro) = 24 then subquery.REALIZADOS else 0 end) as dia_24,
        SUM(case when extract(day from subquery.dt_registro) = 25 then subquery.REALIZADOS else 0 end) as dia_25,
        SUM(case when extract(day from subquery.dt_registro) = 26 then subquery.REALIZADOS else 0 end) as dia_26,
        SUM(case when extract(day from subquery.dt_registro) = 27 then subquery.REALIZADOS else 0 end) as dia_27,
        SUM(case when extract(day from subquery.dt_registro) = 28 then subquery.REALIZADOS else 0 end) as dia_28,
        SUM(case when extract(day from subquery.dt_registro) = 29 then subquery.REALIZADOS else 0 end) as dia_29,
        SUM(case when extract(day from subquery.dt_registro) = 30 then subquery.REALIZADOS else 0 end) as dia_30,
        SUM(case when extract(day from subquery.dt_registro) = 31 then subquery.REALIZADOS else 0 end) as dia_31,
        SUM(subquery.REALIZADOS) as total_geral
        FROM
        (Select
            Distinct 
            tdus.nu_cnes As "CNES",
            UPPER(tdus.no_unidade_saude) As "ESTABELECIMENTO",
            tde.no_equipe as "NOME EQUIPE",
            tte.sg_tipo_equipe as "TIPO DE EQUIPE",
            tde.nu_ine as "INE",
            tdc.nu_cbo as "CBO",
            tdc.no_cbo as "DESCRIÇÃO DO CBO",
            tdp.no_profissional as "PROFISSIONAL",
            tdtf.ds_tipo_ficha as "TIPO DE REGISTRO",
            'FAI' as "TIPO DE FICHA",
            UPPER(tdta.ds_tipo_atendimento) as "TIPO ATENDIMENTO",
            '-' as "TIPO DE CONSULTA",
            tdla.ds_local_atendimento as "LOCAL DE ATENDIMENTO",
            tdt.dt_registro,
            tdt.ds_dia_semana,
            count(tdp.no_profissional) as REALIZADOS
        from
            tb_fat_atendimento_individual tfai
            left join tb_fat_cidadao_pec tfcp on tfcp.co_seq_fat_cidadao_pec = tfai.co_fat_cidadao_pec
            left join tb_dim_profissional tdp on tdp.co_seq_dim_profissional = tfai.co_dim_profissional_1
            left join tb_dim_unidade_saude tdus on tfai.co_dim_unidade_saude_1 = tdus.co_seq_dim_unidade_saude
            left Join tb_dim_equipe tde On tfai.co_dim_equipe_1 = tde.co_seq_dim_equipe
            left join tb_dim_tempo tdt on tdt.co_seq_dim_tempo = tfai.co_dim_tempo
            left join tb_dim_cbo tdc on tdc.co_seq_dim_cbo = tfai.co_dim_cbo_1
            left join tb_unidade_saude tus on tus.nu_cnes = tdus.nu_cnes
            left join tb_equipe te on te.nu_ine = tde.nu_ine and te.co_unidade_saude = tus.co_seq_unidade_saude 
            left join tb_localidade tl On tus.co_localidade_endereco = tl.co_localidade
            left join tb_uf On tl.co_uf = tb_uf.co_uf
            left join tb_tipo_equipe tte on te.tp_equipe = tte.co_seq_tipo_equipe
            left join tb_dim_tipo_atendimento tdta on tdta.co_seq_dim_tipo_atendimento = tfai.co_dim_tipo_atendimento
            left join tb_dim_tipo_ficha tdtf on tdtf.co_seq_dim_tipo_ficha = tfai.co_dim_tipo_ficha
            left join tb_dim_local_atendimento tdla on tdla.co_seq_dim_local_atendimento = tfai.co_dim_local_atendimento
        Where
            1 = 1
        group by
            "CNES",
            "ESTABELECIMENTO",
            "NOME EQUIPE",
            "TIPO DE EQUIPE",
            "INE",
            "CBO",
            "DESCRIÇÃO DO CBO",
            "PROFISSIONAL",
            "TIPO DE REGISTRO",
            "TIPO DE FICHA",
            "TIPO ATENDIMENTO",
            "TIPO DE CONSULTA",
            "LOCAL DE ATENDIMENTO",
            tdt.ds_dia_semana,
            tdt.dt_registro  
        union
        Select
            Distinct 
            tdus.nu_cnes As "CNES",
            UPPER(tdus.no_unidade_saude) As "ESTABELECIMENTO",
            tde.no_equipe as "NOME EQUIPE",
            tte.sg_tipo_equipe as "TIPO DE EQUIPE",
            tde.nu_ine as "INE",
            tdc.nu_cbo as "CBO",
            tdc.no_cbo as "DESCRIÇÃO DO CBO",
            tdp.no_profissional as "PROFISSIONAL",
            tdtf.ds_tipo_ficha as "TIPO DE REGISTRO",
            'FAO' as "TIPO DE FICHA",
            UPPER(tdta.ds_tipo_atendimento) as "TIPO ATENDIMENTO",
            tdtco.ds_tipo_consulta_odonto as "TIPO DE CONSULTA",
            tdla.ds_local_atendimento as "LOCAL DE ATENDIMENTO",
            tdt.dt_registro,
            tdt.ds_dia_semana,
            count(tdp.no_profissional) as REALIZADOS
        from
            tb_fat_atendimento_odonto tfao
            left join tb_fat_cidadao_pec tfcp on tfcp.co_seq_fat_cidadao_pec = tfao.co_fat_cidadao_pec
            left join tb_dim_profissional tdp on tdp.co_seq_dim_profissional = tfao.co_dim_profissional_1
            left join tb_dim_unidade_saude tdus on tfao.co_dim_unidade_saude_1 = tdus.co_seq_dim_unidade_saude
            left Join tb_dim_equipe tde On tfao.co_dim_equipe_1 = tde.co_seq_dim_equipe
            left join tb_dim_tempo tdt on tdt.co_seq_dim_tempo = tfao.co_dim_tempo
            left join tb_dim_cbo tdc on tdc.co_seq_dim_cbo = tfao.co_dim_cbo_1
            left join tb_unidade_saude tus on tus.nu_cnes = tdus.nu_cnes
            left join tb_equipe te on te.nu_ine = tde.nu_ine and te.co_unidade_saude = tus.co_seq_unidade_saude 
            left join tb_localidade tl On tus.co_localidade_endereco = tl.co_localidade
            left join tb_uf On tl.co_uf = tb_uf.co_uf
            left join tb_tipo_equipe tte on te.tp_equipe = tte.co_seq_tipo_equipe
            left join tb_dim_tipo_atendimento tdta on tdta.co_seq_dim_tipo_atendimento = tfao.co_dim_tipo_atendimento
            left join tb_dim_tipo_ficha tdtf on tdtf.co_seq_dim_tipo_ficha = tfao.co_dim_tipo_ficha
            left join tb_dim_local_atendimento tdla on tdla.co_seq_dim_local_atendimento = tfao.co_dim_local_atendimento
            left join tb_dim_tipo_consulta_odonto tdtco on tfao.co_dim_tipo_consulta = tdtco.co_seq_dim_tipo_cnsulta_odonto 
        Where
            1 = 1
        group by
            "CNES",
            "ESTABELECIMENTO",
            "NOME EQUIPE",
            "TIPO DE EQUIPE",
            "INE",
            "CBO",
            "DESCRIÇÃO DO CBO",
            "PROFISSIONAL",
            "TIPO DE REGISTRO",
            "TIPO DE FICHA",
            "TIPO ATENDIMENTO",
            "TIPO DE CONSULTA",
            "LOCAL DE ATENDIMENTO",
            tdt.ds_dia_semana,
            tdt.dt_registro
        union
        SELECT
            Distinct 
            tdus.nu_cnes As "CNES",
            UPPER(tdus.no_unidade_saude) As "ESTABELECIMENTO",
            tde.no_equipe as "NOME EQUIPE",
            tte.sg_tipo_equipe as "TIPO DE EQUIPE",
            tde.nu_ine as "INE",
            tdc.nu_cbo as "CBO",
            tdc.no_cbo as "DESCRIÇÃO DO CBO",
            tdp.no_profissional as "PROFISSIONAL",
            tdtf.ds_tipo_ficha as "TIPO DE REGISTRO",
            'FP' as "TIPO DE FICHA",
            'PROCEDIMENTOS' as "TIPO ATENDIMENTO",
            '-' as "TIPO DE CONSULTA",
            tdla.ds_local_atendimento as "LOCAL DE ATENDIMENTO",
            tdt.dt_registro,
            tdt.ds_dia_semana,
            count(tdp.no_profissional) AS REALIZADOS
        FROM
            tb_fat_procedimento tfp
            left JOIN tb_dim_profissional tdp ON tfp.co_dim_profissional = tdp.co_seq_dim_profissional
            left JOIN tb_dim_equipe tde ON tfp.co_dim_equipe = tde.co_seq_dim_equipe
            left join tb_equipe te on te.nu_ine = tde.nu_ine
            left join tb_tipo_equipe tte on te.tp_equipe = tte.co_seq_tipo_equipe
            left JOIN tb_dim_unidade_saude tdus ON tfp.co_dim_unidade_saude = tdus.co_seq_dim_unidade_saude
            left JOIN tb_dim_cbo tdc ON tfp.co_dim_cbo = tdc.co_seq_dim_cbo
            left JOIN tb_dim_tempo tdt ON tfp.co_dim_tempo = tdt.co_seq_dim_tempo
            left join tb_dim_tipo_ficha tdtf on tdtf.co_seq_dim_tipo_ficha = tfp.co_dim_tipo_ficha
            left join tb_fat_proced_atend_proced tfpap on tfpap.co_fat_procedimento = tfp.co_seq_fat_procedimento
            left join tb_dim_local_atendimento tdla on tdla.co_seq_dim_local_atendimento = tfpap.co_dim_local_atendimento
            left join tb_dim_procedimento tdproced on tdproced.co_seq_dim_procedimento = tfpap.co_dim_procedimento 
        WHERE
            tdproced.co_proced not in (select tp.co_proced from tb_proced tp where tp.no_proced like '%CONSULTA%')
        group by
            "CNES",
            "ESTABELECIMENTO",
            "NOME EQUIPE",
            "TIPO DE EQUIPE",
            "INE",
            "CBO",
            "DESCRIÇÃO DO CBO",
            "PROFISSIONAL",
            "TIPO DE REGISTRO",
            "TIPO DE FICHA",
            "TIPO ATENDIMENTO",
            "TIPO DE CONSULTA",
            "LOCAL DE ATENDIMENTO",
            tdt.ds_dia_semana,
            tdt.dt_registro
        union
        SELECT
            distinct
            tdus.nu_cnes As "CNES",
            UPPER(tdus.no_unidade_saude) As "ESTABELECIMENTO",
            tde.no_equipe as "NOME EQUIPE",
            tte.sg_tipo_equipe as "TIPO DE EQUIPE",
            tde.nu_ine as "INE",
            tdc.nu_cbo as "CBO",
            tdc.no_cbo as "DESCRIÇÃO DO CBO",
            tdp.no_profissional as "PROFISSIONAL",
            tdtf.ds_tipo_ficha as "TIPO DE REGISTRO",
            'VD' as "TIPO DE FICHA",
            'VISITA DOMICILAR' as "TIPO ATENDIMENTO",
            '-' as "TIPO DE CONSULTA",
            'DOMICÍLIO' as "LOCAL DE ATENDIMENTO",
            tdt.dt_registro,
            tdt.ds_dia_semana,
            COUNT(tdp.no_profissional) AS REALIZADOS
        FROM tb_fat_visita_domiciliar tfvd 
        left join tb_dim_unidade_saude tdus on tdus.co_seq_dim_unidade_saude = tfvd.co_dim_unidade_saude 
        left join tb_dim_equipe tde on tde.co_seq_dim_equipe = tfvd.co_dim_equipe 
        left join tb_equipe te on te.nu_ine = tde.nu_ine 
        left join tb_tipo_equipe tte on tte.co_seq_tipo_equipe = te.tp_equipe 
        left join tb_dim_cbo tdc on tdc.co_seq_dim_cbo = tfvd.co_dim_cbo 
        left join tb_dim_profissional tdp on tdp.co_seq_dim_profissional = tfvd.co_dim_profissional 
        left join tb_dim_tipo_ficha tdtf on tdtf.co_seq_dim_tipo_ficha = tfvd.co_dim_tipo_ficha 
        left join tb_dim_desfecho_visita tddv on tddv.co_seq_dim_desfecho_visita = tfvd.co_dim_desfecho_visita 
        left join tb_dim_tempo tdt on tdt.co_seq_dim_tempo = tfvd.co_dim_tempo 
        where 
        1=1
        group by
            tdus.nu_cnes,
            tdus.no_unidade_saude,
            tde.no_equipe,
            tte.sg_tipo_equipe,
            tde.nu_ine,
            tdc.nu_cbo,
            tdc.no_cbo,
            tdp.no_profissional,
            tdtf.ds_tipo_ficha,
            "TIPO DE FICHA",
            "TIPO ATENDIMENTO",
            "TIPO DE CONSULTA",
            "LOCAL DE ATENDIMENTO",
            tdt.ds_dia_semana,
            tdt.dt_registro
        union
        select 
            distinct
            tdus.nu_cnes As "CNES",
            UPPER(tdus.no_unidade_saude) As "ESTABELECIMENTO",
            tde.no_equipe as "NOME EQUIPE",
            tte.sg_tipo_equipe as "TIPO DE EQUIPE",
            tde.nu_ine as "INE",
            tdc.nu_cbo as "CBO",
            tdc.no_cbo as "DESCRIÇÃO DO CBO",
            tdp.no_profissional as "PROFISSIONAL",
            tdtf.ds_tipo_ficha as "TIPO DE REGISTRO",
            'VACINA' as "TIPO DE FICHA",
            Case
                When tfvv.st_registro_anterior = 1
                Then 'TRANSCRIÇÃO'
                When tfvv.st_registro_anterior = 0
                Then 'APLICAÇÃO'
                Else 'REGISTRO NÃO TIPIFICADO.'
            End as "TIPO ATENDIMENTO",
            '-' as "TIPO DE CONSULTA",
            tdla.ds_local_atendimento as "LOCAL DE ATENDIMENTO",
            tdt.dt_registro,
            tdt.ds_dia_semana,
            COUNT(tdp.no_profissional) AS REALIZADOS
        from 
        tb_fat_vacinacao tfv 
        left join tb_fat_vacinacao_vacina tfvv On tfvv.co_fat_vacinacao = tfv.co_seq_fat_vacinacao
        left join tb_dim_unidade_saude tdus on tdus.co_seq_dim_unidade_saude = tfv.co_dim_unidade_saude 
        left join tb_dim_equipe tde on tde.co_seq_dim_equipe = tfv.co_dim_equipe 
        left join tb_equipe te on te.nu_ine = tde.nu_ine 
        left join tb_tipo_equipe tte on tte.co_seq_tipo_equipe = te.tp_equipe 
        left join tb_dim_cbo tdc on tdc.co_seq_dim_cbo = tfv.co_dim_cbo 
        left join tb_dim_profissional tdp on tdp.co_seq_dim_profissional = tfv.co_dim_profissional 
        left join tb_dim_tipo_ficha tdtf on tfv.co_dim_tipo_ficha = tdtf.co_seq_dim_tipo_ficha 
        left join tb_dim_tempo tdt  on tdt.co_seq_dim_tempo = tfv.co_dim_tempo 
        left join tb_dim_local_atendimento tdla on tfv.co_dim_local_atendimento = tdla.co_seq_dim_local_atendimento 
        group by
            tdus.nu_cnes,
            tdus.no_unidade_saude,
            tde.no_equipe,
            tte.sg_tipo_equipe,
            tde.nu_ine,
            tdc.nu_cbo,
            tdc.no_cbo,
            tdp.no_profissional,
            tdtf.ds_tipo_ficha,
            "TIPO DE FICHA",
            "TIPO ATENDIMENTO",
            "LOCAL DE ATENDIMENTO",
            "TIPO DE CONSULTA",
            tdt.ds_dia_semana,
            tdt.dt_registro) subquery
        where
            1=1
    `
    
    private SQL_FROM: string = 
    `
        GROUP BY
            subquery."CNES",
            subquery."ESTABELECIMENTO",
            subquery."NOME EQUIPE",
            subquery."TIPO DE EQUIPE",
            subquery."INE",
            subquery."CBO",
            subquery."DESCRIÇÃO DO CBO",
            subquery."PROFISSIONAL",
            subquery."TIPO DE REGISTRO",
            subquery."TIPO DE FICHA",
            subquery."TIPO ATENDIMENTO",
            subquery."TIPO DE CONSULTA",
            subquery."LOCAL DE ATENDIMENTO",
            nu_ano,
            nu_mes
        order by nu_ano
    `


    getBase(){
        return this.SQL_BASE
    }

    getFrom(){
        return this.SQL_FROM
    }
}
