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
        ), hiv_gest_pai as (
            select
                tfpa.co_seq_fat_proced_atend as cod,
                tfpa.co_dim_profissional,
                tfpa.co_dim_unidade_saude,
                tfpa.co_dim_cbo
            from 
                tb_fat_proced_atend tfpa 
            where 
                ds_filtro_procedimento like '%0214010040%'
        ), hiv_teste_rapido as (
            select
                tfpa.co_seq_fat_proced_atend as cod,
                tfpa.co_dim_profissional,
                tfpa.co_dim_unidade_saude,
                tfpa.co_dim_cbo
            from 
                tb_fat_proced_atend tfpa 
            where 
                ds_filtro_procedimento like '%0214010058%'
        ), vdrl_gest as (
            select
                tfpa.co_seq_fat_proced_atend as cod,
                tfpa.co_dim_profissional,
                tfpa.co_dim_unidade_saude,
                tfpa.co_dim_cbo
            from 
                tb_fat_proced_atend tfpa 
            where 
                ds_filtro_procedimento like '%0202031179%'
        ), sifilis_gest_pai as (
            select
                tfpa.co_seq_fat_proced_atend as cod,
                tfpa.co_dim_profissional,
                tfpa.co_dim_unidade_saude,
                tfpa.co_dim_cbo
            from 
                tb_fat_proced_atend tfpa 
            where 
                ds_filtro_procedimento like '%0214010082%'
        ), hepatiteB as (
            select
                tfpa.co_seq_fat_proced_atend as cod,
                tfpa.co_dim_profissional,
                tfpa.co_dim_unidade_saude,
                tfpa.co_dim_cbo
            from 
                tb_fat_proced_atend tfpa 
            where 
                ds_filtro_procedimento like '%0214010104%'
        ), hepatiteC as (
            select
                tfpa.co_seq_fat_proced_atend as cod,
                tfpa.co_dim_profissional,
                tfpa.co_dim_unidade_saude,
                tfpa.co_dim_cbo
            from 
                tb_fat_proced_atend tfpa 
            where 
                ds_filtro_procedimento like '%0214010090%'
        ), sifilis as (
            select
                tfpa.co_seq_fat_proced_atend as cod,
                tfpa.co_dim_profissional,
                tfpa.co_dim_unidade_saude,
                tfpa.co_dim_cbo
            from 
                tb_fat_proced_atend tfpa 
            where 
                ds_filtro_procedimento like '%0214010074%'
        ), sars_cov2 as (
            select
                tfpa.co_seq_fat_proced_atend as cod,
                tfpa.co_dim_profissional,
                tfpa.co_dim_unidade_saude,
                tfpa.co_dim_cbo
            from 
                tb_fat_proced_atend tfpa 
            where 
                ds_filtro_procedimento like '%021401016-3%'
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

    private SQL_HIV_GEST_PAI() {
        return {
            select: `, count(hiv_gest_pai.cod) as "QTD. TESTE RÁPIDO HIV GEST. PAI."`,
            from: `
                left join hiv_gest_pai
	                on hiv_gest_pai.cod = tfpa.co_seq_fat_proced_atend and hiv_gest_pai.co_dim_unidade_saude = tfpa.co_dim_unidade_saude  and hiv_gest_pai.co_dim_cbo = tfpa.co_dim_cbo and hiv_gest_pai.co_dim_profissional = tfpa.co_dim_profissional 
            `
        }
    }

    private SQL_HIV_TESTE_RAPIDO() {
        return {
            select: `, count(hiv_teste_rapido.cod) as "QTD. TESTE RÁPIDO HIV"`,
            from: `
                left join hiv_teste_rapido
	                on hiv_teste_rapido.cod = tfpa.co_seq_fat_proced_atend and hiv_teste_rapido.co_dim_unidade_saude = tfpa.co_dim_unidade_saude  and hiv_teste_rapido.co_dim_cbo = tfpa.co_dim_cbo and hiv_teste_rapido.co_dim_profissional = tfpa.co_dim_profissional 
            `
        }
    }

    private SQL_VDRL_GEST() {
        return {
            select: `, count(vdrl_gest.cod) as "QTD. VDRL P/ DETECÇÃO DE SÍFILIS"`,
            from: `
                left join vdrl_gest
	                on vdrl_gest.cod = tfpa.co_seq_fat_proced_atend and vdrl_gest.co_dim_unidade_saude = tfpa.co_dim_unidade_saude  and vdrl_gest.co_dim_cbo = tfpa.co_dim_cbo and vdrl_gest.co_dim_profissional = tfpa.co_dim_profissional 
            `
        }
    }

    private SQL_SIFILIS_GEST_PAI() {
        return {
            select: `, count(sifilis_gest_pai.cod) as "QTD. TESTE RÁPIDO SÍFILIS GEST. PAI."`,
            from: `
                left join sifilis_gest_pai
	                on sifilis_gest_pai.cod = tfpa.co_seq_fat_proced_atend and sifilis_gest_pai.co_dim_unidade_saude = tfpa.co_dim_unidade_saude  and sifilis_gest_pai.co_dim_cbo = tfpa.co_dim_cbo and sifilis_gest_pai.co_dim_profissional = tfpa.co_dim_profissional 
            `
        }
    }

    private SQL_HEPATITEB() {
        return {
            select: `, count(hepatiteB.cod) as "QTD. TESTE RÁPIDO HEPATITE B."`,
            from: `
                left join hepatiteB
	                on hepatiteB.cod = tfpa.co_seq_fat_proced_atend and hepatiteB.co_dim_unidade_saude = tfpa.co_dim_unidade_saude  and hepatiteB.co_dim_cbo = tfpa.co_dim_cbo and hepatiteB.co_dim_profissional = tfpa.co_dim_profissional 
            `
        }
    }

    private SQL_HEPATITEC() {
        return {
            select: `, count(hepatiteC.cod) as "QTD. TESTE RÁPIDO HEPATITE C."`,
            from: `
                left join hepatiteC
	                on hepatiteC.cod = tfpa.co_seq_fat_proced_atend and hepatiteC.co_dim_unidade_saude = tfpa.co_dim_unidade_saude  and hepatiteC.co_dim_cbo = tfpa.co_dim_cbo and hepatiteC.co_dim_profissional = tfpa.co_dim_profissional 
            `
        }
    }

    private SQL_SIFILIS() {
        return {
            select: `, count(sifilis.cod) as "QTD. TESTE RÁPIDO SÍFILIS."`,
            from: `
                left join sifilis
	                on sifilis.cod = tfpa.co_seq_fat_proced_atend and sifilis.co_dim_unidade_saude = tfpa.co_dim_unidade_saude  and sifilis.co_dim_cbo = tfpa.co_dim_cbo and sifilis.co_dim_profissional = tfpa.co_dim_profissional 
            `
        }
    }

    private SQL_SARS_COV_2() {
        return {
            select: `, count(sars_cov2.cod) as "QTD. TESTE RÁPIDO SARS-COV-2."`,
            from: `
                left join sars_cov2
	                on sars_cov2.cod = tfpa.co_seq_fat_proced_atend and sars_cov2.co_dim_unidade_saude = tfpa.co_dim_unidade_saude  and sars_cov2.co_dim_cbo = tfpa.co_dim_cbo and sars_cov2.co_dim_profissional = tfpa.co_dim_profissional 
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

    getHIVGP(){
        return this.SQL_HIV_GEST_PAI()
    }

    getHIVTR(){
        return this.SQL_HIV_TESTE_RAPIDO()
    }

    getVDRL(){
        return this.SQL_VDRL_GEST()
    }

    getSifilisGest(){
        return this.SQL_SIFILIS_GEST_PAI()
    }

    getHepatiteB(){
        return this.SQL_HEPATITEB()
    }

    getHepatiteC(){
        return this.SQL_HEPATITEC()
    }

    getSifilis(){
        return this.SQL_SIFILIS()
    }

    getSarsCov(){
        return this.SQL_SARS_COV_2()
    }

    setDynamicWhere(clause: string) {
        this.SQL_DYNAMIC_WHERE += clause
    }
}