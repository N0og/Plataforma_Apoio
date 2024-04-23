import { databases } from "../api"
import DynamicParameters from "../functions/DynamicParameters"
import { ICBO, IFiltro_CBO, IProdutividadeUBS } from "../interfaces/IProdutividadeUBS"
import 'pg-format'
import { queryConvert } from "../functions/pgPlaceHolders"

export default class ProdutividadeUBS_Consolidado {
    async execute(filtros: IProdutividadeUBS) {
        let query_base = `
        Select Distinct 
            UPPER(unidade.no_unidade_saude) As "ESTABELECIMENTO",
            tb_unidade_saude.nu_cnes As "CNES",
            equipe.nu_ine as "INE",
            equipe.no_equipe as "NOME EQUIPE"
        `

        const parametros_dinamicos = new DynamicParameters()
        let query_filtros_dinamica = ""
        let query_dinamica = ""
        let filtro_cbo: { [key: string]: IFiltro_CBO[] } = {}

        if (filtros.data_inicial != null && filtros.data_final != null) {
            query_filtros_dinamica += `
                and tdt.dt_registro between $data_inicio and $data_final
            `
            parametros_dinamicos.Add('data_inicio', filtros.data_inicial);
            parametros_dinamicos.Add('data_final', filtros.data_final);
        }

        if (!filtros.cbo || filtros.cbo == null) {
            filtro_cbo = await this.getCbos();
        }
        else {
            filtro_cbo = filtros.cbo
        }
        Object.keys(filtro_cbo).forEach(tipo => {
            if (tipo !== "ESB") {
                filtro_cbo[tipo].forEach((categoria_profissional: IFiltro_CBO) => {
                    let placeholder = tipo + categoria_profissional['cbo'];
                    query_dinamica += `,
                        (
                            Select
                                Count(tfai.co_seq_fat_atd_ind)
                            from
                                tb_fat_atendimento_individual tfai
                                inner join tb_dim_unidade_saude tdus on tfai.co_dim_unidade_saude_1 = tdus.co_seq_dim_unidade_saude
                                Inner Join tb_dim_equipe tde On tfai.co_dim_equipe_1 = tde.co_seq_dim_equipe
                                inner join tb_dim_tempo tdt on tdt.co_seq_dim_tempo = tfai.co_dim_tempo
                                inner join tb_dim_cbo tdc on tdc.co_seq_dim_cbo = tfai.co_dim_cbo_1
                            Where
                                1=1
                                ${query_filtros_dinamica}
                                And tdc.nu_cbo = $${placeholder}
                                and unidade.co_seq_dim_unidade_saude = tdus.co_seq_dim_unidade_saude
                                and tb_equipe.nu_ine = tde.nu_ine
                        ) As "${categoria_profissional['categoria']}"
                        `

                    parametros_dinamicos.Add(placeholder, categoria_profissional['cbo'])
                });
            }
            else {
                filtro_cbo[tipo].forEach((categoria_profissional: IFiltro_CBO) => {
                    let placeholder = tipo + categoria_profissional['cbo'];
                    query_dinamica += `,
                        (
                            Select
                                Count(tfao.co_seq_fat_atd_odnt)
                            from
                                tb_fat_atendimento_odonto tfao
                                inner join tb_dim_unidade_saude tdus on tfao.co_dim_unidade_saude_1 = tdus.co_seq_dim_unidade_saude
                                Inner Join tb_dim_equipe tde On tfao.co_dim_equipe_1 = tde.co_seq_dim_equipe
                                inner join tb_dim_tempo tdt on tdt.co_seq_dim_tempo = tfao.co_dim_tempo
                                inner join tb_dim_cbo tdc on tdc.co_seq_dim_cbo = tfao.co_dim_cbo_1
                            Where
                                1=1
                                ${query_filtros_dinamica}
                                And tdc.nu_cbo = $${placeholder}
                                and unidade.co_seq_dim_unidade_saude = tdus.co_seq_dim_unidade_saude
                                and tb_equipe.nu_ine = tde.nu_ine
                        ) As "${categoria_profissional['categoria']}"
                        `
                    parametros_dinamicos.Add(placeholder, categoria_profissional['cbo'])
                });
            }
        })

        query_base += query_dinamica

        query_base += `,
            tb_localidade.no_localidade as "MUNICIPIO",
            tb_uf.sg_uf as "UF"
        From
            tb_dim_unidade_saude unidade Left Join
            tb_unidade_saude On tb_unidade_saude.nu_cnes = unidade.nu_cnes Left Join
            tb_localidade On tb_unidade_saude.co_localidade_endereco = tb_localidade.co_localidade Left Join
            tb_uf On tb_localidade.co_uf = tb_uf.co_uf
                    left join tb_equipe tb_equipe on tb_equipe.co_unidade_saude = tb_unidade_saude.co_seq_unidade_saude
                    inner join tb_dim_equipe equipe on equipe.nu_ine = tb_equipe.nu_ine
        Where
            tb_unidade_saude.tp_unidade_saude = '1'
        Order By
            "ESTABELECIMENTO"
`;  

        const relatorio = await databases.PSQLClient.query(queryConvert(query_base, parametros_dinamicos.GetAll()));

        return relatorio;
    }

    async getCbos() {
        const query_base = `
        select
            tte.sg_tipo_equipe as "TIPO",
            tdc.no_cbo as "CATEGORIA",
            tdc.nu_cbo as "CBO"
        from
            tb_fat_atendimento_individual tfai
            inner join tb_dim_cbo tdc on tdc.co_seq_dim_cbo = tfai.co_dim_cbo_1
            inner join tb_dim_equipe tde on tde.co_seq_dim_equipe = tfai.co_dim_equipe_1
            inner join tb_equipe te on tde.nu_ine = te.nu_ine
            inner join tb_tipo_equipe tte on te.tp_equipe = tte.co_seq_tipo_equipe
        group by
            tte.sg_tipo_equipe,
            tdc.no_cbo,
            nu_cbo
        union
        all
        select
            tte.sg_tipo_equipe as "TIPO",
            tdc.no_cbo as "CATEGORIA",
            tdc.nu_cbo as "CBO"
        from
            tb_fat_atendimento_odonto tfao
            inner join tb_dim_cbo tdc on tdc.co_seq_dim_cbo = tfao.co_dim_cbo_1
            inner join tb_dim_equipe tde on tde.co_seq_dim_equipe = tfao.co_dim_equipe_1
            inner join tb_equipe te on tde.nu_ine = te.nu_ine
            inner join tb_tipo_equipe tte on te.tp_equipe = tte.co_seq_tipo_equipe
        group by
            tte.sg_tipo_equipe,
            tdc.no_cbo,
            nu_cbo
        `

        const cbos_extraidos = await databases.PSQLClient.query(query_base);
        
        const cbos_query: { [key: string]: IFiltro_CBO[] } = {};
        cbos_extraidos.rows.forEach((row: ICBO) => {
            if (row.TIPO in cbos_query) {
                cbos_query[row.TIPO].push({ categoria: row.CATEGORIA, cbo: row.CBO })
            }
            else
                cbos_query[row.TIPO] = [{ categoria: row.CATEGORIA, cbo: row.CBO }]
        })

        return cbos_query
    }
}