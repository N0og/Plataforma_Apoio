import { CheckedFCI, IATT_CPF } from "../../../interfaces/ICompletude";
import checkBirthday from "../CheckBirthday";



export default function checkFCI(fci: IATT_CPF): CheckedFCI {
    let invalidacoes: Array<string> = []

    let campos = 50
    let faltantes = 0

    if (!fci.st_recusa_cadastro) {
        // Checagem de cabeçalho
        if (!fci.cns_prof) {
            faltantes += 1
            invalidacoes.push("CNS do Profissional")
        }

        if (!fci.cbo_prof) {
            faltantes += 1
            invalidacoes.push("CBO do Profissional")
        }

        if (!fci.nu_cnes) {
            faltantes += 1
            invalidacoes.push("Número do CNES")
        }

        if (!fci.nu_ine) {
            faltantes += 1
            invalidacoes.push("Número do INE")
        }

        if (!fci.dt_registro) {
            faltantes += 1
            invalidacoes.push("Data do Registro Ausente")
        }


        // Checagem de dados do cidadão
        if (!fci.doc_cid) {
            faltantes += 1
            invalidacoes.push("Documento do Cidadão")
        }
        if (!fci.no_cidadao) {
            faltantes += 1
            invalidacoes.push("Nome do Cidadão")
        }
        if (!fci.dt_nascimento) {
            faltantes += 1
            invalidacoes.push("Data de Nascimento Cidadão")
        }
        if (!fci.nu_micro_area) {
            faltantes += 1
            invalidacoes.push("Micro Area Ausente")
        }
        if (!fci.ds_sexo) {
            faltantes += 1
            invalidacoes.push("Tipo Sexo Ausente")
        }

        // Checagem de responsável familiar
        if (fci.st_responsavel_familiar == null) {
            faltantes += 1
            invalidacoes.push("Responsavel Familiar Ausente")
        }
        if (!fci.st_responsavel_familiar) {
            campos += 2
            if (!fci.doc_cid) {
                faltantes += 1
                invalidacoes.push("Documento Responsavel Familiar")
            }
            if (!fci.ds_tipo_parentesco) {
                faltantes += 1
                invalidacoes.push("Parentesco Responsavel Familiar")
            }
        }


        // Checagem de raça/cor
        if (!fci.ds_raca_cor) {
            faltantes += 1
            invalidacoes.push("Raça/Cor Ausente")
        }
        if (fci.ds_raca_cor === 'Indígena') {
            campos += 1
            if (!fci.no_etnia) {
                faltantes += 1
                invalidacoes.push("Etinia não preenchida")
            }
        }


        // Checagem de dados parentesco do Cidadão
        if (fci.st_desconhece_mae == false && !fci.no_mae_cidadao) {
            faltantes += 1
            invalidacoes.push("Nome da Mãe Ausente")
        }
        if (fci.st_desconhece_pai == false && !fci.no_pai_cidadao) {
            faltantes += 1
            invalidacoes.push("Nome do Pai Ausente")
        }

        // Checagem de dados nacionalidade do Cidadão
        if (fci.no_identificador == null) {
            faltantes += 1
            invalidacoes.push("Nacionalidade Ausente")
        }

        if (fci.no_identificador === "BRASILEIRA") {
            campos += 1
            if (!fci.no_municipio && !fci.sg_uf) {
                faltantes += 1
                invalidacoes.push("Municipio-UF Nacionalidade Ausente")
            }
        }
        if (fci.no_identificador === "NATURALIZADO") {
            campos += 2
            if (!fci.dt_naturalizacao) {
                faltantes += 1
                invalidacoes.push("Data de Naturalização Ausente")
            }
            if (!fci.nu_portaria_naturalizacao) {
                faltantes += 1
                invalidacoes.push("Numero da Portaria de Naturalização Ausente")
            }
        }
        if (fci.no_identificador === "ESTRANGEIRO") {
            campos += 2
            if (!fci.no_pais) {
                faltantes += 1
                invalidacoes.push("Pais de Nascimento Ausente")
            }
            if (!fci.dt_entrada_brasil) {
                faltantes += 1
                invalidacoes.push("Data de Entrada no Brasil Ausente")
            }
        }

        if (!fci.nu_celular_cidadao) {
            faltantes += 1
            invalidacoes.push("Telefone Celular Ausente")
        }


        // Checagem de ocupação 
        if (!fci.cbo_cidadao) {
            faltantes += 1
            invalidacoes.push("Ocupação Ausente")
        }


        // Checagem de grau escolaridade e vínculo trabalhista.
        if (fci.st_frequenta_creche == null) {
            faltantes += 1
            invalidacoes.push("Frequenta Creche Ausente")
        }
        if (!fci.ds_dim_tipo_escolaridade) {
            faltantes += 1
            invalidacoes.push("Grau Escolaridade Ausente")
        }
        if (!fci.ds_dim_situacao_trabalho) {
            faltantes += 1
            invalidacoes.push("Situação Trabalhista Ausente")
        }

        // Checagem crianca 0 a 9 anos, com quem fica.
        if (checkBirthday(fci.dt_nascimento) &&
            (!fci.st_respons_crianca_adulto_resp
                && !fci.st_respons_crianca_outra_crian
                && !fci.st_respons_crianca_adolescente
                && !fci.st_respons_crianca_sozinha
                && !fci.st_respons_crianca_creche
                && !fci.st_respons_crianca_outro)) {
            faltantes += 1
            invalidacoes.push("Criancas de 0 a 9 Anos, com quem fica Ausente")
        }


        // Informações de Participação e plano de saúde.
        if (fci.st_frequenta_cuidador == null) {
            faltantes += 1
            invalidacoes.push("Frequenta Cuidador Ausente")
        }

        if (fci.st_participa_grupo_comunitario == null) {
            faltantes += 1
            invalidacoes.push("Participa de Grupo Comunitario Ausente")
        }

        if (fci.st_plano_saude_privado == null) {
            faltantes += 1
            invalidacoes.push("Plano de Saúde Privado Ausente")
        }

        // Informações de Participação de comunidade tradicional.
        if (fci.st_comunidade_tradicional == null) {
            faltantes += 1
            invalidacoes.push("Participa de Povo ou Comunidade Tradicional Ausente")
        }

        if (fci.st_comunidade_tradicional) {
            campos += 1
            if (!fci.ds_povo_comunidade_tradicional) {
                faltantes += 1
                invalidacoes.push("Tipo de Povo ou Comunidade Tradicional Ausente")
            }
        }


        // Informações de Orientação Sexual.
        if (fci.st_informar_orientacao_sexual == null) {
            faltantes += 1
            invalidacoes.push("Informar Orientação Sexual Ausente")
        }

        if (fci.st_informar_orientacao_sexual) {
            campos += 1
            if (!fci.ds_dim_tipo_orientacao_sexual) {
                faltantes += 1
                invalidacoes.push("Tipo Orientação Sexual Ausente")
            }
        }

        // Informações de Identidade Gênero.
        if (fci.st_informar_identidade_genero == null) {
            faltantes += 1
            invalidacoes.push("Informar Identidade de Gênero Ausente")
        }
        if (fci.st_informar_identidade_genero) {
            campos += 1
            if (!fci.ds_identidade_genero) {
                faltantes += 1
                invalidacoes.push("Tipo Identidade de Gênero Ausente")
            }
        }

        // Informações de Deficiência.
        if (fci.st_deficiencia == null) {
            faltantes += 1
            invalidacoes.push("Informar Deficiencia Ausente")
        }
        if (fci.st_deficiencia &&
            (!fci.st_defi_auditiva
                && !fci.st_defi_intelectual_cognitiva
                && !fci.st_defi_visual
                && !fci.st_defi_fisica
                && !fci.st_defi_outra)) {
            faltantes += 1
            invalidacoes.push("Tipo Deficiencia Ausente")
        }

        if (fci.st_alimentos_acab_sem_dinheiro == null){ 
            faltantes += 1
            invalidacoes.push("TRIA 1 Ausente")
        }

        if (fci.st_comeu_que_tinha_dnheir_acab == null){
            faltantes +=1
            invalidacoes.push("TRIA 2 Ausente")
        }

        // Informações de Gestante.
        if (fci.ds_sexo === 'Feminino') {
            campos += 1
            if (fci.st_gestante == null) {
                faltantes += 1
                invalidacoes.push("Informar Gestação Ausente")
            }
            if (fci.st_gestante) {
                campos += 1
                if (!fci.no_maternidade_referencia) {
                    faltantes += 1
                    invalidacoes.push("Maternidade de Referencia Ausente")
                }

            }
        }

        //CONDIÇÕES DE SAÚDE
        if (fci.ds_dim_tipo_condicao_peso == null) {
            faltantes += 1
            invalidacoes.push("Tipo Condição de Peso Ausente")
        }
        if (fci.st_fumante == null) {
            faltantes += 1
            invalidacoes.push("Informar se fumante Ausente")
        }
        if (fci.st_alcool == null) {
            faltantes += 1
            invalidacoes.push("Informar se usa Alcool Ausente")
        }
        if (fci.st_outra_droga == null) {
            faltantes += 1
            invalidacoes.push("Informar se usa Outra Droga Ausente")
        }
        if (fci.st_hipertensao_arterial == null) {
            faltantes += 1
            invalidacoes.push("Informar se hipertenso Ausente")
        }
        if (fci.st_diabete == null) {
            faltantes += 1
            invalidacoes.push("Informar se diabético Ausente")
        }
        if (fci.st_avc == null) {
            faltantes += 1
            invalidacoes.push("Informar se já teve AVC Ausente")
        }
        if (fci.st_infarto == null) {
            faltantes += 1
            invalidacoes.push("Informar se já teve Infarto Ausente")
        }
        if (fci.st_hanseniase == null) {
            faltantes += 1
            invalidacoes.push("Informar se tem Hanseniase Ausente")
        }
        if (fci.st_tuberculose == null) {
            faltantes += 1
            invalidacoes.push("Informar se tem Tuberculose Ausente")
        }
        if (fci.st_cancer == null) {
            faltantes += 1
            invalidacoes.push("Informar se tem Cancer Ausente")
        }
        if (fci.st_tratamento_psiquiatra == null) {
            faltantes += 1
            invalidacoes.push("Informar se tem diagnostico psiquiatrico Ausente")
        }
        if (fci.st_acamado == null) {
            faltantes += 1
            invalidacoes.push("Informar se está Acamado Ausente")
        }

        if (fci.st_internacao_12 == null) {
            faltantes += 1
            invalidacoes.push("Informar internação nos ultimos 12 meses Ausente")
        }
        if (fci.st_internacao_12) {
            campos += 1
            if (!fci.no_causa_internacao12) {
                faltantes += 1
                invalidacoes.push("Causa da Internação Ausente")
            }
        }

        if (fci.st_usa_planta_medicinal == null) {
            faltantes += 1
            invalidacoes.push("Informar se usa plantas medicinais Ausente")
        }

        if (fci.st_usa_planta_medicinal) {
            campos += 1
            if (!fci.no_plantas_medicinais) {
                faltantes += 1
                invalidacoes.push("Nome das Plantas Medicinais Ausente")
            }
        }

        if (fci.st_doenca_cardiaca == null) {
            faltantes += 1
            invalidacoes.push("Informar se tem doença cardiaca Ausente")
        }
        if (fci.st_doenca_cardiaca) {
            campos += 1
            if (!fci.st_doenca_card_insuficiencia && !fci.st_doenca_card_outro && !fci.st_doenca_card_n_sabe) {
                faltantes += 1
                invalidacoes.push("Tipo de Doença Cardiaca Ausente")
            }
        }

        if (fci.st_problema_rins == null) {
            faltantes += 1
            invalidacoes.push("Informar se tem doença renal Ausente")
        }

        if (fci.st_problema_rins) {
            campos += 1
            if (!fci.st_problema_rins_insuficiencia && !fci.st_problema_rins_outro && !fci.st_problema_rins_nao_sabe) {
                faltantes += 1
                invalidacoes.push("Tipo de Doença Renal Ausente")
            }
        }

        if (fci.st_doenca_respiratoria == null) {
            faltantes += 1
            invalidacoes.push("Informar Doença Respiratória Ausente")
        }
        if (fci.st_doenca_respiratoria) {
            campos += 1
            if (!fci.st_doenca_respira_asma && !fci.st_doenca_respira_dpoc_enfisem && !fci.st_doenca_respira_outra && !fci.st_doenca_respira_n_sabe) {
                invalidacoes.push("Tipo de Doença Respiratória Ausente")
            }
        }

        if (fci.st_morador_rua == null) {
            faltantes += 1
            invalidacoes.push("Informar se é morador de rua Ausente")
        }

        if (fci.st_morador_rua) {
            campos += 8
            if (!fci.ds_dim_tempo_morador_rua) {
                faltantes += 1
                invalidacoes.push("Tempo que mora na rua Ausente")
            }

            if (fci.st_recebe_beneficio == null) {
                faltantes += 1
                invalidacoes.push("Informar se recebe benefício Ausente")
            }

            if (fci.st_referencia_familiar == null) {
                faltantes += 1
                invalidacoes.push("Informar referencia familiar Ausente")
            }

            if (!fci.ds_dim_frequencia_alimentacao) {
                faltantes += 1
                invalidacoes.push("Frequencia de aliemntação Ausente")
            }

            if (!fci.st_orig_alimen_restaurante_pop && !fci.st_orig_alimen_doacao_rest && !fci.st_orig_alimen_outros && !fci.st_orig_alimen_doacao_reli && !fci.st_orig_alimen_doacao_popular) {
                faltantes += 1
                invalidacoes.push("Origem de alimentação Ausente")
            }

            if (fci.st_acompanhado_instituicao == null) {
                faltantes += 1
                invalidacoes.push("Informar se acompanhado por instituição Ausente")
            }
            if (fci.st_acompanhado_instituicao) {
                campos += 1
                if (!fci.no_acompanhado_instituicao) {
                    faltantes += 1
                    invalidacoes.push("Nome da Intituição Ausente")
                }
            }

            if (fci.st_visita_familiar_frequente == null) {
                faltantes += 1
                invalidacoes.push("Informar se recebe visita familiar frequente Ausente")
            }
            if (fci.st_visita_familiar_frequente) {
                campos += 1
                if (!fci.no_visita_familiar_parentesco) {
                    faltantes += 1
                    invalidacoes.push("Parentesco familiar frequente Ausente")
                }
            }

            if (fci.st_higiene_pessoal_acesso == null) {
                faltantes += 1
                invalidacoes.push("Informar se tem acesso a higiene Ausente")
            }
            if (fci.st_higiene_pessoal_acesso) {
                campos += 1
                if (!fci.st_hig_pess_banho && !fci.st_hig_pess_sanitario && !fci.st_hig_pess_higiene_bucal && !fci.st_hig_pess_outros) {
                    faltantes += 1
                    invalidacoes.push("Tipo de higiene Ausente")
                }
            }
        }

        return {
            erros: invalidacoes,
            status: Math.round((campos-invalidacoes.length)/campos*100)
        }
    }

    return {
        erros: ['Recusa Cadastro'],
        status: 100
    };
}
