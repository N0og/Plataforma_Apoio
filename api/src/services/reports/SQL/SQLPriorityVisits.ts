export class SQL_PRIORITY_VISITS{
    private SQL_BASE = `
        SELECT
            p.Nome as "PROFISSIONAL",
            p.CartaoSus as "CARTÃO SUS",
            e.Cnes as cnes,
            e.Nome as "UNIDADE",
            p.Equipe_Id ine,
            r.id as "DISTRITO ID",
            r.Descricao as "DISTRITO DESCRIÇÃO",
            p.EquipamentoRecebido as "EQUIPAMENTO RECEBIDO",
            p.AcessoMobile as "ACESSO MOBILE"
    `

    private SQL_TOTAL_PEOPLE = `
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
            AND i.Estabelecimento_Id = cnes
            AND i.CodigoEquipe = ine
            AND Profissional.Id = p.Id
    `

    SQL_DYNAMIC_GESTANTES = (dynamic_filters: string) => 
        `,
            (
                ${this.SQL_TOTAL_PEOPLE}
                AND i.EstaGestante = 1
            ) AS TotalGestantes,
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${dynamic_filters}
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND(
                        FIND_IN_SET('5', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_GESTANTE', MotivosDaVisita)
                    )
            ) AS AcompanhamentoGestante,
            (
                SELECT
                    IFNULL(
                        ROUND(SUM(((AcompanhamentoGestante*100)/TotalGestantes)),1)
                        , 0
                        )
            ) AS "Acompanhamento Gestante(%)"
        `;

    SQL_DYNAMIC_PUERPERAS = (dynamic_filters: string) => 
        `,
            (
                ${this.SQL_TOTAL_PEOPLE}
                and i.Sexo = 1
            ) AS TotalPuerperas,
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${dynamic_filters}
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND(
                        FIND_IN_SET('6', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_PUERPERA', MotivosDaVisita)
                    )
            ) AS AcompanhamentoPuerperas,
            (
                SELECT
                    IFNULL(
                        ROUND(SUM(((AcompanhamentoPuerperas*100)/TotalPuerperas)),1)
                        , 0
                    )
            ) AS "Acompanhamento Puerpera(%)"
        `;

    SQL_DYNAMIC_RN = (dynamic_filters: string) => 
        `,
            (
                ${this.SQL_TOTAL_PEOPLE}
                AND TIMESTAMPDIFF(DAY, i.DataNascimento, :dataFinal) <= 28
            ) AS TotalRecemNascidos,
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${dynamic_filters}
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
            ) AS AcompanhamentoRecemNascidos,
            (
                SELECT
                    IFNULL(
                        ROUND(SUM(((AcompanhamentoRecemNascidos*100)/TotalRecemNascidos)),1)
                        , 0
                    )
            ) AS "Acompanhamento Recem Nascidos(%)"
        `;

    SQL_DYNAMIC_CRIANCAS = (dynamic_filters: string) =>
        `,
            (
                ${this.SQL_TOTAL_PEOPLE}
                    AND (
                        TIMESTAMPDIFF(YEAR, i.DataNascimento, NOW()) <= 2
                    )
            ) AS CriancasMenorDoisAnos,
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
                    ) ${dynamic_filters}
            ) AS AcompanhamentoCriancasMenorDoisAnos,
            (
                SELECT
                    IFNULL(
                        ROUND(SUM(((AcompanhamentoCriancasMenorDoisAnos*100)/CriancasMenorDoisAnos)),1)
                        , 0
                    )
            ) AS "Acompanhamento Crianças menores de 2 anos(%)"
        `;

    SQL_DYNAMIC_IDOSOS = (dynamic_filters: string) =>
        `,
            (
                ${this.SQL_TOTAL_PEOPLE}
                    AND (
                        TIMESTAMPDIFF(YEAR, i.DataNascimento, NOW()) >= 60
                    )
            ) AS TotalIdosos,
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
                    and i.CadastroTemporario = 0 ${dynamic_filters}
            ) AS AcompanhamentoIdosos,
            (
                SELECT
                    IFNULL(
                        ROUND(SUM(((AcompanhamentoIdosos * 100) / TotalIdosos)), 1)
                        , 0
                    )
            ) AS "Acompanhamento Idosos(%)"
        `;

    SQL_DYNAMIC_DOMICILIADOS_ACAMADOS = (dynamic_filters: string) =>
        `,
            (
                ${this.SQL_TOTAL_PEOPLE}
                    and (i.EstaAcamado = 1 or i.EstaDomiciliado = 1)
            ) AS TotalAcamadosDomiciliados,
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                    left join Individuo i on i.Id = VisitaDomiciliar.Individuo_Id
                WHERE
                    1 = 1
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND i.Deletado = 0
                    AND i.MudouSe = 0
                    and i.Transferencia = 0
                    and i.CadastroTemporario = 0
                    and (i.EstaAcamado = 1 or i.EstaDomiciliado = 1)
                    AND(
                        FIND_IN_SET('ACOMP_DOMICILIADOS_ACAMADOS', MotivosDaVisita)
                    ) ${dynamic_filters}
            ) AS AcompanhamentoAcamadosDomiciliados,
            (
                SELECT
                    IFNULL(
                        ROUND(SUM(((AcompanhamentoAcamadosDomiciliados*100)/TotalAcamadosDomiciliados)),1)
                        , 0
                    )
            ) AS "Acompanhamento Acamados/Domiciliados(%)"
        `;
    
    SQL_DYNAMIC_DESNUTRIDOS = (dynamic_filters: string) =>
        `,
            (
                ${this.SQL_TOTAL_PEOPLE}
                    AND i.Profissional_Id = p.Id
                    AND i.Deletado = 0
            ) AS TotalDesnutridos,
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${dynamic_filters}
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND(
                        FIND_IN_SET('9', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_DESNUTRICAO', MotivosDaVisita)
                    )
            ) AS AcompanhamentoDesnutridos,
            (
                SELECT
                    IFNULL(
                        ROUND(SUM(((AcompanhamentoDesnutridos*100)/TotalDesnutridos)),1)
                        , 0
                    )
            ) AS "Acompanhamento Desnutridos(%)"
        `;

    SQL_DYNAMIC_REABILITACAO_DEFICIENCIA = (dynamic_filters: string) =>
        `,
            (
                ${this.SQL_TOTAL_PEOPLE}
                    AND i.Deficiencias IS NOT NULL
                    AND i.Deficiencias <> ''
            ) AS TotalReabilitacaoDeficiencia,
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${dynamic_filters}
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND(
                        FIND_IN_SET('10', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_REAB_DEFICIENCIA', MotivosDaVisita)
                    )
            ) AS AcompanhamentoReabilitaçãoDeficiencia,
            (
                SELECT
                    IFNULL(
                        ROUND(SUM(((AcompanhamentoReabilitaçãoDeficiencia*100)/TotalReabilitacaoDeficiencia)),1)
                        , 0
                    )
            ) AS "Acompanhamento em Reabilitação ou Deficiencia(%)"
        `;

    SQL_DYNAMIC_HIPERTENSOS = (dynamic_filters: string) =>
        `,
            (
                ${this.SQL_TOTAL_PEOPLE}
                AND i.TemHipertensao = 1
            ) AS TotalPessoasHipertensao,
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${dynamic_filters}
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND(
                        FIND_IN_SET('11', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_HIPERTENSAO', MotivosDaVisita)
                    )
            ) AS AcompanhamentoPessoasHipertensao,
            (
                SELECT
                    IFNULL(
                        ROUND(SUM(((AcompanhamentoPessoasHipertensao*100)/TotalPessoasHipertensao)),1)
                        , 0
                    )
            ) AS "Acompanhamento Pessoas com Hipertensão(%)"
        `;

    SQL_DYNAMIC_DIABETICOS = (dynamic_filters: string) =>
        `,
            (
                ${this.SQL_TOTAL_PEOPLE}
                AND i.TemDiabetes = 1
            ) AS TotalPessoasDiabetes,
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${dynamic_filters}
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND(
                        FIND_IN_SET('12', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_DIABETES', MotivosDaVisita)
                    )
            ) AS AcompanhamentoPessoasDiabetes,
            (
                SELECT
                    IFNULL(
                       ROUND(SUM(((AcompanhamentoPessoasDiabetes*100)/TotalPessoasDiabetes)),1)
                       , 0
                    )
            ) AS "Acompanhamento Pessoas com Diabetes(%)"
        `;

    SQL_DYNAMIC_ASMATICOS = (dynamic_filters: string) =>
        `,
            (
                ${this.SQL_TOTAL_PEOPLE}
                AND (FIND_IN_SET('30', i.DoencasRespiratorias))
            ) AS "Total Asmáticos",
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${dynamic_filters}
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND(
                        FIND_IN_SET('13', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_ASMA', MotivosDaVisita)
                    )
            ) AS "Acompanhamento Asmáticos",
            (
                SELECT
                    IFNULL(
                        ROUND(SUM(((AcompAsmaPeriodo * 100) / AcompAsmaTotal)), 1)
                        , 0
                    )
            ) AS "Acompanhamento Asmáticos(%)"
        `;

    SQL_DYNAMIC_DPOC = (dynamic_filters: string) =>
        `,
            (
                ${this.SQL_TOTAL_PEOPLE}
                    AND (FIND_IN_SET('31', i.DoencasRespiratorias))
            ) AS "Total DPOC",
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${dynamic_filters}
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND(
                        FIND_IN_SET('14', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_DPOC_ENFISEMA', MotivosDaVisita)
                    )
            ) AS "Acompanhamento DPOC",
            (
                SELECT
                    IFNULL(
                        ROUND(SUM(((AcompEfisemaPeriodo*100)/AcompEfisemaTotal)),1)
                        , 0
                    )
            ) AS "Acompanhamento DPOC(%)"
        `;

    SQL_DYNAMIC_CANCER = (dynamic_filters: string) =>
        `,
            (
                ${this.SQL_TOTAL_PEOPLE}
                AND i.TemCancer = 1
            ) AS "Total Pessoas com Cancer",
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${dynamic_filters}
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND(
                        FIND_IN_SET('15', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_CANCER', MotivosDaVisita)
                    )
            ) AS "Acompanhamento Pessoas com Cancer",
            (
                SELECT
                    IFNULL(
                        ROUND(SUM(((AcompCancerPeriodo*100)/AcompCancerTotal)),1)
                        , 0
                    )
            ) AS "Acompanhamento Pessoas com Cancer(%)"
        `;

    SQL_DYNAMIC_OUTRAS_DOENCAS_CRONICAS = (dynamic_filters: string) =>
        `,
            (
                ${this.SQL_TOTAL_PEOPLE}
                    AND (FIND_IN_SET('32', i.DoencasRespiratorias))
            ) AS "Total Outras Doenças Crônicas",
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${dynamic_filters}
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND(
                        FIND_IN_SET('16', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_DOENCAS_CRONICAS', MotivosDaVisita)
                    )
            ) AS "Acompanhamento Outras Doenças Crônicas",
            (
                SELECT
                    IFNULL(
                        ROUND(SUM(((AcompOutrasDoencasCronicasPeriodo*100)/AcompOutrasDoencasCronicasTotal)),1)
                        , 0
                    )
            ) AS "Acompanhamento Outras Doenças Crônicas(%)"
        `;

    SQL_DYNAMIC_HANSENIASE = (dynamic_filters: string) =>
        `,
            (
                ${this.SQL_TOTAL_PEOPLE}
                AND i.TemHanseniase = 1
            ) AS "Total Pessoas com Haseninase",
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${dynamic_filters}
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND(
                        FIND_IN_SET('17', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_HANSENIASE', MotivosDaVisita)
                    )
            ) AS "Acompanhamento Pessoas com Haseninase",
            (
                SELECT
                    IFNULL(
                        ROUND(SUM(((AcompHanseniasePeriodo*100)/AcompHanseniaseTotal)),1)
                        , 0
                    )
            ) AS "Acompanhamento Pessoas com Haseninase(%)"
        `;

    SQL_DYNAMIC_TUBERCULOSE = (dynamic_filters: string) =>
        `,
            (
                ${this.SQL_TOTAL_PEOPLE}
                    AND i.TemTuberculose = 1
            ) AS "Total Tuberculose",
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${dynamic_filters}
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND(
                        FIND_IN_SET('18', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_TUBERCULOSE', MotivosDaVisita)
                    )
            ) AS "Acompanhamento Tuberculose",
            (
                SELECT
                    IFNULL(
                        ROUND(SUM(((AcompTuberculosePeriodo*100)/AcompTuberculoseTotal)),1)
                        , 0
                    )
            ) AS "Acompanhamento Tuberculose(%)"
        `;

    SQL_DYNAMIC_SINTOMAS_RESPIRATORIO = (dynamic_filters: string) =>
        `,
            (
                ${this.SQL_TOTAL_PEOPLE}
                AND i.DoencasRespiratorias <> ''
            ) AS "Total Sintomático Respiratório",
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${dynamic_filters}
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND(
                        FIND_IN_SET('32', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_SINTOMAS_RESPIRATORIOS', MotivosDaVisita)
                    )
            ) AS "Acompanhamento Sintomático Respiratório",
            (
                SELECT
                    IFNULL(
                        ROUND(SUM(((AcompSintomaticoRespiratorioPeriodo*100)/AcompSintomaticoRespiratorioTotal)),1)
                        , 0
                    )
            ) AS "Acompanhamento Sintomático Respiratório(%)"
        `;

    SQL_DYNAMIC_TABAGISTAS = (dynamic_filters: string) =>
        `,
            (
                ${this.SQL_TOTAL_PEOPLE}
                AND i.EhFumante = 1
            ) AS "Total Tabagistas",
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${dynamic_filters}
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND(
                        FIND_IN_SET('33', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_TABAGISTA', MotivosDaVisita)
                    )
            ) AS "Acompanhamento Tabagistas",
            (
                SELECT
                    IFNULL(
                        ROUND(SUM(((AcompTabagistaPeriodo*100)/AcompTabagistaTotal)),1)
                        , 0
                    )
            ) AS "Acompanhamento Tabagistas(%)"
        `;

    SQL_DYNAMIC_VULNERABILIDADE_SOCIAL = (dynamic_filters: string) =>
        `,
            (
                ${this.SQL_TOTAL_PEOPLE}
                AND i.EstaEmSituacaoDeRua = 1
            ) AS "Total em Vulnerabilidade Social",
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${dynamic_filters}
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND(
                        FIND_IN_SET('20', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_VULNERAB_SOCIAL', MotivosDaVisita)
                    )
            ) AS "Acompanhamento em Vulnerabilidade Social",
            (
                SELECT
                    IFNULL(
                        ROUND(SUM(((AcompVulnerabilidadeSocialPeriodo*100)/AcompVulnerabilidadeSocialTotal)),1)
                        , 0
                    )
            ) AS "Acompanhamento em Vulnerabilidade Social(%)"
        `;

    SQL_DYNAMIC_BOLSA_FAMILIA = (dynamic_filters: string) =>
        `,
            (
                ${this.SQL_TOTAL_PEOPLE}
                AND i.RecebeBolsaFamilia = 1
            ) AS "Total Beneficiarios Bolsa Familia",
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${dynamic_filters}
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND(
                        FIND_IN_SET('30', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_BOLSA_FAMILIA', MotivosDaVisita)
                    )
            ) AS "Acompanhamento Beneficiarios Bolsa Familia",
            (
                SELECT
                    IFNULL(
                       ROUND(SUM(((AcompAcompBolsaFamiliaPeriodo*100)/AcompAcompBolsaFamiliaTotal)),1)
                       , 0
                    )
            ) AS "Acompanhamento Beneficiarios Bolsa Familia(%)"
        `;

    SQL_DYNAMIC_SAUDE_MENTAL = (dynamic_filters: string) =>
        `,
            (
                ${this.SQL_TOTAL_PEOPLE}
                AND i.TemTratPsiquiatrico = 1
            ) AS "Total Tratamento Psiquiatrico",
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${dynamic_filters}
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND(
                        FIND_IN_SET('22', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_SAUDE_MENTAL', MotivosDaVisita)
                    )
            ) AS "Acompanhamento Tratamento Psiquiatrico",
            (
                SELECT
                    IFNULL(
                        ROUND(SUM(((AcompSaudeMentalPeriodo*100)/AcompSaudeMentalTotal)),1)
                        , 0
                    )
            ) AS "Acompanhamento Tratamento Psiquiatrico(%)"
        `;

    SQL_DYNAMIC_ALCOOLATRAS = (dynamic_filters: string) =>
        `,
            (
                ${this.SQL_TOTAL_PEOPLE}
                AND i.DependeDeAlcool = 1
            ) AS "Total Alcólatras",
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${dynamic_filters}
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND(
                        FIND_IN_SET('23', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_USUARIO_ALCOOL', MotivosDaVisita)
                    )
            ) AS "Acompanhamento Alcólatras",
            (
                SELECT
                    IFNULL(
                        ROUND(SUM(((AcompUsuarioAlcoolPeriodo*100)/AcompUsuarioAlcoolTotal)),1)
                        , 0
                    )
            ) AS "Acompanhamento Alcólatras(%)"
        `;

    SQL_DYNAMIC_OUTRAS_DROGRAS = (dynamic_filters: string) =>
        `,
            (
                ${this.SQL_TOTAL_PEOPLE}
                AND i.DependeDeDrogas = 1
            ) AS "Total Uso de Outras Drogas",
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${dynamic_filters}
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND(
                        FIND_IN_SET('24', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_USUARIO_DROGAS', MotivosDaVisita)
                    )
            ) AS "Acompanhamento Uso de Outras Drogas",
            (
                SELECT
                    IFNULL(
                        ROUND(SUM(((AcompOutrasDrogasPeriodo*100)/AcompOutrasDrogasTotal)),1)
                        , 0
                    )
            ) AS "Acompanhamento Uso de Outras Drogas(%)"
        `;

    SQL_DYNAMIC_DIARREIA = (dynamic_filters: string) =>
        `,
            (
                ${this.SQL_TOTAL_PEOPLE}
            ) AS "Total Pessoas com Diarreia",
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${dynamic_filters}
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND(
                        FIND_IN_SET('925', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_DIARREIA', MotivosDaVisita)
                    )
            ) AS "Acompanhamento Pessoas com Diarreia",
            (
                SELECT
                    IFNULL(
                       ROUND(SUM(((AcompDiarreiaPeriodo*100)/AcompDiarreiaTotal)),1)
                       , 0
                    )
            ) AS "Acompanhamento Pessoas com Diarreia(%)"
        `;

    SQL_DYNAMIC_EGRESSOS_INTERNACAO = (dynamic_filters: string) =>
        `,
            (
                ${this.SQL_TOTAL_PEOPLE}
                    AND i.TeveInternacao = 1
            ) AS "Total Egressos a Internação",
            (
                SELECT
                    COUNT(DISTINCT Individuo_Id)
                FROM
                    VisitaDomiciliar
                WHERE
                    1 = 1 ${dynamic_filters}
                    AND VisitaDomiciliar.Profissional_Id = p.Id
                    AND VisitaDomiciliar.DesfechoDeCadastro = 0
                    AND(
                        FIND_IN_SET('25', MotivosDaVisita)
                        OR FIND_IN_SET('ACOMP_EgressoInternacao', MotivosDaVisita)
                    )
            ) AS "Acompanhamento Egressos a Internação",
            (
                SELECT
                    IFNULL(
                        ROUND(SUM(((AcompEgressoInternacaoPeriodo*100)/AcompEgressoInternacaoTotal)),1)
                        , 0
                    )
            ) AS "Acompanhamento Egressos a Internação(%)"
        `;

    private SQL_FROM = `
        FROM Profissional p 
            LEFT JOIN Estabelecimento e ON (e.Id = p.Estabelecimento_Id) 
            LEFT JOIN RegionalEstabelecimento re ON (re.Estabelecimento_Id = p.Estabelecimento_Id) 
            LEFT JOIN Regional r ON (r.Id = re.Regional_Id)
        WHERE 
            p.Ocupacao_Id =  1349 
            and p.Ativo = 1
    `

    getBase(): string{
        return this.SQL_BASE
    }

    getFrom(): string{
        return this.SQL_FROM
    }
    
}