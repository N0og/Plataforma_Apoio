import { databases } from "../api";
import DynamicParameters from "../functions/DynamicParameters";


export class ProdutividadeACS_PorDiaQuery{
    // Produtividade ACS Visitas Por Dia.
    async execute (filtros:any){
        let query_base_dias = `
            SELECT DISTINCT
            COUNT( VisitaDomiciliar.Id ) AS 'TotalVisitaDia',
            DAY ( VisitaDomiciliar.DataCadastro ) AS Dia,
            MONTH ( VisitaDomiciliar.DataCadastro ) AS Mes,
            YEAR ( VisitaDomiciliar.DataCadastro ) AS Ano,
            Estabelecimento.Nome AS 'Unidade',
            Profissional.Nome AS 'ACS',
            VisitaDomiciliar.Profissional_Id AS 'Profissional_Id' 
        `

        const parametros_dinamicos = new DynamicParameters()
        let query_dias_filtros = ""

        //Filtros de consulta base.
        if (filtros.unidadeId && filtros.unidadeId > 0) {
            query_dias_filtros += " AND  VisitaDomiciliar.Estabelecimento_Id = :estabelecimento_Id ";
            parametros_dinamicos.Add("estabelecimento_Id", filtros.unidadeId);
        }

        if (filtros.profissionalId) {
            query_dias_filtros += " AND  VisitaDomiciliar.Profissional_Id = :profissionalId ";
            parametros_dinamicos.Add("profissionalId", filtros.profissionalId)
        }

        if (filtros.equipeId) {
            query_dias_filtros += " AND  VisitaDomiciliar.CodigoEquipe = :codigoEquipe ";
            parametros_dinamicos.Add("codigoEquipe", filtros.equipeId)
        }

        if (filtros.micro_area) {
            query_dias_filtros += " AND  VisitaDomiciliar.MicroArea = :microArea ";
            parametros_dinamicos.Add("microArea", filtros.micro_area);
        }

        if (filtros.cartao_sus) {
            query_dias_filtros += " AND  VisitaDomiciliar.CnsDoIndividuo = :cartaoSus ";
            parametros_dinamicos.Add("cartaoSus", filtros.cartao_sus);
        }

        if (filtros.compartilhada) {
            query_dias_filtros += " AND  VisitaDomiciliar.VisitaCompartilhada = :visitaCompartilhada ";
            parametros_dinamicos.Add("visitaCompartilhada", filtros.compartilhada)
        }
        if (filtros.desfecho) {
            query_dias_filtros += " AND  VisitaDomiciliar.Desfecho = :desfecho ";
            parametros_dinamicos.Add("desfecho", filtros.desfecho)
        }
        if (filtros.fora_area) {
            query_dias_filtros += " AND  VisitaDomiciliar.ForaDeArea = :foraDeArea ";
            parametros_dinamicos.Add("foraDeArea", filtros.fora_area)
        }

        if (filtros.tipo_visita) {
            query_dias_filtros += " AND VisitaDomiciliar.TipoDeVisita = :tipoDeVisitaId";
            parametros_dinamicos.Add("tipoDeVisitaId", filtros.tipo_visita)
        }

        if (filtros.cadastro_atualizacao == 1) {
            query_dias_filtros += " AND VisitaDomiciliar.MotivosDaVisita REGEXP 'CADASTRO_ATUALIZACAO|(^|,)(1)(,|$)' ";
        }

        if (filtros.cadastro_atualizacao == 0) {
            query_dias_filtros += " AND VisitaDomiciliar.MotivosDaVisita NOT REGEXP 'CADASTRO_ATUALIZACAO|(^|,)(1)(,|$)' ";
        }

        if (filtros.data_inicial != null && filtros.data_final != null) {
            query_dias_filtros += " AND  DATE(VisitaDomiciliar.DataCadastro) BETWEEN DATE(:dataInicial) AND DATE(:dataFinal)";
            parametros_dinamicos.Add("dataInicial", filtros.data_inicial);
            parametros_dinamicos.Add("dataFinal", filtros.data_final);
        }
        if (filtros.RegionalId) {
            query_dias_filtros += " AND re.Regional_Id = :regionalId ";
            parametros_dinamicos.Add("regionalId", filtros.RegionalId);
        }
        //Fim de Filtros de consulta base.

        query_base_dias +=`
        FROM
            VisitaDomiciliar
            LEFT JOIN RegionalEstabelecimento ON ( RegionalEstabelecimento.Estabelecimento_Id = VisitaDomiciliar.Estabelecimento_Id )
            INNER JOIN Estabelecimento ON ( Estabelecimento.Id = VisitaDomiciliar.Estabelecimento_Id )
            INNER JOIN Profissional ON ( Profissional.Id = VisitaDomiciliar.Profissional_Id )
            LEFT JOIN Domicilio ON ( Domicilio.Id = VisitaDomiciliar.Imovel_Id )
            LEFT JOIN Endereco ON ( Endereco.Id = VisitaDomiciliar.Endereco_Id )
            LEFT JOIN Bairro ON ( Bairro.Id = Endereco.Bairro_Id )
            LEFT JOIN TipoDeLogradouro ON ( TipoDeLogradouro.Id = Endereco.TipoDeLogradouro_Id ) 
            LEFT JOIN RegionalEstabelecimento re ON (re.Estabelecimento_Id = p.Estabelecimento_Id)
        WHERE
            Profissional.AcessoMobile = 1 
            AND Profissional.Ativo = 1 
            AND VisitaDomiciliar.Treinamento = 0 
            AND ( VisitaDomiciliar.MicroArea != Profissional.MicroAreaTemporaria OR Profissional.MicroAreaTemporaria IS NULL ) 
        `

        query_base_dias += query_dias_filtros

        query_base_dias += `
            GROUP BY
                Dia,
                Profissional.Nome 
            ORDER BY
                Dia
        `

        const relatorio = await databases.MDBClient.query(query_base_dias, parametros_dinamicos.GetAll())

        return relatorio
    }
}

export default class ProdutividadeACS_ConsolidadoQuery{
    async execute(filtros:any){
        //Produtividade ACS Consolidado.
    }
}