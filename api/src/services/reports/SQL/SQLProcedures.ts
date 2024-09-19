export class SQL_PROCEDURES {

    private SQL_BASE = `
        with citologico as (
            select
                tfpa.co_seq_fat_proced_atend as cod,
                tfpa.co_dim_profissional,
                tfpa.co_dim_unidade_saude,
                tfpa.co_dim_cbo
            from 
                tb_fat_proced_atend tfpa 
            where 
                ds_filtro_procedimento like '%ABPG010%' 
        ), pre_natal_parceiro as (
            select
                tfpa.co_seq_fat_proced_atend as cod,
                tfpa.co_dim_profissional,
                tfpa.co_dim_unidade_saude,
                tfpa.co_dim_cbo
            from 
                tb_fat_proced_atend tfpa 
            where 
                ds_filtro_procedimento like '%0301010234%' 
        ), visita_domicilar as (
            select
                tfpa.co_seq_fat_proced_atend as cod,
                tfpa.co_dim_profissional,
                tfpa.co_dim_unidade_saude,
                tfpa.co_dim_cbo
            from 
                tb_fat_proced_atend tfpa 
            where 
                (ds_filtro_procedimento like '%0301050147%'
                or ds_filtro_procedimento like '%0101030029%'
                or ds_filtro_procedimento like '%0101030010%')
        ), rastreamento as (
            select
                tfpa.co_seq_fat_proced_atend as cod,
                tfpa.co_dim_profissional,
                tfpa.co_dim_unidade_saude,
                tfpa.co_dim_cbo
            from 
                tb_fat_proced_atend tfpa 
            where 
                ds_filtro_procedimento like '%0203010086%' 
        ), diu as (
            select
                tfpa.co_seq_fat_proced_atend as cod,
                tfpa.co_dim_profissional,
                tfpa.co_dim_unidade_saude,
                tfpa.co_dim_cbo
            from 
                tb_fat_proced_atend tfpa 
            where 
                ds_filtro_procedimento like '%0301040141%'
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
            tb_fat_proced_atend tfpa 
        left join tb_dim_unidade_saude tdus
            on tdus.co_seq_dim_unidade_saude = tfpa.co_dim_unidade_saude 
        left join tb_dim_profissional tdp 
            on tdp.co_seq_dim_profissional = tfpa.co_dim_profissional 
        left join tb_dim_cbo tdc 
            on tdc.co_seq_dim_cbo = tfpa.co_dim_cbo 
        left join tb_dim_tempo tdt
            on tdt.co_seq_dim_tempo = tfpa.co_dim_tempo
    `

    private SQL_WHERE = `
        where 
            1=1
    `

    private SQL_DYNAMIC_WHERE = `
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

    private SQL_RASTREAMENTO_MICRO_FLORA() {
        return {
            select: `
                ,
                (select
                    count(*)
                from 
                    tb_fat_atendimento_individual tfai
                    left join tb_dim_unidade_saude tdus2 on tdus2.co_seq_dim_unidade_saude = tfai.co_dim_unidade_saude_1
                    left join tb_dim_profissional tdp2 on tdp2.co_seq_dim_profissional = tfai.co_dim_profissional_1
                    left join tb_dim_tempo tdt on tdt.co_seq_dim_tempo = tfai.co_dim_tempo
                where 
                    ds_filtro_proced_avaliados like '%0203010086%'
                    and tdp2.no_profissional = tdp.no_profissional 
                    and tdus2.nu_cnes = tdus.nu_cnes
                    ${this.SQL_DYNAMIC_WHERE}
                ) as "RASTREAMENTO MICRO FLORA"
            `,
            from: ''
        }
    }

    private SQL_RASTREAMENTO_MAMA() {
        return {
            select: `
                ,
                (select
                    count(*)
                from 
                    tb_fat_atendimento_individual tfai
                    left join tb_dim_unidade_saude tdus2 on tdus2.co_seq_dim_unidade_saude = tfai.co_dim_unidade_saude_1
                    left join tb_dim_profissional tdp2 on tdp2.co_seq_dim_profissional = tfai.co_dim_profissional_1
                    left join tb_dim_tempo tdt on tdt.co_seq_dim_tempo = tfai.co_dim_tempo
                where 
                    ds_filtro_cids like '%Z123%'
                    and tdp2.no_profissional = tdp.no_profissional 
                    and tdus2.nu_cnes = tdus.nu_cnes
                    ${this.SQL_DYNAMIC_WHERE}
                ) as "RASTREAMENTO CANCE DE MAMA"
            `,
            from: ''
        }
    }

    private SQL_CITOLOGICO() {
        return {
            select: `, count(cit.cod) as "QTD. CIOTPATOLGICO"`,
            from: `
                left join citologico cit
	                on cit.cod = tfpa.co_seq_fat_proced_atend and cit.co_dim_unidade_saude = tfpa.co_dim_unidade_saude  and cit.co_dim_cbo = tfpa.co_dim_cbo and cit.co_dim_profissional = tfpa.co_dim_profissional 
            `
        }
    }

    private SQL_DIU() {
        return {
            select: `, count(diu.cod) as "QTD. INSERÇÃO DE DIU"`,
            from: `
                left join diu
	                on diu.cod = tfpa.co_seq_fat_proced_atend and diu.co_dim_unidade_saude = tfpa.co_dim_unidade_saude  and diu.co_dim_cbo = tfpa.co_dim_cbo and diu.co_dim_profissional = tfpa.co_dim_profissional 
            `
        }
    }

    private SQL_PRE_NATAL() {
        return {
            select: `, count(pnp.cod) as "QTD. PRÉ NATAL PARCEIRO"`,
            from: `
                left join pre_natal_parceiro pnp
	                on pnp.cod = tfpa.co_seq_fat_proced_atend and pnp.co_dim_unidade_saude = tfpa.co_dim_unidade_saude  and pnp.co_dim_cbo = tfpa.co_dim_cbo and pnp.co_dim_profissional = tfpa.co_dim_profissional 
            `
        }
    }

    private SQL_VISITA_DOMICILAR() {
        return {
            select: `, count(vd.cod) as "QTD. VISITA DOMICILIAR"`,
            from: `
                left join visita_domicilar vd
	                on vd.cod = tfpa.co_seq_fat_proced_atend and vd.co_dim_unidade_saude = tfpa.co_dim_unidade_saude  and vd.co_dim_cbo = tfpa.co_dim_cbo and vd.co_dim_profissional = tfpa.co_dim_profissional 
            `
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

    getRastreamentoMicroFlora() {
        return this.SQL_RASTREAMENTO_MICRO_FLORA()
    }

    getRastreamentoMama() {
        return this.SQL_RASTREAMENTO_MAMA()
    }

    getCitologico() {
        return this.SQL_CITOLOGICO()
    }

    getPreNatal() {
        return this.SQL_PRE_NATAL()
    }

    getVisitaDomiciliar() {
        return this.SQL_VISITA_DOMICILAR()
    }

    getDiu(){
        return this.SQL_DIU()
    }

    setDynamicWhere(clause: string) {
        this.SQL_DYNAMIC_WHERE += clause
    }
}