import { ExecuteSQL } from "../database/execute";
import { ConnectDBs } from "../database/init";
import { IProdutividadeACS } from "../interfaces";
import { DynamicParameters } from "../utils";
import {
    SQL_PROD_ACS,
    SQL_PROD_ACS_DAY
} from "./SQL";


export class ACS_ProductivityReportService_Day {
    // Produtividade ACS Visitas Por Dia.
    async execute(dbtype: string, dbClient: ConnectDBs, filtros_params: IProdutividadeACS) {

        const SQL = new SQL_PROD_ACS_DAY()
        const DYNAMIC_PARAMETERS = new DynamicParameters()

        let SQL_BASE = SQL.getBase()
        let QUERY_FILTERS = ""

        //Filtros de consulta base.
        if (filtros_params.unidadeId && filtros_params.unidadeId > 0) {
            QUERY_FILTERS += " AND  VisitaDomiciliar.Estabelecimento_Id = :estabelecimento_Id ";
            DYNAMIC_PARAMETERS.Add("estabelecimento_Id", filtros_params.unidadeId);
        }

        if (filtros_params.profissionalId && filtros_params.profissionalId > 0) {
            QUERY_FILTERS += " AND  VisitaDomiciliar.Profissional_Id = :profissionalId ";
            DYNAMIC_PARAMETERS.Add("profissionalId", filtros_params.profissionalId)
        }

        if (filtros_params.equipeId && filtros_params.equipeId > 0) {
            QUERY_FILTERS += " AND  VisitaDomiciliar.CodigoEquipe = :codigoEquipe ";
            DYNAMIC_PARAMETERS.Add("codigoEquipe", filtros_params.equipeId)
        }

        if (filtros_params.micro_area != null) {
            QUERY_FILTERS += " AND  VisitaDomiciliar.MicroArea = :microArea ";
            DYNAMIC_PARAMETERS.Add("microArea", filtros_params.micro_area);
        }

        if (filtros_params.cns_individuo != null) {
            QUERY_FILTERS += " AND  VisitaDomiciliar.CnsDoIndividuo = :cartaoSus ";
            DYNAMIC_PARAMETERS.Add("cartaoSus", filtros_params.cns_individuo);
        }

        if (filtros_params.data_inicial != null && filtros_params.data_final != null) {
            QUERY_FILTERS += " AND  DATE(VisitaDomiciliar.DataCadastro) BETWEEN DATE(:dataInicial) AND DATE(:dataFinal)";
            DYNAMIC_PARAMETERS.Add("dataInicial", filtros_params.data_inicial);
            DYNAMIC_PARAMETERS.Add("dataFinal", filtros_params.data_final);
        }
        if (filtros_params.regionalId && filtros_params.regionalId > 0) {
            QUERY_FILTERS += " AND RegionalEstabelecimento.Regional_Id = :regionalId ";
            DYNAMIC_PARAMETERS.Add("regionalId", filtros_params.regionalId);
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

        const REPORT = await ExecuteSQL(dbtype, SQL_BASE, DYNAMIC_PARAMETERS, dbClient)

        if (!REPORT) return new Error('Falha na extração')

        return REPORT;
    }
}

export class ACS_ProductivityReportService {
    async execute(dbtype: string, dbClient: ConnectDBs, filtros_body: IProdutividadeACS, filtros_query: any) {

        const DYNAMIC_PARAMETERS = new DynamicParameters()

        const SQL = new SQL_PROD_ACS()

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

        const REPORT = await ExecuteSQL(dbtype, SQL_BASE, DYNAMIC_PARAMETERS, dbClient)

        if (!REPORT) return new Error('Falha na extração')

        return REPORT;
    }
}

