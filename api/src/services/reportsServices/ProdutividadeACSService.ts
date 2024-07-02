import { ConnectDBs } from "../../database/init";
import IProdutividadeACS from "../../interfaces/ReportsInterfaces/IProdutividadeACS";
import { DefaultTypesJSON } from "../../utils/bd/DefaultTypesJSON";
import DynamicParameters from "../../utils/reports/DynamicParameters";
import { SQL_PROD_ACS_CONSOLIDADO, SQL_PROD_ACS_POR_DIA } from "./SQL";


export class ProdutividadeACS_PorDiaQuery {
    // Produtividade ACS Visitas Por Dia.
    async execute(dbtype: string, dbClient: ConnectDBs, filtros_body: IProdutividadeACS, filtros_query: any) {

        const SQL = new SQL_PROD_ACS_POR_DIA()
        const DYNAMIC_PARAMETERS = new DynamicParameters()

        let SQL_BASE = SQL.getBase()
        let QUERY_FILTERS = ""

        //Filtros de consulta base.
        if (filtros_body.unidadeId && filtros_body.unidadeId > 0) {
            QUERY_FILTERS += " AND  VisitaDomiciliar.Estabelecimento_Id = :estabelecimento_Id ";
            DYNAMIC_PARAMETERS.Add("estabelecimento_Id", filtros_body.unidadeId);
        }

        if (filtros_body.profissionalId && filtros_body.profissionalId > 0 ) {
            QUERY_FILTERS += " AND  VisitaDomiciliar.Profissional_Id = :profissionalId ";
            DYNAMIC_PARAMETERS.Add("profissionalId", filtros_body.profissionalId)
        }

        if (filtros_body.equipeId && filtros_body.equipeId > 0) {
            QUERY_FILTERS += " AND  VisitaDomiciliar.CodigoEquipe = :codigoEquipe ";
            DYNAMIC_PARAMETERS.Add("codigoEquipe", filtros_body.equipeId)
        }

        if (filtros_body.micro_area != null ) {
            QUERY_FILTERS += " AND  VisitaDomiciliar.MicroArea = :microArea ";
            DYNAMIC_PARAMETERS.Add("microArea", filtros_body.micro_area);
        }

        if (filtros_body.cns_individuo != null) {
            QUERY_FILTERS += " AND  VisitaDomiciliar.CnsDoIndividuo = :cartaoSus ";
            DYNAMIC_PARAMETERS.Add("cartaoSus", filtros_body.cns_individuo);
        }

        if (filtros_body.data_inicial != null && filtros_body.data_final != null) {
            QUERY_FILTERS += " AND  DATE(VisitaDomiciliar.DataCadastro) BETWEEN DATE(:dataInicial) AND DATE(:dataFinal)";
            DYNAMIC_PARAMETERS.Add("dataInicial", filtros_body.data_inicial);
            DYNAMIC_PARAMETERS.Add("dataFinal", filtros_body.data_final);
        }
        if (filtros_body.regionalId && filtros_body.regionalId > 0) {
            QUERY_FILTERS += " AND RegionalEstabelecimento.Regional_Id = :regionalId ";
            DYNAMIC_PARAMETERS.Add("regionalId", filtros_body.regionalId);
        }
        //Fim de Filtros de consulta base.

        SQL_BASE += `
            ${SQL.getFrom()}
            ${QUERY_FILTERS}
            GROUP BY
                Dia,
                Profissional.Nome 
            ORDER BY
                Dia
            `

        const REPORT = await dbClient.getMariaDB().query(SQL_BASE, DYNAMIC_PARAMETERS.GetAll())
        return DefaultTypesJSON(REPORT[0])
    }
}

export class ProdutividadeACS_ConsolidadoQuery {
    async execute(dbtype: string, dbClient: ConnectDBs, filtros_body: IProdutividadeACS, filtros_query: any) {

        const DYNAMIC_PARAMETERS = new DynamicParameters()

        const SQL = new SQL_PROD_ACS_CONSOLIDADO()

        let SQL_BASE = SQL.getBase()

        if (!filtros_body.data_inicial || !filtros_body.data_final) {
            return new Error("Filtro de período obrigatório")
        }


        DYNAMIC_PARAMETERS.Add("DataInicial", filtros_body.data_inicial)
        DYNAMIC_PARAMETERS.Add("DataFinal", filtros_body.data_final)

        if (filtros_body.regionalId && filtros_body.regionalId > 0) {
            SQL_BASE += `
                and r.Id = :DistritoId
            `
            DYNAMIC_PARAMETERS.Add("DistritoId", filtros_body.distritoId)
        }

        if (filtros_body.unidadeId && filtros_body.unidadeId > 0) {
            SQL_BASE += `
                and est.Cnes  = :unidadeId
            `
            DYNAMIC_PARAMETERS.Add("unidadeId", filtros_body.unidadeId)
        }

        if (filtros_body.profissionalId && filtros_body.profissionalId > 0) {
            SQL_BASE += `
                and p.Id = :profissionalId
            `
            DYNAMIC_PARAMETERS.Add("profissionalId", filtros_body.profissionalId)
        }

        if (filtros_body.micro_area != null) {
            SQL_BASE += `
                and p.MicroArea = :micro_area
            `
            DYNAMIC_PARAMETERS.Add("micro_area", filtros_body.micro_area)
        }

        const REPORT = await dbClient.getMariaDB().query(SQL_BASE, DYNAMIC_PARAMETERS.GetAll())

        return DefaultTypesJSON(REPORT[0])
    }
}

