export class SQL_COMPLETENESS_ESUS{
    private SQL_BASE: string = 
    `
    with familias as (
        select 
            tfcdf.nu_cns_responsavel,
            tfcdf.nu_cpf_responsavel
        from tb_fat_cad_domiciliar tfcd 
        left join tb_cds_cad_domiciliar tccd on tccd.co_unico_domicilio  = tfcd.nu_uuid_ficha_origem 
        left join tb_fat_cad_dom_familia tfcdf on tfcdf.co_fat_cad_domiciliar = tfcd.co_seq_fat_cad_domiciliar  
        where 
            tfcd.co_dim_tempo_validade > cast(TO_CHAR(CURRENT_DATE, 'yyyymmdd') as INTEGER) 
            and tfcdf.co_dim_tempo_validade > cast(TO_CHAR(CURRENT_DATE, 'yyyymmdd') as INTEGER)
            and tccd.st_versao_atual = 1
            and tfcd.st_familias = 1
            and tfcdf.st_mudou = 0
    )
    select
        tcci.no_cidadao as "CIDADÃO",
        CASE 
            WHEN (tfc.nu_cpf_cidadao = '0          ' and tfc.nu_cns = '0              ') then 'SEM DOCUMENTO'
            WHEN tfc.nu_cpf_cidadao = '0          ' then tfc.nu_cns 
            else tfc.nu_cpf_cidadao
        end as "DOCUMENTO PESSOAL",
        tfci.dt_nascimento as "DATA DE NASCIMENTO",
        tfci.nu_micro_area as "MICRO-ÁREA",
        case 
            when tfci.st_responsavel_familiar = 1 then 'SIM'
            else 'NÃO'
        end as "É RESPONSÁVEL FAMILIAR",
        tdtficha.dt_registro as "ULTIMA ATUALIZAÇÃO",
        CASE 
            WHEN tfc.nu_cpf_cidadao = '0          ' then 'SEM CPF' 
            WHEN (tfc.nu_cpf_cidadao = '0          ' and tfc.nu_cns = '0              ') then 'SEM DOCUMENTO'
            else 'COM CPF'
        end as "STATUS DOCUMENTO",
        case 
            when (extract(year from justify_interval(now() - tdtficha.dt_registro))*12+extract(month from justify_interval(now() - tdtficha.dt_registro))) <= 4 then 'ATÉ 4 MESES'
            when (extract(year from justify_interval(now() - tdtficha.dt_registro))*12+extract(month from justify_interval(now() - tdtficha.dt_registro))) <= 12 then '5 A 12 MESES'
            when (extract(year from justify_interval(now() - tdtficha.dt_registro))*12+extract(month from justify_interval(now() - tdtficha.dt_registro))) <= 24 then '13 A 24 MESES'
            when (extract(year from justify_interval(now() - tdtficha.dt_registro))*12+extract(month from justify_interval(now() - tdtficha.dt_registro))) > 24 then 'MAIS DE 2 ANOS'
        end as "TEMPO SEM ATUALIZAR",
        case 
            when (extract(year from justify_interval(now() - tdtficha.dt_registro))*12+extract(month from justify_interval(now() - tdtficha.dt_registro))) = 1 then concat((extract(year from justify_interval(now() - tdtficha.dt_registro))*12+extract(month from justify_interval(now() - tdtficha.dt_registro))), ' MÊS')
            else concat((extract(year from justify_interval(now() - tdtficha.dt_registro))*12+extract(month from justify_interval(now() - tdtficha.dt_registro))), ' MESES')
        end as "MESES SEM ATUALIZAR",
        tfci.nu_micro_area as "MICRO ÁREA",
        tdp.no_profissional as "PROFISSIONAL CADASTRANTE",
        tdcprof.nu_cbo as "CBO PROFISSIONAL",
        tdcprof.no_cbo as "DESCRIÇÃO CBO",
        tdus.no_unidade_saude as "UNIDADE DE SAÚDE",
        tdus.nu_cnes as "CNES",
        tde.no_equipe as "NOME EQUIPE",
        tde.nu_ine as "INE",
        tte.sg_tipo_equipe as "TIPO DE EQUIPE",
        case 
            when tfci.st_recusa_cadastro = 1 then 'RECUSADO'
            else 'SEM RECUSA'
        end as "STATUS DE RECUSA",
		tfci.nu_cpf_responsavel,
		tfci.nu_cns_responsavel,
		case 
			when (tfci.nu_cpf_responsavel in (
			select familias.nu_cpf_responsavel	
				from familias
			) or tfci.nu_cns_responsavel in (
			select familias.nu_cns_responsavel	
				from familias
			)) then 'SIM' 
			else 'NÃO'
		end as "FAMILIA?"
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
    getBase(){
        return this.SQL_BASE
    }
}

export class SQL_COMPLETENESS_EAS{
    private SQL_BASE: string = 
    `
    SELECT
        i.Nome as "CIDADÃO",
        CASE 
            when (i.cpf is null and i.CartaoSUS = '') then 'SEM DOCUMENTO'
            when (i.Cpf is null or i.Cpf = '') then i.CartaoSUS 
            else i.Cpf
        END as "DOCUMENTO PESSOAL",
        i.DataNascimento as "DATA DE NASCIMENTO",
        i.MicroArea as "MICRO-ÁREA",
        case
            when i.EhResponsavelFamiliar = 1 then 'SIM'
            else 'NÃO'
        end as "É RESPONSÁVEL FAMILIAR",
        i.DataAlteracao as "ULTIMA ATUALIZAÇÃO",
        CASE 
            when (i.cpf is null and i.CartaoSUS = '') then 'SEM DOCUMENTO'
            when (i.Cpf is null or i.Cpf = '') then 'SEM CPF'
            else 'COM CPF'
        END as "STATUS DOCUMENTO",
        CASE 
            WHEN TIMESTAMPDIFF(MONTH, i.DataAlteracao, NOW()) <= 4 THEN 'ATÉ 4 MESES'
            WHEN TIMESTAMPDIFF(MONTH, i.DataAlteracao, NOW()) <= 12 THEN '5 A 12 MESES'
            WHEN TIMESTAMPDIFF(MONTH, i.DataAlteracao, NOW()) <= 24 THEN '13 A 24 MESES'
            ELSE 'MAIS DE 2 ANOS'
        END AS "TEMPO SEM ATUALIZAR",
        CASE 
            WHEN TIMESTAMPDIFF(MONTH, i.DataAlteracao, NOW()) = 1 THEN CONCAT(TIMESTAMPDIFF(MONTH, i.DataAlteracao, NOW()), ' MÊS')
            ELSE CONCAT(TIMESTAMPDIFF(MONTH, i.DataAlteracao, NOW()), ' MESES')
        END AS "MESES SEM ATUALIZAR",
        case 
            when i.ForaDeArea = 1 then 'FA'
            when i.MicroArea is not null then i.MicroArea
        end as "MICRO ÁREA",
        r.id as "DISTRITO",
        r.Descricao as "DISTRITO DESCRIÇÃO",
        p.Nome as "PROFISSIONAL CADASTRANTE",
        o.Codigo  as "CBO PROFISSIONAL",
        o.Descricao as "DESCRIÇÃO CBO",
        e.Nome as "UNIDADE DE SAÚDE",
        e.Cnes as "CNES",
        eq.Nome as "NOME EQUIPE",
        eq.id as "INE",
        case
            when eq.TipoEquipe = 70 then 'ESF'
            when eq.TipoEquipe = 71 then 'ESB'
            when eq.TipoEquipe = 72 then 'EMULTI'
        end as "TIPO DE EQUIPE",
        i.MotivoDaRecusa as "STATUS DE RECUSA",
        case 
            when i.responsavelCartaoSUS in (
                select familia.CartaoSusResponsavel
                from familia
                where familia.MudouSe = 0
                and familia.Deletado = 0
            ) then 'SIM'
            else 'NÃO'
        end as "FAMILIA?"
    from Individuo i 
        left join Profissional p on p.id = i.Profissional_Id 
        left join Estabelecimento e on e.Id = i.Estabelecimento_Id 
        left join Equipe eq on eq.id = i.CodigoEquipe
        left join Ocupacao o on p.Ocupacao_Id = o.Id 
        left join SituacaoDeRua sdr on sdr.Id  = i.Id
        LEFT JOIN RegionalEstabelecimento re ON re.Estabelecimento_Id = p.Estabelecimento_Id
        LEFT JOIN Regional r ON r.Id = re.Regional_Id
    where 
        i.deletado = 0
        and i.MudouSe = 0
        and i.DataDoObito is null
        AND i.DesfechoDeCadastro = 0
    `
    getBase(){
        return this.SQL_BASE
    }
}