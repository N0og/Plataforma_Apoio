export class SQL_NOT_FINISHED {

    private SQL_BASE: string = `
        Select
            tb_localidade.no_localidade As "CIDADE",
            tb_uf.sg_uf As "UF",
            tb_unidade_saude.no_unidade_saude As "ESTABELECIMENTO",
            tb_unidade_saude.nu_cnes As "CNES",
            tb_equipe.no_equipe As "EQUIPE",
            tb_equipe.nu_ine As "INE",
            tb_prof.no_profissional As "PROFISSIONAL",
            tb_status_atend.no_identificador As "SITUAÇÃO",
            tb_atend.dt_inicio As "DATA CADASTRO",
            tb_cidadao.no_cidadao as "CIDADAO",
            tb_cidadao.nu_cpf AS "CPF",
            tb_cidadao.nu_cns AS "CNS",
            CASE
                WHEN tb_atend.co_agendado IS NULL THEN 'NÃO'
                WHEN tb_atend.co_agendado  IS NOT NULL THEN 'SIM'
            END AS "DA AGENDA",
            CASE
            WHEN tb_atend.st_registro_tardio = '1' THEN
                'SIM'
            WHEN tb_atend.st_registro_tardio = '0' THEN
                'NÃO'
            END AS "DO TARDIO"
    `

    private SQL_FROM: string = `
        From
            tb_atend Left Join
            tb_atend_prof On tb_atend.co_atend_prof = tb_atend_prof.co_seq_atend_prof Left Join
            tb_status_atend On tb_atend.st_atend = tb_status_atend.co_status_atend Left Join
            tb_local_atend On tb_atend.tp_local_atend = tb_local_atend.co_local_atend Left Join
            tb_equipe On tb_atend.co_equipe = tb_equipe.co_seq_equipe Left Join
            tb_unidade_saude On tb_atend.co_unidade_saude = tb_unidade_saude.co_seq_unidade_saude Left Join
            tb_localidade On tb_unidade_saude.co_localidade_endereco = tb_localidade.co_localidade Left Join
            tb_uf On tb_localidade.co_uf = tb_uf.co_uf Left Join
            tb_lotacao On tb_atend_prof.co_lotacao = tb_lotacao.co_ator_papel Left Join
            tb_prof On tb_lotacao.co_prof = tb_prof.co_seq_prof Left Join
            tb_tipo_atend On tb_atend_prof.tp_atend = tb_tipo_atend.co_tipo_atend Left Join
            tb_prontuario On tb_atend.co_prontuario = tb_prontuario.co_seq_prontuario Left Join
            tb_cidadao On tb_prontuario.co_cidadao = tb_cidadao.co_seq_cidadao left Join
            tb_agendado On tb_atend.co_agendado = tb_agendado.co_seq_agendado
    `

    private SQL_WHERE: string = `
        Where
            (tb_status_atend.co_status_atend = 1 Or tb_status_atend.co_status_atend = 3 or tb_status_atend.co_status_atend = 2)
    `

    getBase(){
        return this.SQL_BASE
    }

    getFrom(){
        return this.SQL_FROM
    }

    getWhere(){
        return this.SQL_WHERE
    }
}