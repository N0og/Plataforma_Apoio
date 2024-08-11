export interface IConneSUS {
    uf: string,
    municipio: string,
    instalacao_esus: string | null,
    ip_esus: string | null,
    port_esus: number | null,
    db_name_esus: string | null,
    db_user_esus: string | null,
    db_password_esus: string | null
    id_instalacao_esus: number | null
}

export interface IConnEAS {
    uf: string,
    municipio: string,
    db_name_eas: string | null,
    id_instalacao_eas: number | null
}