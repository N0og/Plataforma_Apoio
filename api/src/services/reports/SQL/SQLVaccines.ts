export class SQL_VACCINES{

    private SQL_BASE: string = 
    `
    Select
        case 
            when tfcid.no_cidadao is null then 'DOC. UTILIZADO NA FICHA CDS NÃO É O MESMO QUE ESTÁ NO PEC'
            else Upper (tfcid.no_cidadao)
        end as "NOME",
        tfvac.nu_cpf_cidadao As "CPF",
        tfvac.nu_cns As "CNS",
        tfvac.dt_nascimento As "DATA DE NASCIMENTO",
        Case
            When Age(Current_Date, tfvac.dt_nascimento) < Interval '1 year'
            Then 'MENOS DE 1 ANO'
            When Age(Current_Date, tfvac.dt_nascimento) < Interval '2 years'
            Then '01 ANO'
            When Age(Current_Date, tfvac.dt_nascimento) < Interval '3 years'
            Then '02 ANOS'
            When Age(Current_Date, tfvac.dt_nascimento) < Interval '4 years'
            Then '03 ANOS'
            When Age(Current_Date, tfvac.dt_nascimento) < Interval '5 years'
            Then '04 ANOS'
            When Age(Current_Date, tfvac.dt_nascimento) < Interval '10 years'
            Then '05 A 09 ANOS'
            When Age(Current_Date, tfvac.dt_nascimento) < Interval '15 years'
            Then '10 A 14 ANOS'
            When Age(Current_Date, tfvac.dt_nascimento) < Interval '20 years'
            Then '15 A 19 ANOS'
            When Age(Current_Date, tfvac.dt_nascimento) < Interval '25 years'
            Then '20 A 24 ANOS'
            When Age(Current_Date, tfvac.dt_nascimento) < Interval '30 years'
            Then '25 A 29 ANOS'
            When Age(Current_Date, tfvac.dt_nascimento) < Interval '35 years'
            Then '30 A 34 ANOS'
            When Age(Current_Date, tfvac.dt_nascimento) < Interval '40 years'
            Then '35 A 39 ANOS'
            When Age(Current_Date, tfvac.dt_nascimento) < Interval '45 years'
            Then '40 A 44 ANOS'
            When Age(Current_Date, tfvac.dt_nascimento) < Interval '50 years'
            Then '45 A 49 ANOS'
            When Age(Current_Date, tfvac.dt_nascimento) < Interval '55 years'
            Then '50 A 54 ANOS'
            When Age(Current_Date, tfvac.dt_nascimento) < Interval '60 years'
            Then '55 A 59 ANOS'
            When Age(Current_Date, tfvac.dt_nascimento) < Interval '65 years'
            Then '60 A 64 ANOS'
            When Age(Current_Date, tfvac.dt_nascimento) < Interval '70 years'
            Then '65 A 69 ANOS'
            When Age(Current_Date, tfvac.dt_nascimento) < Interval '75 years'
            Then '70 A 74 ANOS'
            When Age(Current_Date, tfvac.dt_nascimento) < Interval '80 years'
            Then '75 A 79 ANOS'
            Else '80 ANOS OU MAIS'
        End As "FAIXA ETARIA NA EXTRAÇÃO",
        Case
            When tfvac.dt_nascimento Is Not Null
            Then Concat(Extract(Year From Age(Current_Date, tfvac.dt_nascimento)), ' Anos ', Extract(Month From
                Age(Current_Date, tfvac.dt_nascimento)), ' Meses ', Extract(Day From Age(Current_Date,
                tfvac.dt_nascimento)), ' Dias')
        End As "IDADE NA EXTRAÇÃO",
        Upper(tdi.no_imunobiologico) As "IMUNOBIOLÓGICO",
		Upper(tfvv.no_lote) as "LOTE",
        Upper(tfvv.no_fabricante) as "FABRICANTE",
        Upper(tddi.no_dose_imunobiologico) As "DOSE",
        case
            when tdev.no_estrategia_vacinacao is null then 'TRANSCRIÇÃO'
            else tdev.no_estrategia_vacinacao 
        end as "ESTRATEGIA",
        tdt.dt_registro As "DATA DO REGISTRO",
        Case
            When tfvac.dt_nascimento Is Not Null
            Then Concat(Extract(Year From Age(tdt.dt_registro, tfvac.dt_nascimento)), ' Anos ', Extract(Month From
                Age(tdt.dt_registro, tfvac.dt_nascimento)), ' Meses ', Extract(Day From Age(tdt.dt_registro,
                tfvac.dt_nascimento)), ' Dias')
        End As "IDADE NA APLICACAO",
        Upper(tdfe.ds_faixa_etaria) As "FAIXA ETARIA POR DATA DE APLICACAO",
        Case
            When tfvv.st_registro_anterior = 1
            Then 'TRANSCRIÇÃO'
            When tfvv.st_registro_anterior = 0
            Then 'APLICAÇÃO'
            Else 'REGISTRO NÃO TIPIFICADO.'
        End As "TIPO DE REGISTRO",
        Case
            When tdtf.nu_identificador = '9'
            Then 'PEC'
            When tdtf.nu_identificador = '14'
            Then 'CDS'
            Else 'OUTRA FICHA'
        End As "TIPO DE FICHA",
        Upper(tdla.ds_local_atendimento) As "LOCAL DE ATENDIMENTO",
        Upper(tdp.no_profissional) As "PROFISSIONAL",
        tdp.nu_cns As "CNS PROFISSIONAL",
        Upper(tdus.no_unidade_saude) As "UNIDADE",
        tdus.nu_cnes As "CNES",
        tde.nu_ine As "INE",
        tde.no_equipe As "NOME EQUIPE",
        Upper(tdm.no_municipio) As "CIDADE",
        Upper(tduf.no_uf) As "UF"
    `

    private SQL_FROM: string = 
    `
    From
        tb_fat_vacinacao tfvac 
        Left join tb_fat_cidadao_pec tfcid On tfvac.co_fat_cidadao_pec = tfcid.co_seq_fat_cidadao_pec Left Join
        tb_fat_vacinacao_vacina tfvv On tfvv.co_fat_vacinacao = tfvac.co_seq_fat_vacinacao Left Join
        tb_dim_tempo tdt On tfvv.co_dim_tempo_vacina_aplicada = tdt.co_seq_dim_tempo Left Join
        tb_dim_equipe tde On tfvv.co_dim_equipe = tde.co_seq_dim_equipe Left Join
        tb_dim_profissional tdp On tfvv.co_dim_profissional = tdp.co_seq_dim_profissional Left Join
        tb_dim_imunobiologico tdi On tfvv.co_dim_imunobiologico = tdi.co_seq_dim_imunobiologico Left Join
        tb_dim_dose_imunobiologico tddi On tfvv.co_dim_dose_imunobiologico = tddi.co_seq_dim_dose_imunobiologico Left Join
        tb_dim_tipo_ficha tdtf On tfvv.co_dim_tipo_ficha = tdtf.co_seq_dim_tipo_ficha Left Join
        tb_dim_unidade_saude tdus On tfvv.co_dim_unidade_saude = tdus.co_seq_dim_unidade_saude Left Join
        tb_dim_local_atendimento tdla On tfvac.co_dim_local_atendimento = tdla.co_seq_dim_local_atendimento Left Join
        tb_dim_municipio tdm On tfvv.co_dim_municipio = tdm.co_seq_dim_municipio Left Join
        tb_dim_uf tduf On tdm.co_dim_uf = tduf.co_seq_dim_uf Left Join
        tb_dim_faixa_etaria tdfe On tfvac.co_dim_faixa_etaria = tdfe.co_seq_dim_faixa_etaria 
        left join tb_cidadao tbc On tbc.co_seq_cidadao = tfcid.co_cidadao
        left join tb_dim_estrategia_vacinacao tdev on tfvv.co_dim_estrategia_vacinacao = tdev.co_seq_dim_estrategia_vacnacao 
    where
        1=1
    `

    private SQL_END:string = 
    `
        Order by
            tdt.dt_registro desc,
            "NOME"
    `


    getBase(){
        return this.SQL_BASE
    }

    getFrom(){
        return this.SQL_FROM
    }

    getEnd(){
        return this.SQL_END
    }
}