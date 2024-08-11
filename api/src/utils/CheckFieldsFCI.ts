import { CheckedFCI, IATT_CPF } from "../interfaces";
import { checkAge } from ".";



export function checkFieldsFCI(fci: IATT_CPF): CheckedFCI {
    let invalidations: Array<string> = []

    let fields = 50
    let missing_fields = 0

    if (!fci.st_recusa_cadastro) {
        // Checagem de cabeçalho
        if (!fci.cns_prof) {
            missing_fields += 1
            invalidations.push("CNS do Profissional")
        }

        if (!fci.cbo_prof) {
            missing_fields += 1
            invalidations.push("CBO do Profissional")
        }

        if (!fci.nu_cnes) {
            missing_fields += 1
            invalidations.push("Número do CNES")
        }

        if (!fci.nu_ine) {
            missing_fields += 1
            invalidations.push("Número do INE")
        }

        if (!fci.dt_registro) {
            missing_fields += 1
            invalidations.push("Data do Registro Ausente")
        }


        // Checagem de dados do cidadão
        if (!fci.doc_cid) {
            missing_fields += 1
            invalidations.push("Documento do Cidadão")
        }
        if (!fci.no_cidadao) {
            missing_fields += 1
            invalidations.push("Nome do Cidadão")
        }
        if (!fci.dt_nascimento) {
            missing_fields += 1
            invalidations.push("Data de Nascimento Cidadão")
        }
        if (!fci.nu_micro_area) {
            missing_fields += 1
            invalidations.push("Micro Area Ausente")
        }
        if (fci.ds_sexo == null) {
            missing_fields += 1
            invalidations.push("Tipo Sexo Ausente")
        }

        // Checagem de responsável familiar
        if (fci.st_responsavel_familiar == null) {
            missing_fields += 1
            invalidations.push("Responsavel Familiar Ausente")
        }
        if (!fci.st_responsavel_familiar) {
            fields += 2
            if (!fci.doc_resp) {
                missing_fields += 1
                invalidations.push("Documento Responsavel Familiar")
            }
            if (!fci.ds_tipo_parentesco) {
                missing_fields += 1
                invalidations.push("Parentesco Responsavel Familiar")
            }
        }


        // Checagem de raça/cor
        if (!fci.ds_raca_cor) {
            missing_fields += 1
            invalidations.push("Raça/Cor Ausente")
        }
        if (fci.ds_raca_cor === 'Indígena') {
            fields += 1
            if (!fci.no_etnia) {
                missing_fields += 1
                invalidations.push("Etinia não preenchida")
            }
        }


        // Checagem de dados parentesco do Cidadão
        if (fci.st_desconhece_mae == false && !fci.no_mae_cidadao) {
            missing_fields += 1
            invalidations.push("Nome da Mãe Ausente")
        }
        if (fci.st_desconhece_pai == false && !fci.no_pai_cidadao) {
            missing_fields += 1
            invalidations.push("Nome do Pai Ausente")
        }

        // Checagem de dados nacionalidade do Cidadão
        if (fci.no_identificador == null) {
            missing_fields += 1
            invalidations.push("Nacionalidade Ausente")
        }

        if (fci.no_identificador === "BRASILEIRA") {
            fields += 1
            if (!fci.no_municipio && !fci.sg_uf) {
                missing_fields += 1
                invalidations.push("Municipio-UF Nacionalidade Ausente")
            }
        }
        if (fci.no_identificador === "NATURALIZADO") {
            fields += 2
            if (!fci.dt_naturalizacao) {
                missing_fields += 1
                invalidations.push("Data de Naturalização Ausente")
            }
            if (!fci.nu_portaria_naturalizacao) {
                missing_fields += 1
                invalidations.push("Numero da Portaria de Naturalização Ausente")
            }
        }
        if (fci.no_identificador === "ESTRANGEIRO") {
            fields += 2
            if (!fci.no_pais) {
                missing_fields += 1
                invalidations.push("Pais de Nascimento Ausente")
            }
            if (!fci.dt_entrada_brasil) {
                missing_fields += 1
                invalidations.push("Data de Entrada no Brasil Ausente")
            }
        }

        if (!fci.nu_celular_cidadao) {
            missing_fields += 1
            invalidations.push("Telefone Celular Ausente")
        }


        /*// Checagem de ocupação 
        if (!fci.cbo_cidadao) {
            faltantes += 1
            invalidacoes.push("Ocupação Ausente")
        }*/


        // Checagem de grau escolaridade e vínculo trabalhista.
        if (fci.st_frequenta_creche == null) {
            missing_fields += 1
            invalidations.push("Frequenta Creche Ausente")
        }
        if (!fci.ds_dim_tipo_escolaridade) {
            missing_fields += 1
            invalidations.push("Grau Escolaridade Ausente")
        }
        if (!fci.ds_dim_situacao_trabalho) {
            missing_fields += 1
            invalidations.push("Situação Trabalhista Ausente")
        }

        // Checagem crianca 0 a 9 anos, com quem fica.
        if (checkAge(fci.dt_nascimento) &&
            (!fci.st_respons_crianca_adulto_resp
                && !fci.st_respons_crianca_outra_crian
                && !fci.st_respons_crianca_adolescente
                && !fci.st_respons_crianca_sozinha
                && !fci.st_respons_crianca_creche
                && !fci.st_respons_crianca_outro)) {
            missing_fields += 1
            invalidations.push("Criancas de 0 a 9 Anos, com quem fica Ausente")
        }


        // Informações de Participação e plano de saúde.
        if (fci.st_frequenta_cuidador == null) {
            missing_fields += 1
            invalidations.push("Frequenta Cuidador Ausente")
        }

        if (fci.st_participa_grupo_comunitario == null) {
            missing_fields += 1
            invalidations.push("Participa de Grupo Comunitario Ausente")
        }

        if (fci.st_plano_saude_privado == null) {
            missing_fields += 1
            invalidations.push("Plano de Saúde Privado Ausente")
        }

        // Informações de Participação de comunidade tradicional.
        if (fci.st_comunidade_tradicional == null) {
            missing_fields += 1
            invalidations.push("Participa de Povo ou Comunidade Tradicional Ausente")
        }

        if (fci.st_comunidade_tradicional) {
            fields += 1
            if (!fci.ds_povo_comunidade_tradicional) {
                missing_fields += 1
                invalidations.push("Tipo de Povo ou Comunidade Tradicional Ausente")
            }
        }


        // Informações de Orientação Sexual.
        if (fci.st_informar_orientacao_sexual == null) {
            missing_fields += 1
            invalidations.push("Informar Orientação Sexual Ausente")
        }

        if (fci.st_informar_orientacao_sexual) {
            fields += 1
            if (!fci.ds_dim_tipo_orientacao_sexual) {
                missing_fields += 1
                invalidations.push("Tipo Orientação Sexual Ausente")
            }
        }

        // Informações de Identidade Gênero.
        if (fci.st_informar_identidade_genero == null) {
            missing_fields += 1
            invalidations.push("Informar Identidade de Gênero Ausente")
        }
        if (fci.st_informar_identidade_genero) {
            fields += 1
            if (!fci.ds_identidade_genero) {
                missing_fields += 1
                invalidations.push("Tipo Identidade de Gênero Ausente")
            }
        }

        // Informações de Deficiência.
        if (fci.st_deficiencia == null) {
            missing_fields += 1
            invalidations.push("Informar Deficiencia Ausente")
        }
        if (fci.st_deficiencia &&
            (!fci.st_defi_auditiva
                && !fci.st_defi_intelectual_cognitiva
                && !fci.st_defi_visual
                && !fci.st_defi_fisica
                && !fci.st_defi_outra)) {
            missing_fields += 1
            invalidations.push("Tipo Deficiencia Ausente")
        }

        if (fci.st_alimentos_acab_sem_dinheiro == null) {
            missing_fields += 1
            invalidations.push("TRIA 1 Ausente")
        }

        if (fci.st_comeu_que_tinha_dnheir_acab == null) {
            missing_fields += 1
            invalidations.push("TRIA 2 Ausente")
        }

        // Informações de Gestante.
        if (fci.ds_sexo === 'Feminino') {
            fields += 1
            if (fci.st_gestante == null) {
                missing_fields += 1
                invalidations.push("Informar Gestação Ausente")
            }
            if (fci.st_gestante) {
                fields += 1
                if (!fci.no_maternidade_referencia) {
                    missing_fields += 1
                    invalidations.push("Maternidade de Referencia Ausente")
                }

            }
        }

        //CONDIÇÕES DE SAÚDE
        if (fci.ds_dim_tipo_condicao_peso == null) {
            missing_fields += 1
            invalidations.push("Tipo Condição de Peso Ausente")
        }
        if (fci.st_fumante == null) {
            missing_fields += 1
            invalidations.push("Informar se fumante Ausente")
        }
        if (fci.st_alcool == null) {
            missing_fields += 1
            invalidations.push("Informar se usa Alcool Ausente")
        }
        if (fci.st_outra_droga == null) {
            missing_fields += 1
            invalidations.push("Informar se usa Outra Droga Ausente")
        }
        if (fci.st_hipertensao_arterial == null) {
            missing_fields += 1
            invalidations.push("Informar se hipertenso Ausente")
        }
        if (fci.st_diabete == null) {
            missing_fields += 1
            invalidations.push("Informar se diabético Ausente")
        }
        if (fci.st_avc == null) {
            missing_fields += 1
            invalidations.push("Informar se já teve AVC Ausente")
        }
        if (fci.st_infarto == null) {
            missing_fields += 1
            invalidations.push("Informar se já teve Infarto Ausente")
        }
        if (fci.st_hanseniase == null) {
            missing_fields += 1
            invalidations.push("Informar se tem Hanseniase Ausente")
        }
        if (fci.st_tuberculose == null) {
            missing_fields += 1
            invalidations.push("Informar se tem Tuberculose Ausente")
        }
        if (fci.st_cancer == null) {
            missing_fields += 1
            invalidations.push("Informar se tem Cancer Ausente")
        }
        if (fci.st_tratamento_psiquiatra == null) {
            missing_fields += 1
            invalidations.push("Informar se tem diagnostico psiquiatrico Ausente")
        }
        if (fci.st_acamado == null) {
            missing_fields += 1
            invalidations.push("Informar se está Acamado Ausente")
        }

        if (fci.st_internacao_12 == null) {
            missing_fields += 1
            invalidations.push("Informar internação nos ultimos 12 meses Ausente")
        }
        if (fci.st_internacao_12) {
            fields += 1
            if (!fci.no_causa_internacao12) {
                missing_fields += 1
                invalidations.push("Causa da Internação Ausente")
            }
        }

        if (fci.st_usa_planta_medicinal == null) {
            missing_fields += 1
            invalidations.push("Informar se usa plantas medicinais Ausente")
        }

        if (fci.st_usa_planta_medicinal) {
            fields += 1
            if (!fci.no_plantas_medicinais) {
                missing_fields += 1
                invalidations.push("Nome das Plantas Medicinais Ausente")
            }
        }

        if (fci.st_doenca_cardiaca == null) {
            missing_fields += 1
            invalidations.push("Informar se tem doença cardiaca Ausente")
        }
        if (fci.st_doenca_cardiaca) {
            fields += 1
            if (!fci.st_doenca_card_insuficiencia && !fci.st_doenca_card_outro && !fci.st_doenca_card_n_sabe) {
                missing_fields += 1
                invalidations.push("Tipo de Doença Cardiaca Ausente")
            }
        }

        if (fci.st_problema_rins == null) {
            missing_fields += 1
            invalidations.push("Informar se tem doença renal Ausente")
        }

        if (fci.st_problema_rins) {
            fields += 1
            if (!fci.st_problema_rins_insuficiencia && !fci.st_problema_rins_outro && !fci.st_problema_rins_nao_sabe) {
                missing_fields += 1
                invalidations.push("Tipo de Doença Renal Ausente")
            }
        }

        if (fci.st_doenca_respiratoria == null) {
            missing_fields += 1
            invalidations.push("Informar Doença Respiratória Ausente")
        }
        if (fci.st_doenca_respiratoria) {
            fields += 1
            if (!fci.st_doenca_respira_asma && !fci.st_doenca_respira_dpoc_enfisem && !fci.st_doenca_respira_outra && !fci.st_doenca_respira_n_sabe) {
                invalidations.push("Tipo de Doença Respiratória Ausente")
            }
        }

        if (fci.st_morador_rua == null) {
            missing_fields += 1
            invalidations.push("Informar se é morador de rua Ausente")
        }

        if (fci.st_morador_rua) {
            fields += 8
            if (!fci.ds_dim_tempo_morador_rua) {
                missing_fields += 1
                invalidations.push("Tempo que mora na rua Ausente")
            }

            if (fci.st_recebe_beneficio == null) {
                missing_fields += 1
                invalidations.push("Informar se recebe benefício Ausente")
            }

            if (fci.st_referencia_familiar == null) {
                missing_fields += 1
                invalidations.push("Informar referencia familiar Ausente")
            }

            if (!fci.ds_dim_frequencia_alimentacao) {
                missing_fields += 1
                invalidations.push("Frequencia de aliemntação Ausente")
            }

            if (!fci.st_orig_alimen_restaurante_pop && !fci.st_orig_alimen_doacao_rest && !fci.st_orig_alimen_outros && !fci.st_orig_alimen_doacao_reli && !fci.st_orig_alimen_doacao_popular) {
                missing_fields += 1
                invalidations.push("Origem de alimentação Ausente")
            }

            if (fci.st_acompanhado_instituicao == null) {
                missing_fields += 1
                invalidations.push("Informar se acompanhado por instituição Ausente")
            }
            if (fci.st_acompanhado_instituicao) {
                fields += 1
                if (!fci.no_acompanhado_instituicao) {
                    missing_fields += 1
                    invalidations.push("Nome da Intituição Ausente")
                }
            }

            if (fci.st_visita_familiar_frequente == null) {
                missing_fields += 1
                invalidations.push("Informar se recebe visita familiar frequente Ausente")
            }
            if (fci.st_visita_familiar_frequente) {
                fields += 1
                if (!fci.no_visita_familiar_parentesco) {
                    missing_fields += 1
                    invalidations.push("Parentesco familiar frequente Ausente")
                }
            }

            if (fci.st_higiene_pessoal_acesso == null) {
                missing_fields += 1
                invalidations.push("Informar se tem acesso a higiene Ausente")
            }
            if (fci.st_higiene_pessoal_acesso) {
                fields += 1
                if (!fci.st_hig_pess_banho && !fci.st_hig_pess_sanitario && !fci.st_hig_pess_higiene_bucal && !fci.st_hig_pess_outros) {
                    missing_fields += 1
                    invalidations.push("Tipo de higiene Ausente")
                }
            }
        }

        return {
            erros: invalidations,
            status: Math.round((fields - invalidations.length) / fields * 100)
        }
    }

    return {
        erros: ['Recusa Cadastro'],
        status: 100
    };
}
