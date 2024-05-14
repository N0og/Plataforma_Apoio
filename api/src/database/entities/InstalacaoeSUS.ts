import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Municipio } from "./Municipios";

@Entity('tb_instalacoes_esus')
export class Instalacao_eSUS {
    @PrimaryGeneratedColumn()
    id_instalacao_esus: number

    @Column()
    ip_address: string

    @Column()
    port_db: number

    @Column()
    user_db: string

    @Column()
    password_db: string

    @Column()
    name_db: string

    @Column()
    no_instalacao: string

    @Column({nullable: true})
    user_pec: string

    @Column({nullable: true})
    password_pec: string

    @ManyToOne(() => Municipio, (municipio) => municipio.instalacoes)
    @JoinColumn({name:"municipio_id"})
    municipio: Municipio


}