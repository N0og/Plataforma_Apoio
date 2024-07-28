import { Databases } from "."

export const PRIORITY_VISITS_DEFAULT = {
    "GESTANTES": { value: "gestantes", condition: false },
    "IDOSOS": { value: "idosos", condition: false },
    "CRIANÇAS": { value: "criancas", condition: false },
    "HIPERTENSOS": { value: "hipertensos", condition: false },
    "DIABÉTICOS": { value: "diabeticos", condition: false },
    "ACAMADOS": { value: "domiciliados_acamados", condition: false },
    "DPOC": { value: "dpoc", condition: false },
    "OUTRAS DOENÇAS": { value: "outras_doencas", condition: false },
    "SINTOMAS RESPIRATÓRIOS": { value: "sintomas_respiratorio", condition: false },
    "VULNERÁVEL": { value: "vulnerabilidade_social", condition: false },
    "ALCOÓLATRAS": { value: "alcoolatras", condition: false },
    "PUÉRPERAS": { value: "puerperas", condition: false },
    "DESNUTRIDOS": { value: "desnutridos", condition: false },
    "PORTADOR DE CÂNCER": { value: "cancer", condition: false },
    "COM HANSENÍASE": { value: "hanseniase", condition: false },
    "TABAGISTAS": { value: "tabagistas", condition: false },
    "BENEFICIÁRIO BOLSA": { value: "bolsa_familia", condition: false },
    "USA OUTRAS DROGAS": { value: "outras_drogas", condition: false },
    "RECEM NASCIDOS": { value: "recem_nascido", condition: false },
    "REABILITAÇÃO OU DEFICIENTE": { value: "reabilitacao_deficiencia", condition: false },
    "ASMÁTICOS": { value: "asmaticos", condition: false },
    "OUTRAS DOENÇAS CRÔNICAS": { value: "outras_doencas_cronicas", condition: false },
    "TUBERCULOSE": { value: "tuberculose", condition: false },
    "SAUDE MENTAL": { value: "saude_mental", condition: false },
    "DIARREIRA": { value: "diarreira", condition: false },
    "EGRESSO": { value: "egresso_internacao", condition: false }
}

export const DATABASES_DEFAULT = {
    'eSUS': { value: Databases.PSQL, condition: false },
    'AtendSaúde': { value: Databases.MDB, condition: false }
} 