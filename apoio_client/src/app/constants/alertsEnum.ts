export enum Alerts{
    SUCESS = 'Sucesso.',
    LOADING = "Carregando...",
    EXTRACTING = "Extraindo...",
    DOWNLOAD_ERROR = "Falha na tentativa de download.",
    CITY_ERROR = "Falha ao obter municípios."
}

export enum CITY{
    EXCESS = "Selecione apenas um município para busca.",
    LESS = "Selecione um municipio para continuar.",
}

export enum DATA{
    LESS = "Selecione um período no filtro de data."
}

export enum DBFILTER{
    EXCESS = "Selecione apenas uma Fonte de Extração.",
    LESS = "Selecione pelo menos uma Fonte de Extração."
} 

export enum CONDITION{
    EXCESS = "Selecione menos condições para extração.",
    LESS = "Selecione pelo menos uma condição para extração."
}