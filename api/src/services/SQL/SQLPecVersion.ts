export class SQL_PEC_VERSION{
    private SQL_BASE = `
        select
            tb_uf.no_uf As "ESTADO",
            tb_localidade.no_localidade As "CIDADE",
            (select ds_texto 
            from tb_config_sistema tcs 
            where co_config_sistema = 'NOMEINSTALACAO' ) 
            as "NOME DA INSTALAÇÃO", 
            (Select
                To_Char(Max(tb_importacao_cnes.dt_relatorio), 'dd/mm/yyyy')
            From
                tb_importacao_cnes) As "DATA DO ULTIMO XML INSERIDO",
            (Select
                tb_config_sistema.ds_texto
            From
                tb_config_sistema
            Where
                tb_config_sistema.co_config_sistema = 'VERSAOBANCODADOS') As "VERSÃO DO PEC"
        From
            tb_importacao_cnes Inner Join
            tb_localidade On tb_importacao_cnes.co_localidade = tb_localidade.co_localidade Inner Join
            tb_uf On tb_localidade.co_uf = tb_uf.co_uf
        Group By
            tb_localidade.no_localidade,
            tb_uf.no_uf,
            tb_localidade.co_ibge
        Order By
            "CIDADE",
            "ESTADO"
    `

    getBase(){
        return this.SQL_BASE;
    }
}