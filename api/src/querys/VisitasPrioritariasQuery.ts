import { databases } from "../api";
import DynamicParameters from "../functions/DynamicParameters";
import { IVisitasPrioriFiltros } from "../interfaces/IVisitasPrioritarias";

export default class VisitasPrioritariasQuery {

    // Lida com os tipos bigInt que não suporta a serialização de objetos em formato JSON.
    DefaultFormat(obj: any): any {
        if (typeof obj === 'bigint') {
            return Number(obj);
        }
        if (Buffer.isBuffer(obj)){
            return Number(obj[0]);
        }
        else if (typeof obj === 'object' && obj !== null) {
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    obj[key] = this.DefaultFormat(obj[key]);
                }
            }
        }
        return obj;
    }

    async execute(filtros: IVisitasPrioriFiltros) {

        // Declaração da query base para seleção dos dados
        let query_base = `
        SELECT
            p.Id,
            p.Nome,
            p.Equipe_Id Ine,
            p.Estabelecimento_Id Cnes,
            p.MicroArea,
            p.CartaoSus,
            p.EquipamentoRecebido,
            p.AcessoMobile,
            p.Cpf,
            e.Nome Estabelecimento
`;
        // Contagem total de indivíduos base
        let query_total_individuos_base = `
        SELECT
            COUNT(DISTINCT i.Id) AS TotalIndividuos
        FROM
            Individuo i
            INNER JOIN Profissional ON Profissional.Id = i.Profissional_Id
            INNER JOIN VisitaDomiciliar vd ON vd.Individuo_Id = i.Id
        WHERE
            i.Id IS NOT NULL
            AND(
                i.Transferencia IS NULL
                OR i.Transferencia = 0
            )
            AND(
                i.Deletado <> 1
                OR i.Deletado IS NULL
            )
            AND(
                i.CadastroTemporario IS NULL
                OR i.CadastroTemporario = 0
            )
            AND i.MudouSe = 0
            AND i.Estabelecimento_Id = Cnes
            AND i.CodigoEquipe = Ine
            AND Profissional.Id = p.Id
`;

        // Definição de parâmetros dinâmicos
        let parametros_dinamicos = new DynamicParameters()
        let query_filtros_dinamica = "";
        let query_dinamica = "";
        let query_filtros = "";

        //Filtros de consulta base.
        if (filtros.unidadeId && filtros.unidadeId > 0) {
            query_filtros_dinamica += " AND  VisitaDomiciliar.Estabelecimento_Id = :estabelecimento_Id ";
            query_filtros += " AND p.Estabelecimento_Id = :estabelecimento_Id ";
            parametros_dinamicos.Add("estabelecimento_Id", filtros.unidadeId);
        }

        if (filtros.profissionalId) {
            query_filtros_dinamica += " AND  VisitaDomiciliar.Profissional_Id = :profissionalId ";
            query_filtros += " AND p.Id = :profissionalId";
            parametros_dinamicos.Add("profissionalId", filtros.profissionalId)
        }

        if (filtros.equipeId) {
            query_filtros_dinamica += " AND  VisitaDomiciliar.CodigoEquipe = :codigoEquipe ";
            query_filtros += " AND p.Equipe_Id = :codigoEquipe ";
            parametros_dinamicos.Add("codigoEquipe", filtros.equipeId)
        }

        if (filtros.micro_area) {
            query_filtros_dinamica += " AND  VisitaDomiciliar.MicroArea = :microArea ";
            parametros_dinamicos.Add("microArea", filtros.micro_area);
        }

        if (filtros.cartao_sus) {
            query_filtros_dinamica += " AND  VisitaDomiciliar.CnsDoIndividuo = :cartaoSus ";
            parametros_dinamicos.Add("cartaoSus", filtros.cartao_sus);
        }

        if (filtros.compartilhada) {
            query_filtros_dinamica += " AND  VisitaDomiciliar.VisitaCompartilhada = :visitaCompartilhada ";
            parametros_dinamicos.Add("visitaCompartilhada", filtros.compartilhada)
        }
        if (filtros.desfecho) {
            query_filtros_dinamica += " AND  VisitaDomiciliar.Desfecho = :desfecho ";
            parametros_dinamicos.Add("desfecho", filtros.desfecho)
        }
        if (filtros.fora_area) {
            query_filtros_dinamica += " AND  VisitaDomiciliar.ForaDeArea = :foraDeArea ";
            parametros_dinamicos.Add("foraDeArea", filtros.fora_area)
        }

        if (filtros.tipo_visita) {
            query_filtros_dinamica += " AND VisitaDomiciliar.TipoDeVisita = :tipoDeVisitaId";
            parametros_dinamicos.Add("tipoDeVisitaId", filtros.tipo_visita)
        }

        if (filtros.cadastro_atualizacao == 1) {
            query_filtros_dinamica += " AND VisitaDomiciliar.MotivosDaVisita REGEXP 'CADASTRO_ATUALIZACAO|(^|,)(1)(,|$)' ";
        }

        if (filtros.cadastro_atualizacao == 0) {
            query_filtros_dinamica += " AND VisitaDomiciliar.MotivosDaVisita NOT REGEXP 'CADASTRO_ATUALIZACAO|(^|,)(1)(,|$)' ";
        }

        if (filtros.data_inicial != null && filtros.data_final != null) {
            query_filtros_dinamica += " AND  DATE(VisitaDomiciliar.DataCadastro) BETWEEN DATE(:dataInicial) AND DATE(:dataFinal)";
            parametros_dinamicos.Add("dataInicial", filtros.data_inicial);
            parametros_dinamicos.Add("dataFinal", filtros.data_final);
        }
        if (filtros.RegionalId) {
            query_base += " AND re.Regional_Id = :regionalId ";
            parametros_dinamicos.Add("regionalId", filtros.RegionalId);
        }
        //Fim de Filtros de consulta base.

        //Filtros de consulta dinâmica.
        if (filtros.gestante) {
            query_dinamica += `,
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${query_filtros_dinamica}
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND(
                        FIND_IN_SET('5', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_GESTANTE', MotivosDaVisita)
                    )
            ) AS AcompGestantePeriodo,
            (
                ${query_total_individuos_base}
                AND i.EstaGestante = 1
            ) AS AcompGestanteTotal,
            (
                SELECT
                    IFNULL(
                        ROUND(SUM(((AcompGestantePeriodo*100)/AcompGestanteTotal)),1)
                        , 0
                        )
            ) AS AcompGestanteMeta
`;
        }
        if (filtros.puerpera) {
            query_dinamica += `,
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${query_filtros_dinamica}
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND(
                        FIND_IN_SET('6', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_PUERPERA', MotivosDaVisita)
                    )
            ) AS AcompPuerperaPeriodo,
            (
                ${query_total_individuos_base}
            ) AS AcompPuerperaTotal,
            (
                SELECT
                    IFNULL(
                        ROUND(SUM(((AcompPuerperaPeriodo*100)/AcompPuerperaTotal)),1)
                        , 0
                    )
            ) AS AcompPuerperaMeta
`;
        }
        if (filtros.recem_nascido) {
            query_dinamica += `,
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${query_filtros_dinamica}
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND TIMESTAMPDIFF(
                        DAY,
                        VisitaDomiciliar.DataNascIndividuo,
                        :dataFinal
                    ) <= 28
                    AND(
                        FIND_IN_SET('7', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_RECEM_NASCIDO', MotivosDaVisita)
                    )
            ) AS AcompRecemNascidoPeriodo,
            (
                ${query_total_individuos_base}
                AND TIMESTAMPDIFF(DAY, i.DataNascimento, :dataFinal) <= 28
            ) AS AcompRecemNascidoTotal,
            (
                SELECT
                    IFNULL(
                        ROUND(SUM(((AcompRecemNascidoPeriodo*100)/AcompRecemNascidoTotal)),1)
                        , 0
                    )
            ) AS AcompRecemNascidoMeta
`;
        }
        if (filtros.crianca) {
            query_dinamica += `,
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                    left join Individuo i on i.Id = VisitaDomiciliar.Individuo_Id
                WHERE
                    1 = 1
                    AND TIMESTAMPDIFF(
                        YEAR,
                        i.DataNascimento,
                        VisitaDomiciliar.DataCadastro
                    ) <= 2
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND i.Deletado = 0
                    AND i.MudouSe = 0
                    and i.Transferencia = 0
                    and i.CadastroTemporario = 0
                    AND(
                        FIND_IN_SET('8', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_CRIANCA', MotivosDaVisita)
                    ) ${query_filtros_dinamica}
            ) AS AcompCriancaPeriodoDoisAno,
            (
                ${query_total_individuos_base}
                    AND (
                        TIMESTAMPDIFF(YEAR, i.DataNascimento, NOW()) <= 2
                    )
            ) AS AcompCriancaTotal,
            (
                SELECT
                    IFNULL(
                        ROUND(SUM(((AcompCriancaPeriodoDoisAno*100)/AcompCriancaTotal)),1)
                        , 0
                    )
            ) AS AcompCriancaMeta
`;
        }
        if (filtros.idoso) {
            query_dinamica += `,
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                    inner join Individuo i on i.Id = VisitaDomiciliar.Individuo_Id
                WHERE
                    1 = 1
                    AND TIMESTAMPDIFF(
                        YEAR,
                        i.DataNascimento,
                        VisitaDomiciliar.DataCadastro
                    ) >= 60
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND i.Deletado = 0
                    AND i.MudouSe = 0
                    and i.Transferencia = 0
                    and i.CadastroTemporario = 0 ${query_filtros_dinamica}
            ) AS AcompIdosoPeriodo,
            (
                ${query_total_individuos_base}
                    AND (
                        TIMESTAMPDIFF(YEAR, i.DataNascimento, NOW()) >= 60
                    )
            ) AS AcompIdosoTotal,
            (
                SELECT
                    IFNULL(
                        ROUND(SUM(((AcompIdosoPeriodo * 100) / AcompIdosoTotal)), 1)
                        , 0
                    )
            ) AS AcompIdosoMeta
 `;
        }
        if (filtros.desnutricao) {
            query_dinamica += `,
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${query_filtros_dinamica}
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND(
                        FIND_IN_SET('9', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_DESNUTRICAO', MotivosDaVisita)
                    )
            ) AS AcompDesnutricaoPeriodo,
            (
                ${query_total_individuos_base}
                    AND i.Profissional_Id = p.Id
                    AND i.Deletado = 0
            ) AS AcompDesnutricaoTotal,
            (
                SELECT
                    IFNULL(
                        ROUND(SUM(((AcompDesnutricaoPeriodo*100)/AcompDesnutricaoTotal)),1)
                        , 0
                    )
            ) AS AcompDesnutricaoMeta
`;
        }
        if (filtros.reabilitacao_deficiencia) {
            query_dinamica += `,
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${query_filtros_dinamica}
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND(
                        FIND_IN_SET('10', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_REAB_DEFICIENCIA', MotivosDaVisita)
                    )
            ) AS AcompReabilitacaoOuDeficienciaPeriodo,
            (
                ${query_total_individuos_base}
                    AND i.Deficiencias IS NOT NULL
                    AND i.Deficiencias <> ''
            ) AS AcompReabilitacaoOuDeficienciaTotal,
            (
                SELECT
                    IFNULL(
                        ROUND(SUM(((AcompReabilitacaoOuDeficienciaPeriodo*100)/AcompReabilitacaoOuDeficienciaTotal)),1)
                        , 0
                    )
            ) AS AcompReabilitacaoOuDeficienciaMeta
`;
        }
        if (filtros.hipertensao) {
            query_dinamica += `,
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${query_filtros_dinamica}
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND(
                        FIND_IN_SET('11', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_HIPERTENSAO', MotivosDaVisita)
                    )
            ) AS AcompHipertensoPeriodo,
            (
                ${query_total_individuos_base}
                AND i.TemHipertensao = 1
            ) AS AcompHipertensoTotal,
            (
                SELECT
                    IFNULL(
                        ROUND(SUM(((AcompHipertensoPeriodo*100)/AcompHipertensoTotal)),1)
                        , 0
                    )
            ) AS AcompHipertensoMeta
`;
        }
        if (filtros.diabetes) {
            query_dinamica += `,(
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${query_filtros_dinamica}
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND(
                        FIND_IN_SET('12', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_DIABETES', MotivosDaVisita)
                    )
            ) AS AcompDiabetesPeriodo,
            (
                ${query_total_individuos_base}
                AND i.TemDiabetes = 1
            ) AS AcompDiabetesTotal,
            (
                SELECT
                    IFNULL(
                       ROUND(SUM(((AcompDiabetesPeriodo*100)/AcompDiabetesTotal)),1)
                       , 0
                    )
            ) AS AcompDiabetesMeta
`;
        }
        if (filtros.asma) {
            query_dinamica += `,
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${query_filtros_dinamica}
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND(
                        FIND_IN_SET('13', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_ASMA', MotivosDaVisita)
                    )
            ) AS AcompAsmaPeriodo,
            (
                ${query_total_individuos_base}
                AND (FIND_IN_SET('30', i.DoencasRespiratorias))
            ) AS AcompAsmaTotal,
            (
                SELECT
                    IFNULL(
                        ROUND(SUM(((AcompAsmaPeriodo * 100) / AcompAsmaTotal)), 1)
                        , 0
                    )
            ) AS AcompAsmaMeta
`;
        }
        if (filtros.dpoc) {
            query_dinamica += `,
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${query_filtros_dinamica}
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND(
                        FIND_IN_SET('14', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_DPOC_ENFISEMA', MotivosDaVisita)
                    )
            ) AS AcompEfisemaPeriodo,
            (
                ${query_total_individuos_base}
                    AND (FIND_IN_SET('31', i.DoencasRespiratorias))
            ) AS AcompEfisemaTotal,
            (
                SELECT
                    IFNULL(
                        ROUND(SUM(((AcompEfisemaPeriodo*100)/AcompEfisemaTotal)),1)
                        , 0
                    )
            ) AS AcompEfisemaMeta
`;
        }
        if (filtros.cancer) {
            query_dinamica += `,
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${query_filtros_dinamica}
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND(
                        FIND_IN_SET('15', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_CANCER', MotivosDaVisita)
                    )
            ) AS AcompCancerPeriodo,
            (
                ${query_total_individuos_base}
                AND i.TemCancer = 1
            ) AS AcompCancerTotal,
            (
                SELECT
                    IFNULL(
                        ROUND(SUM(((AcompCancerPeriodo*100)/AcompCancerTotal)),1)
                        , 0
                    )
            ) AS AcompCancerMeta
`;
        }
        if (filtros.outras_doencas_cronicas) {
            query_dinamica += `,
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${query_filtros_dinamica}
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND(
                        FIND_IN_SET('16', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_DOENCAS_CRONICAS', MotivosDaVisita)
                    )
            ) AS AcompOutrasDoencasCronicasPeriodo,
            (
                ${query_total_individuos_base}
                    AND (FIND_IN_SET('32', i.DoencasRespiratorias))
            ) AS AcompOutrasDoencasCronicasTotal,
            (
                SELECT
                    IFNULL(
                        ROUND(SUM(((AcompOutrasDoencasCronicasPeriodo*100)/AcompOutrasDoencasCronicasTotal)),1)
                        , 0
                    )
            ) AS AcompOutrasDoencasCronicasMeta
`;
        }
        if (filtros.hanseniase) {
            query_dinamica += `,
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${query_filtros_dinamica}
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND(
                        FIND_IN_SET('17', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_HANSENIASE', MotivosDaVisita)
                    )
            ) AS AcompHanseniasePeriodo,
            (
                ${query_total_individuos_base}
                AND i.TemHanseniase = 1
            ) AS AcompHanseniaseTotal,
            (
                SELECT
                    IFNULL(
                        ROUND(SUM(((AcompHanseniasePeriodo*100)/AcompHanseniaseTotal)),1)
                        , 0
                    )
            ) AS AcompHanseniaseMeta
`;
        }
        if (filtros.tuberculose) {
            query_dinamica += `,
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${query_filtros_dinamica}
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND(
                        FIND_IN_SET('18', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_TUBERCULOSE', MotivosDaVisita)
                    )
            ) AS AcompTuberculosePeriodo,
            (
                ${query_total_individuos_base}
                    AND i.TemTuberculose = 1
            ) AS AcompTuberculoseTotal,
            (
                SELECT
                    IFNULL(
                        ROUND(SUM(((AcompTuberculosePeriodo*100)/AcompTuberculoseTotal)),1)
                        , 0
                    )
            ) AS AcompTuberculoseMeta
`;
        }
        if (filtros.sintomas_respiratorio) {
            query_dinamica += `,
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${query_filtros_dinamica}
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND(
                        FIND_IN_SET('32', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_SINTOMAS_RESPIRATORIOS', MotivosDaVisita)
                    )
            ) AS AcompSintomaticoRespiratorioPeriodo,
            (
                ${query_total_individuos_base}
                AND i.DoencasRespiratorias <> ''
            ) AS AcompSintomaticoRespiratorioTotal,
            (
                SELECT
                    IFNULL(
                        ROUND(SUM(((AcompSintomaticoRespiratorioPeriodo*100)/AcompSintomaticoRespiratorioTotal)),1)
                        , 0
                    )
            ) AS AcompSintomaticoRespiratorioMeta
`;
        }
        if (filtros.tabagista) {
            query_dinamica += `,
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${query_filtros_dinamica}
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND(
                        FIND_IN_SET('33', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_TABAGISTA', MotivosDaVisita)
                    )
            ) AS AcompTabagistaPeriodo,
            (
                ${query_total_individuos_base}
                AND i.EhFumante = 1
            ) AS AcompTabagistaTotal,
            (
                SELECT
                    IFNULL(
                        ROUND(SUM(((AcompTabagistaPeriodo*100)/AcompTabagistaTotal)),1)
                        , 0
                    )
            ) AS AcompTabagistaMeta
`;
        }

        if (filtros.vulnerabilidade_social) {
            query_dinamica += `,
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${query_filtros_dinamica}
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND(
                        FIND_IN_SET('20', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_VULNERAB_SOCIAL', MotivosDaVisita)
                    )
            ) AS AcompVulnerabilidadeSocialPeriodo,
            (
                ${query_total_individuos_base}
                AND i.EstaEmSituacaoDeRua = 1
            ) AS AcompVulnerabilidadeSocialTotal,
            (
                SELECT
                    IFNULL(
                        ROUND(SUM(((AcompVulnerabilidadeSocialPeriodo*100)/AcompVulnerabilidadeSocialTotal)),1)
                        , 0
                    )
            ) AS AcompVulnerabilidadeSocialMeta
`;
        }
        if (filtros.bolsa_familia) {
            query_dinamica += `,
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${query_filtros_dinamica}
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND(
                        FIND_IN_SET('30', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_BOLSA_FAMILIA', MotivosDaVisita)
                    )
            ) AS AcompAcompBolsaFamiliaPeriodo,
            (
                ${query_total_individuos_base}
                AND i.RecebeBolsaFamilia = 1
            ) AS AcompAcompBolsaFamiliaTotal,
            (
                SELECT
                    IFNULL(
                       ROUND(SUM(((AcompAcompBolsaFamiliaPeriodo*100)/AcompAcompBolsaFamiliaTotal)),1)
                       , 0
                    )
            ) AS AcompAcompBolsaFamiliaMeta
`;
        }
        if (filtros.saude_mental) {
            query_dinamica += `,
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${query_filtros_dinamica}
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND(
                        FIND_IN_SET('22', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_SAUDE_MENTAL', MotivosDaVisita)
                    )
            ) AS AcompSaudeMentalPeriodo,
            (
                ${query_total_individuos_base}
                AND i.TemTratPsiquiatrico = 1
            ) AS AcompSaudeMentalTotal,
            (
                SELECT
                    IFNULL(
                        ROUND(SUM(((AcompSaudeMentalPeriodo*100)/AcompSaudeMentalTotal)),1)
                        , 0
                    )
            ) AS AcompSaudeMentalMeta`
        }

        if (filtros.usuario_alcool) {
            query_dinamica += `,
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${query_filtros_dinamica}
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND(
                        FIND_IN_SET('23', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_USUARIO_ALCOOL', MotivosDaVisita)
                    )
            ) AS AcompUsuarioAlcoolPeriodo,
            (
                ${query_total_individuos_base}
                AND i.DependeDeAlcool = 1
            ) AS AcompUsuarioAlcoolTotal,
            (
                SELECT
                    IFNULL(
                        ROUND(SUM(((AcompUsuarioAlcoolPeriodo*100)/AcompUsuarioAlcoolTotal)),1)
                        , 0
                    )
            ) AS AcompUsuarioAlcoolMeta
`;
        }

        if (filtros.outras_drogas) {
            query_dinamica += `,
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${query_filtros_dinamica}
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND(
                        FIND_IN_SET('24', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_USUARIO_DROGAS', MotivosDaVisita)
                    )
            ) AS AcompOutrasDrogasPeriodo,
            (
                ${query_total_individuos_base}
                AND i.DependeDeDrogas = 1
            ) AS AcompOutrasDrogasTotal,
            (
                SELECT
                    IFNULL(
                        ROUND(SUM(((AcompOutrasDrogasPeriodo*100)/AcompOutrasDrogasTotal)),1)
                        , 0
                    )
            ) AS AcompOutrasDrogasMeta`
        }

        if (filtros.diarreira) {
            query_dinamica += `,
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${query_filtros_dinamica}
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND(
                        FIND_IN_SET('925', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_DIARREIA', MotivosDaVisita)
                    )
            ) AS AcompDiarreiaPeriodo,
            (
                ${query_total_individuos_base}
            ) AS AcompDiarreiaTotal,
            (
                SELECT
                    IFNULL(
                       ROUND(SUM(((AcompDiarreiaPeriodo*100)/AcompDiarreiaTotal)),1)
                       , 0
                    )
            ) AS AcompDiarreiaMeta`
        }

        if (filtros.egresso_internacao) {
            query_dinamica += `,
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${query_filtros_dinamica}
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND(
                        FIND_IN_SET('25', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_EgressoInternacao', MotivosDaVisita)
                    )
            ) AS AcompEgressoInternacaoPeriodo,
            (
                ${query_total_individuos_base}
                    AND i.TeveInternacao = 1
            ) AS AcompEgressoInternacaoTotal,
            (
                SELECT
                    IFNULL(
                        ROUND(SUM(((AcompEgressoInternacaoPeriodo*100)/AcompEgressoInternacaoTotal)),1)
                        , 0
                    )
            ) AS AcompEgressoInternacaoMeta
`;
        }

        query_base += query_dinamica

        query_base += `  
            FROM Profissional p 
            LEFT JOIN Estabelecimento e ON (e.Id = p.Estabelecimento_Id) 
            LEFT JOIN RegionalEstabelecimento re ON (re.Estabelecimento_Id = p.Estabelecimento_Id) 
            WHERE p.Ocupacao_Id =  1349 
`;

        query_base += query_filtros

        const relatorio = this.DefaultFormat(await databases.MDBClient.query(query_base, parametros_dinamicos.GetAll()))

        return relatorio


    }
}