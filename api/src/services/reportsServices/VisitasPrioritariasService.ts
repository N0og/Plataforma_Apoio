import { DefaultTypesJSON } from "../../utils/bd/DefaultTypesJSON";
import DynamicParameters from "../../utils/reports/DynamicParameters";
import { IVisitasPrioriFiltros } from "../../interfaces/ReportsInterfaces/IVisitasPrioritarias";
import { ConnectDBs } from "../../database/init";
import { SQL_VISITAS_PRIORITARIAS } from "./SQL";

export default class VisitasPrioritariasQuery {

    async execute(dbtype: string, dbClient: ConnectDBs, filtros_body: IVisitasPrioriFiltros, filtros_query: IVisitasPrioriFiltros) {

        const SQL = new SQL_VISITAS_PRIORITARIAS()

        let SQL_BASE = SQL.getBase()

        // Definição de parâmetros dinâmicos
        let DYNAMIC_PARAMETERS = new DynamicParameters()
        let DYNAMIC_QUERY_FILTERS = "";
        let DYNAMIC_QUERY = "";
        let QUERY_FILTERS = "";

        //Filtros de consulta base.
        if (filtros_body.unidadeId && filtros_body.unidadeId > 0) {
            DYNAMIC_QUERY_FILTERS += " AND  VisitaDomiciliar.Estabelecimento_Id = :estabelecimento_Id ";
            QUERY_FILTERS += " AND p.Estabelecimento_Id = :estabelecimento_Id ";
            DYNAMIC_PARAMETERS.Add("estabelecimento_Id", filtros_body.unidadeId);
        }

        if (filtros_body.profissionalId && filtros_body.profissionalId > 0) {
            DYNAMIC_QUERY_FILTERS += " AND  VisitaDomiciliar.Profissional_Id = :profissionalId ";
            QUERY_FILTERS += " AND p.Id = :profissionalId";
            DYNAMIC_PARAMETERS.Add("profissionalId", filtros_body.profissionalId)
        }

        if (filtros_body.equipeId && filtros_body.equipeId > 0) {
            DYNAMIC_QUERY_FILTERS += " AND  VisitaDomiciliar.CodigoEquipe = :codigoEquipe ";
            QUERY_FILTERS += " AND p.Equipe_Id = :codigoEquipe ";
            DYNAMIC_PARAMETERS.Add("codigoEquipe", filtros_body.equipeId)
        }

        if (filtros_body.micro_area && filtros_body != null) {
            DYNAMIC_QUERY_FILTERS += " AND  VisitaDomiciliar.MicroArea = :microArea ";
            DYNAMIC_PARAMETERS.Add("microArea", filtros_body.micro_area);
        }

        if (filtros_body.cartao_sus && filtros_body.cartao_sus != null) {
            DYNAMIC_QUERY_FILTERS += " AND  VisitaDomiciliar.CnsDoIndividuo = :cartaoSus ";
            DYNAMIC_PARAMETERS.Add("cartaoSus", filtros_body.cartao_sus);
        }

        if (filtros_body.compartilhada === true) {
            DYNAMIC_QUERY_FILTERS += " AND  VisitaDomiciliar.VisitaCompartilhada = :visitaCompartilhada ";
            DYNAMIC_PARAMETERS.Add("visitaCompartilhada", filtros_body.compartilhada)
        }
        if (filtros_body.desfecho === true) {
            DYNAMIC_QUERY_FILTERS += " AND  VisitaDomiciliar.Desfecho = :desfecho ";
            DYNAMIC_PARAMETERS.Add("desfecho", filtros_body.desfecho)
        }
        if (filtros_body.fora_area === true) {
            DYNAMIC_QUERY_FILTERS += " AND  VisitaDomiciliar.ForaDeArea = :foraDeArea ";
            DYNAMIC_PARAMETERS.Add("foraDeArea", filtros_body.fora_area)
        }

        if (filtros_body.tipo_visita && filtros_body.tipo_visita > 0) {
            DYNAMIC_QUERY_FILTERS += " AND VisitaDomiciliar.TipoDeVisita = :tipoDeVisitaId";
            DYNAMIC_PARAMETERS.Add("tipoDeVisitaId", filtros_body.tipo_visita)
        }

        if (filtros_body.cadastro_atualizacao == 1) {
            DYNAMIC_QUERY_FILTERS += " AND VisitaDomiciliar.MotivosDaVisita REGEXP 'CADASTRO_ATUALIZACAO|(^|,)(1)(,|$)' ";
        }

        else if (filtros_body.cadastro_atualizacao == 0) {
            DYNAMIC_QUERY_FILTERS += " AND VisitaDomiciliar.MotivosDaVisita NOT REGEXP 'CADASTRO_ATUALIZACAO|(^|,)(1)(,|$)' ";
        }

        if (filtros_body.data_inicial != null && filtros_body.data_final != null) {
            DYNAMIC_QUERY_FILTERS += " AND  DATE(VisitaDomiciliar.DataCadastro) BETWEEN DATE(:dataInicial) AND DATE(:dataFinal)";
            DYNAMIC_PARAMETERS.Add("dataInicial", filtros_body.data_inicial);
            DYNAMIC_PARAMETERS.Add("dataFinal", filtros_body.data_final);
        }
        if (filtros_body.distritoId && filtros_body.distritoId > 0) {
            QUERY_FILTERS += " AND re.Regional_Id = :distritoId ";
            DYNAMIC_PARAMETERS.Add("distritoId", filtros_body.distritoId);
        }
        //Fim de Filtros de consulta base.

        //Filtros de consulta dinâmica.
        const DYNAMIC_FILTER_MAP = {
            gestantes: 'SQL_DYNAMIC_GESTANTES',
            puerperas: 'SQL_DYNAMIC_PUERPERAS',
            recem_nascido: 'SQL_DYNAMIC_RN',
            criancas: 'SQL_DYNAMIC_CRIANCAS',
            idosos: 'SQL_DYNAMIC_IDOSOS',
            domiciliados_acamados: 'SQL_DYNAMIC_DOMICILIADOS_ACAMADOS',
            desnutridos: 'SQL_DYNAMIC_DESNUTRIDOS',
            reabilitacao_deficiencia: 'SQL_DYNAMIC_REABILITACAO_DEFICIENCIA',
            hipertensos: 'SQL_DYNAMIC_HIPERTENSOS',
            diabeticos: 'SQL_DYNAMIC_DIABETICOS',
            asmaticos: 'SQL_DYNAMIC_ASMATICOS',
            dpoc: 'SQL_DYNAMIC_DPOC',
            cancer: 'SQL_DYNAMIC_CANCER',
            outras_doencas_cronicas: 'SQL_DYNAMIC_OUTRAS_DOENCAS_CRONICAS',
            hanseniase: 'SQL_DYNAMIC_HANSENIASE',
            tuberculose: 'SQL_DYNAMIC_TUBERCULOSE',
            sintomas_respiratorio: 'SQL_DYNAMIC_SINTOMAS_RESPIRATORIO',
            tabagistas: 'SQL_DYNAMIC_TABAGISTAS',
            vulnerabilidade_social: 'SQL_DYNAMIC_VULNERABILIDADE_SOCIAL',
            bolsa_familia: 'SQL_DYNAMIC_BOLSA_FAMILIA',
            saude_mental: 'SQL_DYNAMIC_SAUDE_MENTAL',
            alcoolatras: 'SQL_DYNAMIC_ALCOOLATRAS',
            outras_drogas: 'SQL_DYNAMIC_OUTRAS_DROGRAS',
            diarreira: 'SQL_DYNAMIC_DIARREIA',
            egresso_internacao: 'SQL_DYNAMIC_EGRESSOS_INTERNACAO'
        };
        
        for (const filter in filtros_body) {
            if (filtros_body[filter] && DYNAMIC_FILTER_MAP[filter]) {
                DYNAMIC_QUERY += SQL[DYNAMIC_FILTER_MAP[filter]](DYNAMIC_QUERY_FILTERS);
            }
        }
        
        // Construção final da consulta SQL
        SQL_BASE += `
            ${DYNAMIC_QUERY}
            ${SQL.getFrom()}
            ${QUERY_FILTERS}
        `; 

        const REPORT = await dbClient.getMariaDB().query(SQL_BASE, DYNAMIC_PARAMETERS.GetAll())

        return DefaultTypesJSON(REPORT[0])


    }
}