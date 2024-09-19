export class SQL_GUARANTEED_ACCESS {
    private SQL_BASE = `
        SELECT 
            tc.no_cidadao as "CIDADÃO",
            tc.nu_cpf as "CPF", 
            tc.nu_cns as "CARTÃO SUS",
            tc.dt_nascimento as "DATA DE NASCIMENTO",
            tc.no_mae as "NOME DA MÃE",
            coalesce(tc.nu_telefone_celular, tc.nu_telefone_contato, tc.nu_telefone_residencial) as "CONTATO",
            tle.dt_entrada as "DATA DE ENTRADA",
            tle.ds_motivo_espera as "MOTIVO DA ESPERA",
            tleta.no_tipo_atend as "TIPO DE ATENDIMENTO",
            case
                when tle.co_motivo_saida is null then 'SIM'
                else 'NÃO'
            end as "ATIVO",
            case 
                when tle.co_motivo_saida is null then 'AGUARDANDO NA LISTA'
                when tlems.no_identificador = 'NAO_RESPONDEU_TENTATIVAS_CONTATO' 
                    then concat('REMOVIDO POR: ', UPPER(tlems.no_motivo_saida), ' | TENTATIVAS: ', tle.nu_tentativas_contato)
                else concat('REMOVIDO POR: ', UPPER(tlems.no_motivo_saida))
            end as "STATUS",
            tus.nu_cnes as "CNES",
            tus.no_unidade_saude "UNIDADE DE SAÚDE",
            te.nu_ine as "INE",
            te.no_equipe as "EQUIPE",
            concat('ÁREA ',te.ds_area) as "ÁREA"
    `

    private SQL_FROM = `
        FROM tb_lista_espera tle 
        left join tb_unidade_saude tus 
            on tus.co_seq_unidade_saude = tle.co_unidade_saude 
        left join tb_equipe te 
            on te.co_seq_equipe = tle.co_equipe 
        left join tb_cidadao tc
            on tc.co_seq_cidadao = tle.co_cidadao 
        left join tb_lista_espera_tipo_atend tleta 
            on tleta.co_lista_espera_tipo_atend = tle.co_lista_espera_tipo_atend 
        left join tb_lista_espera_motivo_saida tlems 
            on tlems.co_lista_espera_motivo_saida = tle.co_motivo_saida     
    `

    private SQL_END = `
        ORDER BY tc.no_cidadao ASC
    `

    private SQL_WHERE = `
        WHERE
            1=1
    `

    getBase() {return this.SQL_BASE}

    getFrom() {return this.SQL_FROM}

    getEnd() { return this.SQL_END}

    getWhere() { return this.SQL_WHERE}


}