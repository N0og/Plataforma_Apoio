export class SQL_ORAL_HEALTH {
	private SQL_BASE = `
        Select
			Distinct 
			tdus.nu_cnes As "CNES",
			UPPER(tdus.no_unidade_saude) As "ESTABELECIMENTO",
			tde.no_equipe as "NOME EQUIPE",
			tde.nu_ine as "INE",
			tdc.nu_cbo as "CBO",
			tdc.no_cbo as "DESCRIÇÃO DO CBO",
			tdp.no_profissional as "PROFISSIONAL"
		`


	private SQL_FROM = `			
	from
		tb_fat_atendimento_odonto tfao
		left join tb_dim_unidade_saude tdus on tfao.co_dim_unidade_saude_1 = tdus.co_seq_dim_unidade_saude
		left Join tb_dim_equipe tde On tfao.co_dim_equipe_1 = tde.co_seq_dim_equipe
		left join tb_dim_profissional tdp on tdp.co_seq_dim_profissional = tfao.co_dim_profissional_1
		left join tb_dim_tempo tdt on tdt.co_seq_dim_tempo = tfao.co_dim_tempo
		left join tb_dim_cbo tdc on tdc.co_seq_dim_cbo = tfao.co_dim_cbo_1
`
	private SQL_WHERE = `
		Where
			1 = 1
			and tdt.dt_registro between :data_inicio and :data_final
	`

	private SQL_END = `
		group by
		tdus.co_seq_dim_unidade_saude,
		tde.co_seq_dim_equipe,
		tdp.co_seq_dim_profissional,
		tdc.co_seq_dim_cbo;
	`

	private SQL_DYNAMIC_WHERE = `
	`

	private SQL_POPULACAO() {
		return {
			select: `
					,
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
				left join tb_dim_tempo tdt on
					tdt.co_seq_dim_tempo = tfci.co_dim_tempo
				where 
					tfc.co_seq_fat_cidadao = tfc.co_fat_cidadao_raiz 
					and tfc.co_dim_tempo_validade >= cast(TO_CHAR(CURRENT_DATE, 'yyyymmdd') as INTEGER)
					and tfc.st_ficha_inativa = 0
					and tfc.st_vivo = 1
					and tdtsc.nu_identificador = '-'
					and tfci.co_dim_unidade_saude = tdus.co_seq_dim_unidade_saude
					and tdt.dt_registro < :data_final
			) as "POPULAÇÃO"
				`,
			from: ''
		}
	}

	private SQL_PESSOAS_ATENDIDAS() {
		return {
			select: `
					,
					(
				select 
					count(*)
				from (
					select 
						tfao.co_fat_cidadao_pec,
						tfao.co_dim_profissional_1,
						tfao.co_dim_unidade_saude_1,
						tfao.co_dim_equipe_1,
						tdt.dt_registro
					from tb_fat_atendimento_odonto tfao
					left join tb_dim_tempo tdt
						on tdt.co_seq_dim_tempo = tfao.co_dim_tempo
					group by 
						tfao.co_fat_cidadao_pec,
						tfao.co_dim_profissional_1,
						tfao.co_dim_unidade_saude_1,
						tfao.co_dim_equipe_1,
						tdt.dt_registro
				) det
				where det.co_dim_profissional_1 = tdp.co_seq_dim_profissional
				and det.co_dim_unidade_saude_1 = tdus.co_seq_dim_unidade_saude 
				and det.co_dim_equipe_1  = tde.co_seq_dim_equipe 
				and det.dt_registro between :data_inicio and :data_final
			) as "PESSOAS ATENDIDAS"
				`,
			from: ''
		}
	}
	private SQL_PROCEDIMENTOS_REALIZADOS() {
		return {
			select: `
					,
					(
				select 
					count(*)
				from tb_fat_atend_odonto_proced tfaop 
				left join tb_dim_tempo tdt
					on tdt.co_seq_dim_tempo = tfaop.co_dim_tempo
				where 
					tfaop.co_dim_profissional_1 = tdp.co_seq_dim_profissional 
					and tdt.dt_registro between :data_inicio and :data_final
			) as "PROCEDIMENTOS REALIZADOS"
				`,
			from: ''
		}
	}

	private SQL_ATENDIMENTOS_REALIZADOS() {
		return {
			select: `
					,
					(   
				select 
					count(*)
				from  tb_fat_atendimento_odonto tfao
				left join tb_dim_tempo tdt
					on tdt.co_seq_dim_tempo = tfao.co_dim_tempo
				where 
					tfao.co_dim_profissional_1 = tdp.co_seq_dim_profissional
					and tfao.co_dim_unidade_saude_1 = tdus.co_seq_dim_unidade_saude 
					and tfao.co_dim_equipe_1  = tde.co_seq_dim_equipe 
					and tdt.dt_registro between :data_inicio and :data_final
			) as "ATENDIMENTOS REALIZADOS"
				`,
			from: ''
		}
	}


	private SQL_PPT() {
		return {
			select: `
					,
					(select 
				count(*)
			from tb_fat_atendimento_odonto tfao 
				left join tb_dim_tipo_consulta_odonto tdtco on tfao.co_dim_tipo_consulta = tdtco.co_seq_dim_tipo_cnsulta_odonto 
				left join tb_dim_tempo tdt
					on tdt.co_seq_dim_tempo = tfao.co_dim_tempo
			where 
				tfao.co_dim_profissional_1 = tdp.co_seq_dim_profissional
				and tfao.co_dim_unidade_saude_1 = tdus.co_seq_dim_unidade_saude 
				and tfao.co_dim_equipe_1  = tde.co_seq_dim_equipe 
				and tdtco.co_seq_dim_tipo_cnsulta_odonto = 1
				and tdt.dt_registro between :data_inicio and :data_final
			) as "PPT"
				`,
			from: ''
		}
	}

	private SQL_TRATAMENTO_CONCLUIDO() {
		return {
			select: `
					,
					(select 
				count(*)
			from tb_fat_atendimento_odonto tfao 
			left join tb_dim_tempo tdt
					on tdt.co_seq_dim_tempo = tfao.co_dim_tempo
			where 
				tfao.co_dim_profissional_1 = tdp.co_seq_dim_profissional
				and tfao.co_dim_unidade_saude_1 = tdus.co_seq_dim_unidade_saude 
				and tfao.co_dim_equipe_1  = tde.co_seq_dim_equipe 
				and tfao.st_conduta_tratamento_concluid = 1
				and tdt.dt_registro between :data_inicio and :data_final
			) as "TRATAMENTO CONCLUÍDO"
				`,
			from: ''
		}
	}

	private SQL_EXODONTIA() {
		return {
			select: `
					,
					(select 
				count(*)
			from tb_fat_atendimento_odonto tfao 
			left join tb_dim_tempo tdt
					on tdt.co_seq_dim_tempo = tfao.co_dim_tempo
			where 
				tfao.co_dim_profissional_1 = tdp.co_seq_dim_profissional
				and tfao.co_dim_unidade_saude_1 = tdus.co_seq_dim_unidade_saude 
				and tfao.co_dim_equipe_1  = tde.co_seq_dim_equipe 
				and (tfao.ds_filtro_procedimentos like '%0414020120%' or tfao.ds_filtro_procedimentos like '%ABPO011%' or tfao.ds_filtro_procedimentos like '%0414020138%' or tfao.ds_filtro_procedimentos like '%ABPO012%')
				and tdt.dt_registro between :data_inicio and :data_final
			) as "EXODONTIA"
				`,
			from: ''
		}
	}

	private SQL_ACOES_PREVENTIVAS() {
		return {
			select: `
					,
					(select 
				count(*)
			from tb_fat_atividade_coletiva tfac 
			left join tb_dim_procedimento tdproc 
				on tdproc.co_seq_dim_procedimento = tfac.co_dim_procedimento
			left join tb_dim_tempo tdt
					on tdt.co_seq_dim_tempo = tfac.co_dim_tempo
			where 
				(	
					tfac.ds_filtro_pratica_em_saude like '%|2|%'
					or tfac.ds_filtro_pratica_em_saude like '%|9|%'
					or tdproc.co_proced = '0101020023' 
					or tdproc.co_proced = '0101020040'
				)
				and tfac.co_dim_unidade_saude = tdus.co_seq_dim_unidade_saude 
				and tdt.dt_registro between :data_inicio and :data_final
			) as "AÇÕES COLETIVAS PREVENTIVAS"
				`,
			from: ''
		}
	}

	private SQL_TRA() {
		return {
			select: `
					,
					(select 
				count(*)
			from tb_fat_atendimento_odonto tfao 
			left join tb_dim_tempo tdt
					on tdt.co_seq_dim_tempo = tfao.co_dim_tempo
			where 
				tfao.co_dim_profissional_1 = tdp.co_seq_dim_profissional
				and tfao.co_dim_unidade_saude_1 = tdus.co_seq_dim_unidade_saude 
				and tfao.co_dim_equipe_1  = tde.co_seq_dim_equipe 
				and (tfao.ds_filtro_procedimentos like '%0307010074%')
				and tdt.dt_registro between :data_inicio and :data_final
			) as "TRA / ART"
				`,
			from: ''
		}
	}

	private SQL_RESTAURACAO() {
		return {
			select: `
					,
					(select 
				count(*)
			from tb_fat_atendimento_odonto tfao 
			left join tb_dim_tempo tdt
					on tdt.co_seq_dim_tempo = tfao.co_dim_tempo
			where 
				tfao.co_dim_profissional_1 = tdp.co_seq_dim_profissional
				and tfao.co_dim_unidade_saude_1 = tdus.co_seq_dim_unidade_saude 
				and tfao.co_dim_equipe_1  = tde.co_seq_dim_equipe 
				and tfao.ds_filtro_procedimentos like any (
					select 
						concat('%',co_proced,'%')
					from tb_dim_procedimento tdp where tdp.ds_filtro like '%restauracao%'
				)
				and tdt.dt_registro between :data_inicio and :data_final
			) as "RESTAURACAO"
				`,
			from: ''
		}
	}


	getBase() {
        return this.SQL_BASE
    }

    getFrom() {
        return this.SQL_FROM
    }

    getWhere() {
        return this.SQL_WHERE
    }

    getEnd() {
        return this.SQL_END
    }

    getPopulacao() {
        return this.SQL_POPULACAO()
    }

	getPessoasAttnd() {
        return this.SQL_PESSOAS_ATENDIDAS()
    }

	getProcedimentos() {
        return this.SQL_PROCEDIMENTOS_REALIZADOS()
    }

	getAttndRealizado() {
        return this.SQL_ATENDIMENTOS_REALIZADOS()
    }

	getPPT() {
        return this.SQL_PPT()
    }

    getTratConcluido() {
        return this.SQL_TRATAMENTO_CONCLUIDO()
    }

    getExodontia() {
        return this.SQL_EXODONTIA()
    }

    getPreventivos() {
        return this.SQL_ACOES_PREVENTIVAS()
    }

    getTra() {
        return this.SQL_TRA()
    }

	getRestauracao() {
		return this.SQL_RESTAURACAO()
	}

    setDynamicWhere(clause: string) {
        this.SQL_DYNAMIC_WHERE += clause
    }

}

