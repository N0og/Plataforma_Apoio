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

export const ORAL_CARE_DEFAULT = {
    'ESCOVAÇÃO SUPERVISIONADA': { value: 'escovacao_supervisionada', condition: false },
    'TRATAMENTO CONCLUÍDO': { value: 'tratamento_concluido', condition: false },
    'CURATIVO DE DEMORA': { value: 'curativo_demora', condition: false },
    'APLICAÇÃO TÓPICA DE FLUOR': { value: 'aplicacao_fluor', condition: false },
    'ORIENTAÇÃO DE HIGIENE BUCAL': { value: 'orientacao_saude', condition: false },
    'PROFILAXIA': { value: 'profilaxia', condition: false },
    'EXODONTIA - PERMANENTE': { value: 'exodontia_p', condition: false },
    'EXODONTIA - DECIDUOS': { value: 'exodontia_d', condition: false },
    'TRA / ART': { value: 'tra', condition: false },
} 

export const PROCEDURES_DEFAULT = {
    'CITOLÓGICO': { value: 'citologico', condition: false },
    'RASTREAMENTO DE MICROFLORA': { value: 'rastreamento_cito', condition: false },
    'RASTREAMENTO CÂNCER DE MAMA': { value: 'rastreamento_mama', condition: false },
    'PRÉ-NATAL DO PARCEIRO': { value: 'pre_natal_parceiro', condition: false },
    'VISITA DOMICILIAR': { value: 'visita_domiciliar', condition: false },
   
} 

export const GENERIC_BOOL_DEFAULT = {
    'SIM': {value: 1, condition: false},
    'NÃO': {value: 0, condition: false}
}