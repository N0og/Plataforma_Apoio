export class SQL_ORAL_HEALTH{
    SQL_BASE = `
        Select
            Distinct 
            tdus.nu_cnes As "CNES",
            UPPER(tdus.no_unidade_saude) As "ESTABELECIMENTO",
            tde.no_equipe as "NOME EQUIPE",
            tde.nu_ine as "INE",
            tdc.nu_cbo as "CBO",
            tdc.no_cbo as "DESCRIÇÃO DO CBO",
            tdp.no_profissional as "PROFISSIONAL",
            count(tdp.no_profissional) as "ATENDIMENTOS REALIZADOS",
            sum(case when tdtco.nu_identificador = '1' then 1 else 0 end ) as "PPT",
            (SELECT 
		        COUNT(*)
		     FROM tb_fat_atend_odonto_proced tfaop 
		     left join tb_dim_procedimento tdproced on tdproced.co_seq_dim_procedimento = tfaop.co_dim_procedimento
		     LEFT JOIN tb_dim_profissional tdp2 ON tdp2.co_seq_dim_profissional = tfaop.co_dim_profissional_1
		     LEFT JOIN tb_dim_unidade_saude tdus2 on tdus2.co_seq_dim_unidade_saude = tfaop. co_dim_unidade_saude_1
		     LEFT JOIN tb_dim_equipe tde2 On tde2.co_seq_dim_equipe = tfaop.co_dim_equipe_1
		     WHERE 
		        tdp2.no_profissional = tdp.no_profissional 
		        and tdus2.nu_cnes = tdus.nu_cnes
		        and tde2.nu_ine = tde.nu_ine
		        AND tdproced.ds_proced like '%EXODONTIA%'
		        and tfaop.co_dim_tempo between 20230801 and 20240731
		    ) AS "TAXA DE EXODONTIA",
		    (select 
				count(*)
			from tb_fat_atividade_coletiva tfac 
			left join tb_dim_unidade_saude tdus3 on tdus3.co_seq_dim_unidade_saude = tfac.co_dim_unidade_saude 
			left join tb_dim_profissional tdp3 on tdp3.co_seq_dim_profissional = tfac.co_dim_profissional 
			left join tb_dim_equipe tde3 on tde3.co_seq_dim_equipe = tfac.co_dim_equipe 
			where 
				tfac.ds_filtro_pratica_em_saude like '%|9|%'
				and tdp3.no_profissional = tdp.no_profissional 
		        and tdus3.nu_cnes = tdus.nu_cnes
		        and tde3.nu_ine = tde.nu_ine
		        and tfac.co_dim_tempo between 20230801 and 20240731
		    ) as "ESCOVAÇÃO SUPERVISIONADA",
		    (select 
				count(*)
			from tb_fat_atividade_coletiva tfac 
			left join tb_dim_unidade_saude tdus4 on tdus4.co_seq_dim_unidade_saude = tfac.co_dim_unidade_saude 
			left join tb_dim_profissional tdp4 on tdp4.co_seq_dim_profissional = tfac.co_dim_profissional 
			left join tb_dim_equipe tde4 on tde4.co_seq_dim_equipe = tfac.co_dim_equipe 
			where 
				tfac.ds_filtro_pratica_em_saude like '%|2|%'
				and tdp4.no_profissional = tdp.no_profissional 
		        and tdus4.nu_cnes = tdus.nu_cnes
		        and tde4.nu_ine = tde.nu_ine
		        and tfac.co_dim_tempo between 20230801 and 20240731
		    ) as "APLICAÇÃO DE FLUOR",
			(select 
				count(*)
			from tb_fat_atividade_coletiva tfac 
			left join tb_dim_unidade_saude tdus5 on tdus5.co_seq_dim_unidade_saude = tfac.co_dim_unidade_saude 
			left join tb_dim_profissional tdp5 on tdp5.co_seq_dim_profissional = tfac.co_dim_profissional 
			left join tb_dim_equipe tde5 on tde5.co_seq_dim_equipe = tfac.co_dim_equipe 
			where 
				tfac.ds_filtro_pratica_em_saude like '%|30|%'	
				and tfac.co_dim_procedimento = 201
				and tdp5.no_profissional = tdp.no_profissional 
		        and tdus5.nu_cnes = tdus.nu_cnes
		        and tde5.nu_ine = tde.nu_ine
		        and tfac.co_dim_tempo between 20230801 and 20240731
		    ) as "BOCHECHO FLUORADO",
			(select 
				count(*)
			from tb_fat_atividade_coletiva tfac 
			left join tb_dim_unidade_saude tdus6 on tdus6.co_seq_dim_unidade_saude = tfac.co_dim_unidade_saude 
			left join tb_dim_profissional tdp6 on tdp6.co_seq_dim_profissional = tfac.co_dim_profissional 
			left join tb_dim_equipe tde6 on tde6.co_seq_dim_equipe = tfac.co_dim_equipe 
			where 
				tfac.ds_filtro_pratica_em_saude like '%|30|%'	
				and tfac.co_dim_procedimento = 202
				and tdp6.no_profissional = tdp.no_profissional 
		        and tdus6.nu_cnes = tdus.nu_cnes
		        and tde6.nu_ine = tde.nu_ine
		        and tfac.co_dim_tempo between 20230801 and 20240731
		    ) as "EXAME BUCAL",
            sum(case when tfao.st_conduta_tratamento_concluid = 1 then 1 else 0 end) as "TRATAMENTO CONCLUÍDO"
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
            and tfao.co_dim_tempo between 20230801 and 20240731
        group by
            "CNES",
            "ESTABELECIMENTO",
            "NOME EQUIPE",
            "INE",
            "CBO",
            "DESCRIÇÃO DO CBO",
            "PROFISSIONAL"
    `
}