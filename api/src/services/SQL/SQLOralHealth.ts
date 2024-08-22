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
			(
				select 
					count(*)
				from 
					tb_fat_cad_individual tfci 
				left join tb_fat_cidadao tfc
					on tfc.co_fat_cad_individual = tfci.co_seq_fat_cad_individual
				left join tb_dim_tipo_saida_cadastro tdtsc 
					on tdtsc.co_seq_dim_tipo_saida_cadastro = tfci.co_dim_tipo_saida_cadastro 
				left join tb_dim_unidade_saude tdusPop on
					tdusPop.co_seq_dim_unidade_saude = tfci.co_dim_unidade_saude
				where 
					tfc.co_seq_fat_cidadao = tfc.co_fat_cidadao_raiz 
					and tfc.co_dim_tempo_validade >= cast(TO_CHAR(CURRENT_DATE, 'yyyymmdd') as INTEGER)
					and tfc.st_ficha_inativa = 0
					and tfc.st_vivo = 1
					and tdtsc.nu_identificador = '-'
					and tfci.co_dim_unidade_saude = tdus.co_seq_dim_unidade_saude
					and tfc.co_dim_tempo < 20240821
			) as "POPULAÇÃO",
			(
				select 
					count(*)
				from (
					select 
						tfao.co_fat_cidadao_pec,
						tfao.co_dim_profissional_1,
						tfao.co_dim_unidade_saude_1,
						tfao.co_dim_equipe_1,
						tfao.co_dim_tempo 
					from tb_fat_atendimento_odonto tfao
					group by 
						tfao.co_fat_cidadao_pec,
						tfao.co_dim_profissional_1,
						tfao.co_dim_unidade_saude_1,
						tfao.co_dim_equipe_1,
						tfao.co_dim_tempo
				) det
				where det.co_dim_profissional_1 = tdp.co_seq_dim_profissional
				and det.co_dim_unidade_saude_1 = tdus.co_seq_dim_unidade_saude 
				and det.co_dim_equipe_1  = tde.co_seq_dim_equipe 
				and det.co_dim_tempo between 20240801 and 20240821
			) as "PESSOAS ATENDIDAS",
			(
				select 
					count(*)
				from tb_fat_atend_odonto_proced tfaop 
				where 
					tfaop.co_dim_profissional_1 = tdp.co_seq_dim_profissional 
					and tfaop.co_dim_tempo between 20240801 and 20240821
			) as "PROCEDIMENTOS REALIZADOS",
			(   
				select 
					count(*)
				from  tb_fat_atendimento_odonto tfao
				where 
					tfao.co_dim_profissional_1 = tdp.co_seq_dim_profissional
					and tfao.co_dim_unidade_saude_1 = tdus.co_seq_dim_unidade_saude 
					and tfao.co_dim_equipe_1  = tde.co_seq_dim_equipe 
					and tfao.co_dim_tempo between 20230901 and 20240430
			) as "ATENDIMENTOS REALIZADOS",
			(select 
				count(*)
			from tb_fat_atendimento_odonto tfao 
				left join tb_dim_tipo_consulta_odonto tdtco on tfao.co_dim_tipo_consulta = tdtco.co_seq_dim_tipo_cnsulta_odonto 
			where 
				tfao.co_dim_profissional_1 = tdp.co_seq_dim_profissional
				and tfao.co_dim_unidade_saude_1 = tdus.co_seq_dim_unidade_saude 
				and tfao.co_dim_equipe_1  = tde.co_seq_dim_equipe 
				and tdtco.co_seq_dim_tipo_cnsulta_odonto = 1
				and tfao.co_dim_tempo between 20230901 and 20240430
			) as "PPT",
			(select 
				count(*)
			from tb_fat_atendimento_odonto tfao 
			where 
				tfao.co_dim_profissional_1 = tdp.co_seq_dim_profissional
				and tfao.co_dim_unidade_saude_1 = tdus.co_seq_dim_unidade_saude 
				and tfao.co_dim_equipe_1  = tde.co_seq_dim_equipe 
				and tfao.st_conduta_tratamento_concluid = 1
				and tfao.co_dim_tempo between 20230901 and 20240430
			) as "TRATAMENTO CONCLUÍDO",
			(select 
				count(*)
			from tb_fat_atendimento_odonto tfao 
			where 
				tfao.co_dim_profissional_1 = tdp.co_seq_dim_profissional
				and tfao.co_dim_unidade_saude_1 = tdus.co_seq_dim_unidade_saude 
				and tfao.co_dim_equipe_1  = tde.co_seq_dim_equipe 
				and (tfao.ds_filtro_procedimentos like '%0414020120%' or tfao.ds_filtro_procedimentos like '%ABPO011%' or tfao.ds_filtro_procedimentos like '%0307030040%' or tfao.ds_filtro_procedimentos like '%ABPO016%')
				and tfao.co_dim_tempo between 20230901 and 20240430
			) as "EXODONTIA",
			(select 
				count(*)
			from tb_fat_atividade_coletiva tfac 
			left join tb_dim_procedimento tdproc 
				on tdproc.co_seq_dim_procedimento = tfac.co_dim_procedimento
			where 
				(	
					tfac.ds_filtro_pratica_em_saude like '%|2|%'
					or tfac.ds_filtro_pratica_em_saude like '%|9|%'
					or tdproc.co_proced = '0101020023' 
					or tdproc.co_proced = '0101020040'
				)
				and tfac.co_dim_unidade_saude = tdus.co_seq_dim_unidade_saude 
				and tfac.co_dim_tempo between 20230901 and 20240430
			) as "AÇÕES COLETIVAS PREVENTIVAS",
			(select 
				count(*)
			from tb_fat_atendimento_odonto tfao 
			where 
				tfao.co_dim_profissional_1 = tdp.co_seq_dim_profissional
				and tfao.co_dim_unidade_saude_1 = tdus.co_seq_dim_unidade_saude 
				and tfao.co_dim_equipe_1  = tde.co_seq_dim_equipe 
				and (tfao.ds_filtro_procedimentos like '%0307010074%')
				and tfao.co_dim_tempo between 20230901 and 20240430
			) as "TRA / ART",
			(select 
				count(*)
			from tb_fat_atendimento_odonto tfao 
			where 
				tfao.co_dim_profissional_1 = tdp.co_seq_dim_profissional
				and tfao.co_dim_unidade_saude_1 = tdus.co_seq_dim_unidade_saude 
				and tfao.co_dim_equipe_1  = tde.co_seq_dim_equipe 
				and tfao.ds_filtro_procedimentos like any (
					select 
						concat('%',co_proced,'%')
					from tb_dim_procedimento tdp where tdp.ds_filtro like '%restauracao%'
				)
				and tfao.co_dim_tempo between 20230901 and 20240430
			) as "RESTAURACAO"
		from
			tb_fat_atendimento_odonto tfao
		left join tb_dim_unidade_saude tdus on tfao.co_dim_unidade_saude_1 = tdus.co_seq_dim_unidade_saude
		left Join tb_dim_equipe tde On tfao.co_dim_equipe_1 = tde.co_seq_dim_equipe
		left join tb_dim_profissional tdp on tdp.co_seq_dim_profissional = tfao.co_dim_profissional_1
		left join tb_dim_tempo tdt on tdt.co_seq_dim_tempo = tfao.co_dim_tempo
		left join tb_dim_cbo tdc on tdc.co_seq_dim_cbo = tfao.co_dim_cbo_1
		Where
			1 = 1
			and tfao.co_dim_tempo between 20240801 and 20240821
		group by
			tdus.co_seq_dim_unidade_saude,
			tde.co_seq_dim_equipe,
			tdp.co_seq_dim_profissional,
			tdc.co_seq_dim_cbo;
    `
}