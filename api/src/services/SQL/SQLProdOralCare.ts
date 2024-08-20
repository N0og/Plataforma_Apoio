export class SQL_PROD_ORAL_CARE {

    private SQL_BASE = `
        with trat_concluido as (
            select 
                tfao.co_seq_fat_atd_odnt as cod,
                tfao.co_dim_profissional_1,
                tfao.co_dim_unidade_saude_1,
                tfao.co_dim_cbo_1
            from
                tb_fat_atendimento_odonto tfao 
            where 
                tfao.st_conduta_tratamento_concluid = 1
        ),
        curativo_demora as (
            select 
                tfao.co_seq_fat_atd_odnt as cod,
                tfao.co_dim_profissional_1,
                tfao.co_dim_unidade_saude_1,
                tfao.co_dim_cbo_1
            from
                tb_fat_atendimento_odonto tfao 
            where 
                (tfao.ds_filtro_procedimentos like '%0307020029%' or tfao.ds_filtro_procedimentos like '%ABPO008%')
        ),
        fluor as (
            select 
                tfao.co_seq_fat_atd_odnt as cod,
                tfao.co_dim_profissional_1,
                tfao.co_dim_unidade_saude_1,
                tfao.co_dim_cbo_1
            from
                tb_fat_atendimento_odonto tfao 
            where 
                (tfao.ds_filtro_procedimentos like '%0101020074%' or tfao.ds_filtro_procedimentos like '%ABPO005%')
        ),
        orientacao as (
            select 
                tfao.co_seq_fat_atd_odnt as cod,
                tfao.co_dim_profissional_1,
                tfao.co_dim_unidade_saude_1,
                tfao.co_dim_cbo_1
            from
                tb_fat_atendimento_odonto tfao 
            where 
                (tfao.ds_filtro_procedimentos like '%0101020104%' or tfao.ds_filtro_procedimentos like '%ABPO015%')
        ),
        profilaxia as (
            select 
                tfao.co_seq_fat_atd_odnt as cod,
                tfao.co_dim_profissional_1,
                tfao.co_dim_unidade_saude_1,
                tfao.co_dim_cbo_1
            from
                tb_fat_atendimento_odonto tfao 
            where 
                (tfao.ds_filtro_procedimentos like '%0307030040%' or tfao.ds_filtro_procedimentos like '%ABPO016%')
        ),
        exodontia as (
            select 
                tfao.co_seq_fat_atd_odnt as cod,
                tfao.co_dim_profissional_1,
                tfao.co_dim_unidade_saude_1,
                tfao.co_dim_cbo_1
            from
                tb_fat_atendimento_odonto tfao 
            where 
                (tfao.ds_filtro_procedimentos like '%0414020120%' or tfao.ds_filtro_procedimentos like '%ABPO011%' or tfao.ds_filtro_procedimentos like '%0414020138%' or tfao.ds_filtro_procedimentos like '%ABPO012%')
        ),
        tra as (
            select 
                tfao.co_seq_fat_atd_odnt as cod,
                tfao.co_dim_profissional_1,
                tfao.co_dim_unidade_saude_1,
                tfao.co_dim_cbo_1
            from
                tb_fat_atendimento_odonto tfao 
            where 
                (tfao.ds_filtro_procedimentos like '%0307010074%')
        )
        select 
                tdus.nu_cnes as "CNES",
                tdus.no_unidade_saude as "UNIDADE DE SAÚDE",
                tdc.nu_cbo as "CBO",
                tdc.no_cbo as "DESCRIÇÃO DO CBO",
                tdp.no_profissional as "PROFISSIONAL",
                tdp.nu_cns as "CNS"           
    `

    private SQL_FROM = `
        from 
            tb_fat_atendimento_odonto tfao
        left join tb_dim_unidade_saude tdus 
            on tdus.co_seq_dim_unidade_saude = tfao.co_dim_unidade_saude_1 
        left join tb_dim_profissional tdp 
            on tdp.co_seq_dim_profissional = tfao.co_dim_profissional_1 
        left join tb_dim_cbo tdc 
            on tdc.co_seq_dim_cbo = tfao.co_dim_cbo_1 
        left join tb_dim_tempo tdt
            on tdt.co_seq_dim_tempo = tfao.co_dim_tempo
    `

    private SQL_WHERE = `
        where 
            1=1
    `

    private SQL_END = `
        group by
            tdus.nu_cnes,
            tdus.no_unidade_saude,
            tdc.nu_cbo,
            tdc.no_cbo,
            tdp.no_profissional,
            tdp.nu_cns
        order by
            tdus.no_unidade_saude asc
    `

    private SQL_ESCOVACAO_SUPER = {
        select: `
        ,
        (select 
                count(*)
            from tb_fat_atividade_coletiva tfac 
            left join tb_dim_unidade_saude tdus2 on tdus2.co_seq_dim_unidade_saude = tfac.co_dim_unidade_saude 
            left join tb_dim_profissional tdp2 on tdp2.co_seq_dim_profissional = tfac.co_dim_profissional 
            where 
                tfac.ds_filtro_pratica_em_saude like '%|9|%'
                and tdp2.no_profissional = tdp.no_profissional 
                and tdus2.nu_cnes = tdus.nu_cnes
        ) as "ESCOVAÇÃO SUPERVISIONADA"
    `,
        from: ''
    }

    private SQL_TRATAMENTO_CONCLUIDO = {
        select: `, count(tc.cod) as "QTD. TRATAMENTO CONCLUÍDOO"`,
        from: `
            left join trat_concluido tc
                on tc.cod = tfao.co_seq_fat_atd_odnt and tc.co_dim_profissional_1 = tfao.co_dim_profissional_1 and tc.co_dim_cbo_1 = tfao.co_dim_cbo_1 and tc.co_dim_unidade_saude_1 = tfao.co_dim_unidade_saude_1
         `
    }

    private SQL_CURATIVO_DEMORA = {
        select: `, count(cd.cod) as "QTD. CURATIVO DE DEMORA"`,
        from: `
            left join curativo_demora cd
                on cd.cod = tfao.co_seq_fat_atd_odnt and cd.co_dim_profissional_1 = tfao.co_dim_profissional_1 and cd.co_dim_cbo_1 = tfao.co_dim_cbo_1 and cd.co_dim_unidade_saude_1 = tfao.co_dim_unidade_saude_1  
         `
    }

    private SQL_APLICACAO_FLUOR = {
        select: `, count(f.cod) as "QTD. APLICAÇÃO DE FLUOR"`,
        from: `
            left join fluor f
                on f.cod = tfao.co_seq_fat_atd_odnt and cd.co_dim_profissional_1 = tfao.co_dim_profissional_1 and f.co_dim_cbo_1 = tfao.co_dim_cbo_1 and f.co_dim_unidade_saude_1 = tfao.co_dim_unidade_saude_1 
         `
    }

    private SQL_ORIENTACAO_SAUDE = {
        select: `, count(ori.cod) as "QTD. ORIENTAÇÃO DE HIGIENE BUCAL"`,
        from: `
            left join orientacao ori
                on ori.cod = tfao.co_seq_fat_atd_odnt and ori.co_dim_profissional_1 = tfao.co_dim_profissional_1 and ori.co_dim_cbo_1 = tfao.co_dim_cbo_1 and ori.co_dim_unidade_saude_1 = tfao.co_dim_unidade_saude_1 
         `
    }

    private SQL_PROFILAXIA = {
        select: `, count(p.cod) as "QTD. PROFILAXIA"`,
        from: `
            left join profilaxia p
                on p.cod = tfao.co_seq_fat_atd_odnt and p.co_dim_profissional_1 = tfao.co_dim_profissional_1 and p.co_dim_cbo_1 = tfao.co_dim_cbo_1 and p.co_dim_unidade_saude_1 = tfao.co_dim_unidade_saude_1 
         `
    }

    private SQL_EXODONTIA = {
        select: `, count(exo.cod) as "QTD. EXODONTIA"`,
        from: `
            left join exodontia exo
                on exo.cod = tfao.co_seq_fat_atd_odnt and exo.co_dim_profissional_1 = tfao.co_dim_profissional_1 and exo.co_dim_cbo_1 = tfao.co_dim_cbo_1 and exo.co_dim_unidade_saude_1 = tfao.co_dim_unidade_saude_1 
         `
    }

    private SQL_TRA = {
        select: `, count(tra.cod) as "QTD. TRA/ART"`,
        from: `
            left join tra
                on tra.cod = tfao.co_seq_fat_atd_odnt and tra.co_dim_profissional_1 = tfao.co_dim_profissional_1 and tra.co_dim_cbo_1 = tfao.co_dim_cbo_1 and tra.co_dim_unidade_saude_1 = tfao.co_dim_unidade_saude_1 
         `
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

    getEscovSuper() {
        return this.SQL_ESCOVACAO_SUPER
    }

    getTratConcluido() {
        return this.SQL_TRATAMENTO_CONCLUIDO
    }

    getCurativoDem() {
        return this.SQL_CURATIVO_DEMORA
    }

    getFluor() {
        return this.SQL_APLICACAO_FLUOR
    }

    getOrientacao() {
        return this.SQL_ORIENTACAO_SAUDE
    }

    getProfilaxia() {
        return this.SQL_PROFILAXIA
    }

    getExodontia() {
        return this.SQL_EXODONTIA
    }

    getTra() {
        return this.SQL_TRA
    }
}