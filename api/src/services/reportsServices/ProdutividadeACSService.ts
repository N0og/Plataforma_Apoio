import { ConnectDBs } from "../../database/init";
import { DefaultTypesJSON } from "../../utils/bd/DefaultTypesJSON";
import DynamicParameters from "../../utils/reports/DynamicParameters";
import { SQL_PROD_ACS_CONSOLIDADO, SQL_PROD_ACS_POR_DIA } from "./SQL";


export class ProdutividadeACS_PorDiaQuery{
    // Produtividade ACS Visitas Por Dia.
    async execute (dbClient:ConnectDBs, filtros_body: any, filtros_query: any){

        const SQL = new SQL_PROD_ACS_POR_DIA()

        let query_base = SQL.SQL_BASE

        const parametros_dinamicos = new DynamicParameters()
        let query_dias_filtros = ""

        //Filtros de consulta base.
        if (filtros_body.unidadeId && filtros_body.unidadeId > 0) {
            query_dias_filtros += " AND  VisitaDomiciliar.Estabelecimento_Id = :estabelecimento_Id ";
            parametros_dinamicos.Add("estabelecimento_Id", filtros_body.unidadeId);
        }

        if (filtros_body.profissionalId) {
            query_dias_filtros += " AND  VisitaDomiciliar.Profissional_Id = :profissionalId ";
            parametros_dinamicos.Add("profissionalId", filtros_body.profissionalId)
        }

        if (filtros_body.equipeId) {
            query_dias_filtros += " AND  VisitaDomiciliar.CodigoEquipe = :codigoEquipe ";
            parametros_dinamicos.Add("codigoEquipe", filtros_body.equipeId)
        }

        if (filtros_body.micro_area) {
            query_dias_filtros += " AND  VisitaDomiciliar.MicroArea = :microArea ";
            parametros_dinamicos.Add("microArea", filtros_body.micro_area);
        }

        if (filtros_body.cartao_sus) {
            query_dias_filtros += " AND  VisitaDomiciliar.CnsDoIndividuo = :cartaoSus ";
            parametros_dinamicos.Add("cartaoSus", filtros_body.cartao_sus);
        }

        if (filtros_body.compartilhada) {
            query_dias_filtros += " AND  VisitaDomiciliar.VisitaCompartilhada = :visitaCompartilhada ";
            parametros_dinamicos.Add("visitaCompartilhada", filtros_body.compartilhada)
        }
        if (filtros_body.desfecho) {
            query_dias_filtros += " AND  VisitaDomiciliar.Desfecho = :desfecho ";
            parametros_dinamicos.Add("desfecho", filtros_body.desfecho)
        }
        if (filtros_body.fora_area) {
            query_dias_filtros += " AND  VisitaDomiciliar.ForaDeArea = :foraDeArea ";
            parametros_dinamicos.Add("foraDeArea", filtros_body.fora_area)
        }

        if (filtros_body.tipo_visita) {
            query_dias_filtros += " AND VisitaDomiciliar.TipoDeVisita = :tipoDeVisitaId";
            parametros_dinamicos.Add("tipoDeVisitaId", filtros_body.tipo_visita)
        }

        if (filtros_body.cadastro_atualizacao == 1) {
            query_dias_filtros += " AND VisitaDomiciliar.MotivosDaVisita REGEXP 'CADASTRO_ATUALIZACAO|(^|,)(1)(,|$)' ";
        }

        if (filtros_body.cadastro_atualizacao == 0) {
            query_dias_filtros += " AND VisitaDomiciliar.MotivosDaVisita NOT REGEXP 'CADASTRO_ATUALIZACAO|(^|,)(1)(,|$)' ";
        }

        if (filtros_body.data_inicial != null && filtros_body.data_final != null) {
            query_dias_filtros += " AND  DATE(VisitaDomiciliar.DataCadastro) BETWEEN DATE(:dataInicial) AND DATE(:dataFinal)";
            parametros_dinamicos.Add("dataInicial", filtros_body.data_inicial);
            parametros_dinamicos.Add("dataFinal", filtros_body.data_final);
        }
        if (filtros_body.RegionalId) {
            query_dias_filtros += " AND RegionalEstabelecimento.Regional_Id = :regionalId ";
            parametros_dinamicos.Add("regionalId", filtros_body.RegionalId);
        }
        //Fim de Filtros de consulta base.

        query_base += `
            ${SQL.SQL_END}
            ${query_dias_filtros}
            GROUP BY
                Dia,
                Profissional.Nome 
            ORDER BY
                Dia
            `
    
        const relatorio = await dbClient.getMariaDB().query(query_base, parametros_dinamicos.GetAll())
        return DefaultTypesJSON(relatorio[0])
    }
}

export class ProdutividadeACS_ConsolidadoQuery{
    async execute(dbClient:ConnectDBs, filtros_body:any, filtros_query:any){

        const parametros_dinamicos = new DynamicParameters()
        let query_base_filtros = ""

        if (!filtros_body.data_inicial || !filtros_body.data_final){
            return new Error("Filtro de período obrigatório")
        }

        parametros_dinamicos.Add("DataInicial", filtros_body.data_inicial)
        parametros_dinamicos.Add("DataFinal", filtros_body.data_final)

        if (filtros_body.distritoId){
            query_base_filtros += `
                and r.Id = :DistritoId
            `
            parametros_dinamicos.Add("DistritoId", filtros_body.distritoId)
        }

        if (filtros_body.unidadeId){
            query_base_filtros += `
                and est.Cnes  = :unidadeId
            `
            parametros_dinamicos.Add("unidadeId", filtros_body.unidadeId)
        }

        if (filtros_body.profissionalId){
            query_base_filtros += `
                and p.Id = :profissionalId
            `
            parametros_dinamicos.Add("profissionalId", filtros_body.profissionalId)
        }

        if (filtros_body.micro_area){
            query_base_filtros += `
                and p.MicroArea = :micro_area
            `
            parametros_dinamicos.Add("micro_area", filtros_body.micro_area)
        }

        const SQL = new SQL_PROD_ACS_CONSOLIDADO()

        let query_base = SQL.SQL_BASE 
        
        query_base+=query_base_filtros

    const relatorio = await dbClient.getMariaDB().query(query_base, parametros_dinamicos.GetAll())

    return DefaultTypesJSON(relatorio[0])
    }
}

