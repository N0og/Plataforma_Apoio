export class SQL_PROD_ACS_CONSOLIDADO{

    SQL_BASE:string = `
        SELECT
            p.Id,
            p.Nome NomeProfissional,
            p.Cpf AS CpfProfissional,
            est.Cnes,
            est.Nome AS CnesNome,
            p.Equipe_Id Ine,
            p.CartaoSus,
            p.EquipamentoRecebido,
            p.Ativo,
            p.VersaoApp,
            r.Descricao AS Regional,
            (
            SELECT
                COUNT( DISTINCT i.Id ) 
            FROM
                Individuo i
                INNER JOIN VisitaDomiciliar vd ON vd.Individuo_Id = i.Id 
            WHERE
                i.DesfechoDeCadastro = 0 
                AND vd.desfecho = 1 
                AND vd.TipoDeVisita = 3 
                AND i.Profissional_Id = p.Id 
                AND Date( vd.DataCadastro ) BETWEEN DATE(:DataInicial ) 
            AND DATE(:DataFinal )) AS AcompanhamentoPeriodoIndividuos,-- Acompanhamento Familia
            COALESCE ((
                SELECT
                    COUNT( 1 ) 
                FROM
                    VisitaDomiciliar 
                WHERE
                    VisitaDomiciliar.Profissional_Id = p.Id 
                    AND VisitaDomiciliar.CodigoEquipe > 0 
                    AND Desfecho = 1 
                    AND CAST( VisitaDomiciliar.DataCadastro AS DATE ) BETWEEN :DataInicial 
                    AND :DataFinal 
                    ),
                0 
            ) AcompanhamentoPeriodoFamilias,
            COALESCE (( SELECT COUNT( 1 ) FROM Profissional WHERE COALESCE ( Equipe_Id, 0 ) > 0 AND Id = p.Id ), 0 ) Nacs,
            COALESCE ((
                SELECT
                    COUNT( 1 ) 
                FROM
                    Domicilio 
                WHERE
                    Domicilio.Profissional_Id = p.Id 
                    AND Domicilio.TipoDeImovel = 1 
                    AND Deletado = 0 
                    AND CAST( DataAlteracao AS DATE ) BETWEEN :DataInicial 
                    AND :DataFinal 
                    ),
                0 
            ) NumeroCadastroDomicilio,
            COALESCE ((
                SELECT
                    COUNT( 1 ) 
                FROM
                    Domicilio 
                WHERE
                    Domicilio.Profissional_Id = p.Id 
                    AND TipoDeImovel = 1 
                    AND DATEDIFF( CURDATE(), DataAlteracao ) > 60 
                    AND CAST( DataCadastro AS DATE ) BETWEEN :DataInicial 
                    AND :DataFinal 
                    ),
                0 
            ) NumeroCadastroDomicilioNaoAtualizado,
            COALESCE ((
                SELECT
                    COUNT( 1 ) 
                FROM
                    Domicilio 
                WHERE
                    Domicilio.Profissional_Id = p.Id 
                    AND Deletado = 0 
                    AND CAST( Domicilio.DataAlteracao AS DATE ) BETWEEN :DataInicial 
                    AND :DataFinal 
                    ),
                0 
            ) NumeroCadastroImovel,
            COALESCE (( SELECT COUNT( 1 ) FROM Domicilio WHERE Domicilio.Profissional_Id = p.Id AND Deletado = 0 ), 0 ) NumeroCadastroImovelTotal,-- Total Familia
            (
            SELECT
                COUNT(
                DISTINCT ( Familia.Id )) AS TerritorioFamilias 
            FROM
                Familia
                LEFT JOIN Domicilio ON ( Domicilio.Id = Familia.Domicilio_Id )
                LEFT JOIN Estabelecimento ON ( Estabelecimento.Id = Domicilio.Estabelecimento_Id )
                LEFT JOIN Equipe ON ( Equipe.Id = Domicilio.CodigoEquipe )
                LEFT JOIN Profissional ON ( Profissional.Id = Domicilio.Profissional_Id )
                LEFT JOIN RegionalEstabelecimento ON ( RegionalEstabelecimento.Estabelecimento_Id = Estabelecimento.Id ) 
            WHERE
                1 = 1 
                AND COALESCE ( Familia.Deletado, 0 ) = 0 
                AND COALESCE ( Familia.MudouSe, 0 ) = 0 -- AND DATE(Familia.DataAlteracao) BETWEEN DATE(?dataInicial) AND DATE(?dataFinal)
                
                AND Estabelecimento.Id = p.Estabelecimento_Id 
                AND Equipe.Id = p.Equipe_Id 
                AND Profissional.Id = p.Id 
            ) NumeroCadastroFamiliaTotal,
            COALESCE ((
                SELECT
                    COUNT( 1 ) 
                FROM
                    Familia 
                WHERE
                    Familia.Profissional_Id = p.Id 
                    AND Deletado = 0 
                    AND MudouSe = 0 
                    AND CAST( Familia.DataAlteracao AS DATE ) BETWEEN DATE(:DataInicial ) 
                    AND DATE(:DataFinal )),
                0 
            ) NumeroCadastroFamilia,
            COALESCE ((
                SELECT
                    COUNT( 1 ) 
                FROM
                    Individuo 
                WHERE
                    Individuo.Profissional_Id = p.Id 
                    AND DesfechoDeCadastro = 0 
                    AND MudouSe <> 1 
                    AND Deletado = 0 
                    AND CAST( DataAlteracao AS DATE ) BETWEEN :DataInicial 
                    AND :DataFinal 
                    ),
                0 
            ) NumeroIndividuos,-- Individuos Total
            (
            SELECT
                COUNT(
                DISTINCT ( Individuo.Id )) AS NumeroIndividuosTotal 
            FROM
                Individuo
                INNER JOIN Equipe ON ( Equipe.Id = Individuo.CodigoEquipe )
                LEFT JOIN RegionalEstabelecimento ON ( RegionalEstabelecimento.Estabelecimento_Id = Individuo.Estabelecimento_Id )
                LEFT JOIN Endereco ON ( Individuo.Endereco_Id = Endereco.Id )
                LEFT JOIN Bairro ON ( Endereco.Bairro_Id = Bairro.Id )
                LEFT JOIN SituacaoDeRua ON ( SituacaoDeRua.Id = Individuo.Id )
                INNER JOIN Estabelecimento ON ( Estabelecimento.Id = Individuo.Estabelecimento_Id )
                INNER JOIN Profissional ON ( Profissional.Id = Individuo.Profissional_Id )
                LEFT JOIN Ocupacao ON ( Ocupacao.Id = Individuo.Ocupacao_Id )
                LEFT JOIN Cidade ON ( Cidade.Id = Individuo.CidadeDeNascimento )
                LEFT JOIN Comunidade ON ( Comunidade.Id = Individuo.Comunidade_Id )
                LEFT JOIN Familia ON ( Familia.Id = Individuo.Familia_Id )
                LEFT JOIN Domicilio ON ( Domicilio.Id = Familia.Domicilio_Id ) 
            WHERE
                1 = 1 -- AND DATE(Individuo.DataAlteracao) BETWEEN DATE(?dataInicial) AND DATE(?dataFinal)
                
                AND COALESCE ( Individuo.Deletado, 0 ) = 0 
                AND COALESCE ( Individuo.MudouSe, 0 ) = 0 
                AND Individuo.DataDoObito IS NULL 
                AND Estabelecimento.Id = p.Estabelecimento_Id 
                AND Equipe.Id = p.Equipe_Id 
                AND Profissional.Id = p.Id 
            ) NumeroIndividuosTotal,
            COALESCE ((
                SELECT
                    COUNT( 1 ) 
                FROM
                    Individuo 
                WHERE
                    Individuo.Profissional_Id = p.Id 
                    AND DATEDIFF( CURDATE(), DataAlteracao ) > 60 
                    AND MudouSe <> 1 
                    AND Deletado = 0 
                    AND CAST( DataCadastro AS DATE ) BETWEEN :DataInicial 
                    AND :DataFinal 
                    ),
                0 
            ) NumeroIndividuosNaoAtualizados,
            COALESCE ((
                SELECT
                    COUNT( 1 ) 
                FROM
                    Individuo 
                WHERE
                    Individuo.Profissional_Id = p.Id 
                    AND MudouSe <> 1 
                    AND Deletado = 0 
                    AND EstaGestante = 1 
                    AND CAST( DataAlteracao AS DATE ) BETWEEN :DataInicial 
                    AND :DataFinal 
                    ),
                0 
            ) NumeroGestantes,
            COALESCE ((
                SELECT
                    COUNT( 1 ) 
                FROM
                    Individuo 
                WHERE
                    Individuo.Profissional_Id = p.Id 
                    AND MudouSe <> 1 
                    AND Deletado = 0 
                    AND DATEDIFF( CURDATE(), DataAlteracao ) > 60 
                    AND EstaGestante = 1 
                    AND DATEDIFF( CURDATE(), DataUltimaMenstruacao ) > 36 
                    AND CAST( DataCadastro AS DATE ) BETWEEN :DataInicial 
                    AND :DataFinal 
                    ),
                0 
            ) NumeroGestantesNaoAtualizados,
            COALESCE ((
                SELECT
                    COUNT( 1 ) 
                FROM
                    VisitaDomiciliar 
                WHERE
                    VisitaDomiciliar.Profissional_Id = p.Id 
                    AND VisitaDomiciliar.CodigoEquipe > 0 
                    AND Desfecho = 1 
                    AND CAST( VisitaDomiciliar.DataCadastro AS DATE ) BETWEEN :DataInicial 
                    AND :DataFinal 
                    ),
                0 
            ) NumeroVisitasRealizadas,
            COALESCE ((
                SELECT
                    COUNT( 1 ) 
                FROM
                    VisitaDomiciliar 
                WHERE
                    VisitaDomiciliar.Profissional_Id = p.Id 
                    AND VisitaDomiciliar.CodigoEquipe > 0 
                    AND VisitaDomiciliar.Desfecho = 2 
                    AND CAST( VisitaDomiciliar.DataCadastro AS DATE ) BETWEEN :DataInicial 
                    AND :DataFinal 
                    ),
                0 
            ) NumeroVisitasRecusadas,
            COALESCE ((
                SELECT
                    COUNT( 1 ) 
                FROM
                    VisitaDomiciliar 
                WHERE
                    VisitaDomiciliar.Profissional_Id = p.Id 
                    AND VisitaDomiciliar.CodigoEquipe > 0 
                    AND VisitaDomiciliar.Desfecho = 3 
                    AND CAST( VisitaDomiciliar.DataCadastro AS DATE ) BETWEEN :DataInicial 
                    AND :DataFinal 
                    ),
                0 
            ) NumeroVisitasAusentes,
            COALESCE ((
                SELECT
                    COUNT( 1 ) 
                FROM
                    VisitaDomiciliar 
                WHERE
                    VisitaDomiciliar.Profissional_Id = p.Id 
                    AND VisitaDomiciliar.Deletado = 0 
                    AND VisitaDomiciliar.CodigoEquipe > 0 
                    AND CAST( VisitaDomiciliar.DataCadastro AS DATE ) BETWEEN :DataInicial 
                    AND :DataFinal 
                    AND VisitaDomiciliar.TipoDeVisita = 1 
                    ),
                0 
            ) NumeroVisitasImovel,
            COALESCE ((
                SELECT
                    COUNT( 1 ) 
                FROM
                    VisitaDomiciliar 
                WHERE
                    VisitaDomiciliar.Profissional_Id = p.Id 
                    AND VisitaDomiciliar.Deletado = 0 
                    AND VisitaDomiciliar.CodigoEquipe > 0 
                    AND CAST( VisitaDomiciliar.DataCadastro AS DATE ) BETWEEN :DataInicial 
                    AND :DataFinal 
                    AND VisitaDomiciliar.TipoDeVisita = 2 
                    ),
                0 
            ) NumeroVisitasFamilia,
            COALESCE ((
                SELECT
                    COUNT( 1 ) 
                FROM
                    VisitaDomiciliar 
                WHERE
                    VisitaDomiciliar.Profissional_Id = p.Id 
                    AND VisitaDomiciliar.Deletado = 0 
                    AND VisitaDomiciliar.CodigoEquipe > 0 
                    AND CAST( VisitaDomiciliar.DataCadastro AS DATE ) BETWEEN :DataInicial 
                    AND :DataFinal 
                    AND VisitaDomiciliar.TipoDeVisita = 3 
                    ),
                0 
            ) NumeroVisitasIndividuo,
            COALESCE ((
                SELECT
                    COUNT( 1 ) 
                FROM
                    VisitaDomiciliar 
                WHERE
                    VisitaDomiciliar.Profissional_Id = p.Id 
                    AND VisitaDomiciliar.Deletado = 0 
                    AND VisitaDomiciliar.CodigoEquipe > 0 
                    AND VisitaDomiciliar.DataCadastro BETWEEN :DataInicial 
                    AND :DataFinal 
                    ),
                0 
            ) NumeroVisitasTotal,
            COALESCE ((
                SELECT
                    COUNT( 1 ) 
                FROM
                    VisitaDomiciliar 
                WHERE
                    VisitaDomiciliar.Profissional_Id = p.Id 
                    AND VisitaDomiciliar.CodigoEquipe > 0 
                    AND VisitaDomiciliar.VisitaCompartilhada = 1 
                    AND CAST( VisitaDomiciliar.DataCadastro AS DATE ) BETWEEN :DataInicial 
                    AND :DataFinal 
                    ),
                0 
            ) NumeroVisitasCompartilhadas,
            COALESCE ((
                SELECT
                    COUNT( 1 ) 
                FROM
                    AtividadeColetiva
                    INNER JOIN Profissional ON ( AtividadeColetiva.Responsavel_Id = Profissional.Id ) 
                WHERE
                    AtividadeColetiva.Responsavel_Id = p.Id 
                    AND Profissional.Ocupacao_Id = 1349 
                    AND CAST( AtividadeColetiva.DataCadastro AS DATE ) BETWEEN :DataInicial 
                    AND :DataFinal 
                    ),
                0 
            ) AtividadeColetivaResponsavelTotal,
            COALESCE ((
                SELECT
                    COUNT( 1 ) 
                FROM
                    AtividadeColetiva
                    INNER JOIN AtividadeColetivaProfissionais ap ON ( AtividadeColetiva.Id = ap.AtividadeColetiva_Id ) 
                WHERE
                    ap.Profissional_Id = p.Id 
                    AND p.Ocupacao_Id = 1349 
                    AND CAST( AtividadeColetiva.DATA AS DATE ) BETWEEN DATE(:DataInicial ) 
                    AND DATE(:DataFinal )),
                0 
            ) AtividadeColetivaTotal,
            COALESCE ((
                SELECT
                    COUNT( 1 ) 
                FROM
                    AtividadeColetiva
                    INNER JOIN AtividadeColetivaProfissionais ap ON ( AtividadeColetiva.Id = ap.AtividadeColetiva_Id ) 
                WHERE
                    ap.Profissional_Id = p.Id 
                    AND p.Ocupacao_Id = 1349 
                    AND AtividadeColetiva.TipoDeAtividade = 1 
                    AND CAST( AtividadeColetiva.DATA AS DATE ) BETWEEN DATE(:DataInicial ) 
                    AND DATE(:DataFinal )),
                0 
            ) AtividadeColetivaReuniaoEquipe,
            COALESCE ((
                SELECT
                    COUNT( 1 ) 
                FROM
                    AtividadeColetiva
                    INNER JOIN AtividadeColetivaProfissionais ap ON ( AtividadeColetiva.Id = ap.AtividadeColetiva_Id ) 
                WHERE
                    ap.Profissional_Id = p.Id 
                    AND p.Ocupacao_Id = 1349 
                    AND AtividadeColetiva.TipoDeAtividade = 2 
                    AND CAST( AtividadeColetiva.DATA AS DATE ) BETWEEN DATE(:DataInicial ) 
                    AND DATE(:DataFinal )),
                0 
            ) AtividadeColetivaReuniaoOutrasEquipes,
            COALESCE ((
                SELECT
                    COUNT( 1 ) 
                FROM
                    AtividadeColetiva
                    INNER JOIN AtividadeColetivaProfissionais ap ON ( AtividadeColetiva.Id = ap.AtividadeColetiva_Id ) 
                WHERE
                    ap.Profissional_Id = p.Id 
                    AND p.Ocupacao_Id = 1349 
                    AND AtividadeColetiva.TipoDeAtividade = 3 
                    AND CAST( AtividadeColetiva.DATA AS DATE ) BETWEEN DATE(:DataInicial ) 
                    AND DATE(:DataFinal )),
                0 
            ) AtividadeColetivaInterSetorial,
            COALESCE ((
                SELECT
                    COUNT( 1 ) 
                FROM
                    AtividadeColetiva
                    INNER JOIN AtividadeColetivaProfissionais ap ON ( AtividadeColetiva.Id = ap.AtividadeColetiva_Id ) 
                WHERE
                    ap.Profissional_Id = p.Id 
                    AND p.Ocupacao_Id = 1349 
                    AND AtividadeColetiva.TipoDeAtividade = 4 
                    AND CAST( AtividadeColetiva.DATA AS DATE ) BETWEEN DATE(:DataInicial ) 
                    AND DATE(:DataFinal )),
                0 
            ) AtividadeColetivaEducaoEmSaude,
            COALESCE ((
                SELECT
                    COUNT( 1 ) 
                FROM
                    AtividadeColetiva
                    INNER JOIN AtividadeColetivaProfissionais ap ON ( AtividadeColetiva.Id = ap.AtividadeColetiva_Id ) 
                WHERE
                    ap.Profissional_Id = p.Id 
                    AND p.Ocupacao_Id = 1349 
                    AND AtividadeColetiva.TipoDeAtividade = 5 
                    AND CAST( AtividadeColetiva.DATA AS DATE ) BETWEEN DATE(:DataInicial ) 
                    AND DATE(:DataFinal )),
                0 
            ) AtividadeColetivaAtendimentoEmGrupo,
            COALESCE ((
                SELECT
                    COUNT( 1 ) 
                FROM
                    AtividadeColetiva
                    INNER JOIN AtividadeColetivaProfissionais ap ON ( AtividadeColetiva.Id = ap.AtividadeColetiva_Id ) 
                WHERE
                    ap.Profissional_Id = p.Id 
                    AND p.Ocupacao_Id = 1349 
                    AND AtividadeColetiva.TipoDeAtividade = 6 
                    AND CAST( AtividadeColetiva.DATA AS DATE ) BETWEEN DATE(:DataInicial ) 
                    AND DATE(:DataFinal )),
                0 
            ) AtividadeColetivaProcedimentoColetivo,
            COALESCE ((
                SELECT
                    COUNT( 1 ) 
                FROM
                    AtividadeColetiva
                    INNER JOIN AtividadeColetivaProfissionais ap ON ( AtividadeColetiva.Id = ap.AtividadeColetiva_Id ) 
                WHERE
                    ap.Profissional_Id = p.Id 
                    AND p.Ocupacao_Id = 1349 
                    AND AtividadeColetiva.TipoDeAtividade = 7 
                    AND CAST( AtividadeColetiva.DATA AS DATE ) BETWEEN DATE(:DataInicial ) 
                    AND DATE(:DataFinal )),
                0 
            ) AtividadeColetivaMobilizacaoSocial 
        FROM
            Profissional p
            LEFT JOIN Estabelecimento est ON ( est.Id = p.Estabelecimento_Id )
            LEFT JOIN RegionalEstabelecimento re ON ( re.Estabelecimento_Id = p.Estabelecimento_Id )
            LEFT JOIN Regional r ON r.Id = re.Regional_Id 
        WHERE
            1 = 1 
            AND p.Ocupacao_Id = 1349 
            AND p.AcessoMobile = TRUE 
            AND p.Ativo = TRUE
     `
}

