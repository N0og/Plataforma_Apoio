import { databases } from "../../api"
import DynamicParameters from "../../utils/toReports/DynamicParameters"
import { IProdutividadeUBS } from "../../interfaces/IProdutividadeUBS"
import { queryConvert } from "../../utils/toBD/Upg/pgPlaceHolders"



export default class ProdutividadeUBS_ConsolidadoQuery {
    async execute(filtros_body: IProdutividadeUBS) {
        
        const parametros_dinamicos = new DynamicParameters()
        let query_base_filtros = ""

        let query_base = `
        select
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
            subquery."LOCAL DE ATENDIMENTO",
            TO_CHAR(EXTRACT(YEAR FROM subquery.dt_registro), '9999') AS "ANO",
            TO_CHAR(EXTRACT(MONTH FROM subquery.dt_registro), '99') AS "MES",
        SUM(case when extract(day from subquery.dt_registro) = 1 then subquery.REALIZADOS else 0 end) as "Dia 1",
        SUM(case when extract(day from subquery.dt_registro) = 2 then subquery.REALIZADOS else 0 end) as "Dia 2",
        SUM(case when extract(day from subquery.dt_registro) = 3 then subquery.REALIZADOS else 0 end) as "Dia 3",
        SUM(case when extract(day from subquery.dt_registro) = 4 then subquery.REALIZADOS else 0 end) as "Dia 4",
        SUM(case when extract(day from subquery.dt_registro) = 5 then subquery.REALIZADOS else 0 end) as "Dia 5",
        SUM(case when extract(day from subquery.dt_registro) = 6 then subquery.REALIZADOS else 0 end) as "Dia 6",
        SUM(case when extract(day from subquery.dt_registro) = 7 then subquery.REALIZADOS else 0 end) as "Dia 7",
        SUM(case when extract(day from subquery.dt_registro) = 8 then subquery.REALIZADOS else 0 end) as "Dia 8",
        SUM(case when extract(day from subquery.dt_registro) = 9 then subquery.REALIZADOS else 0 end) as "Dia 9",
        SUM(case when extract(day from subquery.dt_registro) = 10 then subquery.REALIZADOS else 0 end) as "Dia 10",
        SUM(case when extract(day from subquery.dt_registro) = 11 then subquery.REALIZADOS else 0 end) as "Dia 11",
        SUM(case when extract(day from subquery.dt_registro) = 12 then subquery.REALIZADOS else 0 end) as "Dia 12",
        SUM(case when extract(day from subquery.dt_registro) = 13 then subquery.REALIZADOS else 0 end) as "Dia 13",
        SUM(case when extract(day from subquery.dt_registro) = 14 then subquery.REALIZADOS else 0 end) as "Dia 14",
        SUM(case when extract(day from subquery.dt_registro) = 15 then subquery.REALIZADOS else 0 end) as "Dia 15",
        SUM(case when extract(day from subquery.dt_registro) = 16 then subquery.REALIZADOS else 0 end) as "Dia 16",
        SUM(case when extract(day from subquery.dt_registro) = 17 then subquery.REALIZADOS else 0 end) as "Dia 17",
        SUM(case when extract(day from subquery.dt_registro) = 18 then subquery.REALIZADOS else 0 end) as "Dia 18",
        SUM(case when extract(day from subquery.dt_registro) = 19 then subquery.REALIZADOS else 0 end) as "Dia 19",
        SUM(case when extract(day from subquery.dt_registro) = 20 then subquery.REALIZADOS else 0 end) as "Dia 20",
        SUM(case when extract(day from subquery.dt_registro) = 21 then subquery.REALIZADOS else 0 end) as "Dia 21",
        SUM(case when extract(day from subquery.dt_registro) = 22 then subquery.REALIZADOS else 0 end) as "Dia 22",
        SUM(case when extract(day from subquery.dt_registro) = 23 then subquery.REALIZADOS else 0 end) as "Dia 23",
        SUM(case when extract(day from subquery.dt_registro) = 24 then subquery.REALIZADOS else 0 end) as "Dia 24",
        SUM(case when extract(day from subquery.dt_registro) = 25 then subquery.REALIZADOS else 0 end) as "Dia 25",
        SUM(case when extract(day from subquery.dt_registro) = 26 then subquery.REALIZADOS else 0 end) as "Dia 26",
        SUM(case when extract(day from subquery.dt_registro) = 27 then subquery.REALIZADOS else 0 end) as "Dia 27",
        SUM(case when extract(day from subquery.dt_registro) = 28 then subquery.REALIZADOS else 0 end) as "Dia 28",
        SUM(case when extract(day from subquery.dt_registro) = 29 then subquery.REALIZADOS else 0 end) as "Dia 29",
        SUM(case when extract(day from subquery.dt_registro) = 30 then subquery.REALIZADOS else 0 end) as "Dia 30",
        SUM(case when extract(day from subquery.dt_registro) = 31 then subquery.REALIZADOS else 0 end) as "Dia 31",
        SUM(subquery.REALIZADOS) as "Total Geral"
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
            tdla.ds_local_atendimento as "LOCAL DE ATENDIMENTO",
            tdt.dt_registro,
            count(tdp.no_profissional) as REALIZADOS
        from
            tb_fat_atendimento_individual tfai
            inner join tb_fat_cidadao_pec tfcp on tfcp.co_seq_fat_cidadao_pec = tfai.co_fat_cidadao_pec
            inner join tb_dim_profissional tdp on tdp.co_seq_dim_profissional = tfai.co_dim_profissional_1
            inner join tb_dim_unidade_saude tdus on tfai.co_dim_unidade_saude_1 = tdus.co_seq_dim_unidade_saude
            Inner Join tb_dim_equipe tde On tfai.co_dim_equipe_1 = tde.co_seq_dim_equipe
            inner join tb_dim_tempo tdt on tdt.co_seq_dim_tempo = tfai.co_dim_tempo
            inner join tb_dim_cbo tdc on tdc.co_seq_dim_cbo = tfai.co_dim_cbo_1
            inner join tb_equipe te on te.nu_ine = tde.nu_ine
            inner join tb_unidade_saude tus on tus.nu_cnes = tdus.nu_cnes
            left join tb_localidade tl On tus.co_localidade_endereco = tl.co_localidade
            left join tb_uf On tl.co_uf = tb_uf.co_uf
            inner join tb_tipo_equipe tte on te.tp_equipe = tte.co_seq_tipo_equipe
            inner join tb_dim_tipo_atendimento tdta on tdta.co_seq_dim_tipo_atendimento = tfai.co_dim_tipo_atendimento
            inner join tb_dim_tipo_ficha tdtf on tdtf.co_seq_dim_tipo_ficha = tfai.co_dim_tipo_ficha
            inner join tb_dim_local_atendimento tdla on tdla.co_seq_dim_local_atendimento = tfai.co_dim_local_atendimento
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
            "LOCAL DE ATENDIMENTO",
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
            tdla.ds_local_atendimento as "LOCAL DE ATENDIMENTO",
            tdt.dt_registro,
            count(tdp.no_profissional) as REALIZADOS
        from
            tb_fat_atendimento_odonto tfao
            inner join tb_fat_cidadao_pec tfcp on tfcp.co_seq_fat_cidadao_pec = tfao.co_fat_cidadao_pec
            inner join tb_dim_profissional tdp on tdp.co_seq_dim_profissional = tfao.co_dim_profissional_1
            inner join tb_dim_unidade_saude tdus on tfao.co_dim_unidade_saude_1 = tdus.co_seq_dim_unidade_saude
            Inner Join tb_dim_equipe tde On tfao.co_dim_equipe_1 = tde.co_seq_dim_equipe
            inner join tb_dim_tempo tdt on tdt.co_seq_dim_tempo = tfao.co_dim_tempo
            inner join tb_dim_cbo tdc on tdc.co_seq_dim_cbo = tfao.co_dim_cbo_1
            inner join tb_equipe te on te.nu_ine = tde.nu_ine
            inner join tb_unidade_saude tus on tus.nu_cnes = tdus.nu_cnes
            left join tb_localidade tl On tus.co_localidade_endereco = tl.co_localidade
            left join tb_uf On tl.co_uf = tb_uf.co_uf
            inner join tb_tipo_equipe tte on te.tp_equipe = tte.co_seq_tipo_equipe
            inner join tb_dim_tipo_atendimento tdta on tdta.co_seq_dim_tipo_atendimento = tfao.co_dim_tipo_atendimento
            inner join tb_dim_tipo_ficha tdtf on tdtf.co_seq_dim_tipo_ficha = tfao.co_dim_tipo_ficha
            inner join tb_dim_local_atendimento tdla on tdla.co_seq_dim_local_atendimento = tfao.co_dim_local_atendimento
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
            "LOCAL DE ATENDIMENTO",
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
            tdla.ds_local_atendimento as "LOCAL DE ATENDIMENTO",
            tdt.dt_registro,
            count(tdp.no_profissional) AS REALIZADOS
        FROM
            tb_fat_procedimento tfp
            INNER JOIN tb_dim_profissional tdp ON tfp.co_dim_profissional = tdp.co_seq_dim_profissional
            INNER JOIN tb_dim_equipe tde ON tfp.co_dim_equipe = tde.co_seq_dim_equipe
            inner join tb_equipe te on te.nu_ine = tde.nu_ine
            inner join tb_tipo_equipe tte on te.tp_equipe = tte.co_seq_tipo_equipe
            INNER JOIN tb_dim_unidade_saude tdus ON tfp.co_dim_unidade_saude = tdus.co_seq_dim_unidade_saude
            INNER JOIN tb_dim_cbo tdc ON tfp.co_dim_cbo = tdc.co_seq_dim_cbo
            INNER JOIN tb_dim_tempo tdt ON tfp.co_dim_tempo = tdt.co_seq_dim_tempo
            inner join tb_dim_tipo_ficha tdtf on tdtf.co_seq_dim_tipo_ficha = tfp.co_dim_tipo_ficha
            inner join tb_fat_proced_atend_proced tfpap on tfpap.co_fat_procedimento = tfp.co_seq_fat_procedimento
            inner join tb_dim_local_atendimento tdla on tdla.co_seq_dim_local_atendimento = tfpap.co_dim_local_atendimento
            inner join tb_dim_procedimento tdproced on tdproced.co_seq_dim_procedimento = tfpap.co_dim_procedimento 
        WHERE
            tdp.st_registro_valido = 1
            and tdproced.co_proced not in (select tp.co_proced from tb_proced tp where tp.no_proced like '%CONSULTA%')
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
            "LOCAL DE ATENDIMENTO",
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
            'DOMICÍLIO' as "LOCAL DE ATENDIMENTO",
            tdt.dt_registro,
            COUNT(tdp.no_profissional) AS REALIZADOS
        FROM tb_fat_visita_domiciliar tfvd 
        inner join tb_dim_unidade_saude tdus on tdus.co_seq_dim_unidade_saude = tfvd.co_dim_unidade_saude 
        inner join tb_dim_equipe tde on tde.co_seq_dim_equipe = tfvd.co_dim_equipe 
        left join tb_equipe te on te.nu_ine = tde.nu_ine 
        inner join tb_tipo_equipe tte on tte.co_seq_tipo_equipe = te.tp_equipe 
        inner join tb_dim_cbo tdc on tdc.co_seq_dim_cbo = tfvd.co_dim_cbo 
        inner join tb_dim_profissional tdp on tdp.co_seq_dim_profissional = tfvd.co_dim_profissional 
        inner join tb_dim_tipo_ficha tdtf on tdtf.co_seq_dim_tipo_ficha = tfvd.co_dim_tipo_ficha 
        inner join tb_dim_desfecho_visita tddv on tddv.co_seq_dim_desfecho_visita = tfvd.co_dim_desfecho_visita 
        inner join tb_dim_tempo tdt on tdt.co_seq_dim_tempo = tfvd.co_dim_tempo 
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
            tdt.dt_registro) subquery
        `
        

        if (filtros_body.data_inicial != null && filtros_body.data_final != null) {
            query_base_filtros += `
                and subquery.dt_registro between :data_inicio and :data_final
            `
            parametros_dinamicos.Add('data_inicio', filtros_body.data_inicial);
            parametros_dinamicos.Add('data_final', filtros_body.data_final);
        }

        if (filtros_body.cnes) {
            query_base_filtros += `
                and subquery."CNES" = :unidade
            `
            parametros_dinamicos.Add('unidade', filtros_body.cnes);
        }

        if (filtros_body.ine) {
            query_base_filtros += `
                and subquery."INE" = :equipe
            `
            parametros_dinamicos.Add('equipe', filtros_body.ine);
        }

        if (filtros_body.profissional) {
            query_base_filtros += `
                and subquery."PROFISSIONAL" = :profissional
            `
            parametros_dinamicos.Add('profissional', filtros_body.profissional);
        }


        if(filtros_body.cbo){
            query_base_filtros += `
                and subquery."CBO" = :cbo
            `
            parametros_dinamicos.Add('cbo', filtros_body.cbo);
        }
                 

        query_base += `
        where
            1=1
            ${query_base_filtros}
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
            subquery."LOCAL DE ATENDIMENTO",
            "ANO",
            "MES"
        `

        const result = await databases.PSQLClient.query(queryConvert(query_base, parametros_dinamicos.GetAll()))
    
        return result.rows;
           
         
    }

}