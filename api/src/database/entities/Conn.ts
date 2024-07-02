import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

type jsonConneSUS = {
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

type jsonConnEAS = {
    uf: string,
    municipio: string,
    db_name_eas: string | null,
    id_instalacao_eas: number | null
}

@Entity("tb_conn_esus")
export class ConneSUS{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type:'jsonb'})
    dados: jsonConneSUS
}

@Entity("tb_conn_eas")
export class ConnEAS{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type:'jsonb'})
    dados: jsonConnEAS
}