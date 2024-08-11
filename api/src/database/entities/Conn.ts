import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IConnEAS, IConneSUS } from "../../interfaces";

@Entity("tb_conn_esus")
export class ConneSUS{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type:'jsonb'})
    dados: IConneSUS
}

@Entity("tb_conn_eas")
export class ConnEAS{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type:'jsonb'})
    dados: IConnEAS
}