export class SQL_BASE_ESCOVACAO {
	SQL_BASE = `
		select 
			tus.nu_cnes As "CNES",
			UPPER(tus.no_unidade_saude) As "ESTABELECIMENTO",
			te.no_equipe as "NOME EQUIPE",
			te.nu_ine as "INE",
			tc.co_cbo_2002 as "CBO",
			tc.no_cbo as "DESCRIÇÃO DO CBO",
			tp.no_profissional as "PROFISSIONAL",
			(select 
				count(tcfac2.co_seq_cds_ficha_ativ_col)
			from tb_cds_ficha_ativ_col tcfac2
			left join rl_cds_ficha_ativ_col_pratica rcfacp
				on rcfacp.co_cds_ficha_ativ_col = tcfac2.co_seq_cds_ficha_ativ_col 
			left join tb_cds_tipo_ativ_col tctac 
				on tctac.co_cds_tipo_ativ_col = tcfac2.tp_cds_ativ_col 
			left join tb_cds_ativ_col_pratica tcacpra 
				on tcacpra.co_cds_ativ_col_pratica = rcfacp.co_cds_ativ_col_pratica 
			left join tb_cds_prof tcp2 
				on tcp2.co_seq_cds_prof = tcfac2.co_cds_prof_responsavel 
			where 
				tcfac2.dt_ativ_col between :data_inicio and :data_final 
				and tcfac2.tp_cds_ativ_col = 6
				and tcacpra.no_identificador = 'ESCOVACAO_DENTAL_SUPERVISIONADA'
				and tctac.no_identificador = 'AVALIACAO_PROCEDIMENTO_COLETIVO'
				and tcp2.nu_cnes = tcp.nu_cnes
				and tcp2.nu_ine = tcp.nu_ine
				and tcp2.nu_cbo_2002 = tcp.nu_cbo_2002 
			) as "TOTAL DE ATIVIDADES COLETIVAS",
			count(tcacp.co_cds_ficha_ativ_col) as "TOTAL DE PARTICIPANTES",
			SUM(CASE 
					WHEN AGE(tcacp.dt_nascimento) < interval '1 year' THEN 1 
					ELSE 0 
				END) AS "MENOS DE 01 ANO",
			SUM(CASE 
					WHEN AGE(tcacp.dt_nascimento) >= interval '1 year' AND AGE(tcacp.dt_nascimento) < interval '2 years' THEN 1 
					ELSE 0 
				END) AS "01 ANO",
			SUM(CASE 
					WHEN AGE(tcacp.dt_nascimento) >= interval '2 years' AND AGE(tcacp.dt_nascimento) < interval '3 years' THEN 1 
					ELSE 0 
				END) AS "02 ANOS",
			SUM(CASE 
					WHEN AGE(tcacp.dt_nascimento) >= interval '3 years' AND AGE(tcacp.dt_nascimento) < interval '4 years' THEN 1 
					ELSE 0 
				END) AS "03 ANOS",
			SUM(CASE 
					WHEN AGE(tcacp.dt_nascimento) >= interval '4 years' AND AGE(tcacp.dt_nascimento) < interval '5 years' THEN 1 
					ELSE 0 
				END) AS "04 ANOS",
			SUM(CASE 
					WHEN AGE(tcacp.dt_nascimento) >= interval '5 years' AND AGE(tcacp.dt_nascimento) < interval '10 years' THEN 1 
					ELSE 0 
				END) AS "05 A 09 ANOS",
			SUM(CASE 
					WHEN AGE(tcacp.dt_nascimento) >= interval '10 years' AND AGE(tcacp.dt_nascimento) < interval '15 years' THEN 1 
					ELSE 0 
				END) AS "10 A 14 ANOS",
			SUM(CASE 
					WHEN AGE(tcacp.dt_nascimento) >= interval '15 years' AND AGE(tcacp.dt_nascimento) < interval '20 years' THEN 1 
					ELSE 0 
				END) AS "15 A 19 ANOS"
		from 
			tb_cds_ficha_ativ_col tcfac
		left join tb_cds_prof tcp 
			on tcp.co_seq_cds_prof = tcfac.co_cds_prof_responsavel 
		left join tb_prof tp 
			on tp.nu_cns = tcp.nu_cns 
		left join tb_cds_tipo_ativ_col tctac 
			on tctac.co_cds_tipo_ativ_col = tcfac.tp_cds_ativ_col 
		left join tb_unidade_saude tus 
			on tus.nu_cnes  = tcp.nu_cnes 
		left join tb_equipe te 
			on te.nu_ine = tcp.nu_ine 
		left join tb_cbo tc 
			on tc.co_cbo_2002 = tcp.nu_cbo_2002 
		left join tb_cds_ativ_col_participante tcacp 
			on tcacp.co_cds_ficha_ativ_col = tcfac.co_seq_cds_ficha_ativ_col 
		left join rl_cds_ficha_ativ_col_pratica rcfacp
			on rcfacp.co_cds_ficha_ativ_col = tcfac.co_seq_cds_ficha_ativ_col 
		left join tb_cds_ativ_col_pratica tcacpra 
			on tcacpra.co_cds_ativ_col_pratica = rcfacp.co_cds_ativ_col_pratica 
	`
	SQL_WHERE = `
		where 
			dt_ativ_col between :data_inicio and :data_final 
			and tctac.no_identificador = 'AVALIACAO_PROCEDIMENTO_COLETIVO'
			and tcacpra.no_identificador = 'ESCOVACAO_DENTAL_SUPERVISIONADA'
	`

	SQL_END = `
		group by 
			tus.nu_cnes,
			tcp.nu_cnes,
			tus.no_unidade_saude,
			te.no_equipe,
			tcp.nu_ine,
			te.nu_ine,
			tc.co_cbo_2002,
			tc.no_cbo,
			tcp.nu_cbo_2002,
			tp.no_profissional
	`

}