export class SQL_PROD_ACS_POR_DIA{

    SQL_BASE:string = `
        SELECT DISTINCT
            COUNT( VisitaDomiciliar.Id ) AS 'TotalVisitaDia',
            DAY ( VisitaDomiciliar.DataCadastro ) AS Dia,
            MONTH ( VisitaDomiciliar.DataCadastro ) AS Mes,
            YEAR ( VisitaDomiciliar.DataCadastro ) AS Ano,
            Estabelecimento.Nome AS 'Unidade',
            Profissional.Nome AS 'ACS',
            VisitaDomiciliar.Profissional_Id AS 'Profissional_Id' 
    `

    SQL_END: string = `
        FROM
            VisitaDomiciliar
            LEFT JOIN RegionalEstabelecimento ON ( RegionalEstabelecimento.Estabelecimento_Id = VisitaDomiciliar.Estabelecimento_Id )
            INNER JOIN Estabelecimento ON ( Estabelecimento.Id = VisitaDomiciliar.Estabelecimento_Id )
            INNER JOIN Profissional ON ( Profissional.Id = VisitaDomiciliar.Profissional_Id )
            LEFT JOIN Domicilio ON ( Domicilio.Id = VisitaDomiciliar.Imovel_Id )
            LEFT JOIN Endereco ON ( Endereco.Id = VisitaDomiciliar.Endereco_Id )
            LEFT JOIN Bairro ON ( Bairro.Id = Endereco.Bairro_Id )
            LEFT JOIN TipoDeLogradouro ON ( TipoDeLogradouro.Id = Endereco.TipoDeLogradouro_Id ) 
        WHERE
            Profissional.AcessoMobile = 1 
            AND Profissional.Ativo = 1 
            AND VisitaDomiciliar.Treinamento = 0 
            AND ( VisitaDomiciliar.MicroArea != Profissional.MicroAreaTemporaria OR Profissional.MicroAreaTemporaria IS NULL ) 
    `
}