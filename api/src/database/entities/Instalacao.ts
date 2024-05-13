import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Municipio } from "./Municipios";

@Entity('tb_instalacoes_esus')
export class Instalacao {
    @PrimaryGeneratedColumn()
    id_instalacoes_pec: number

    @Column()
    ip_address: string

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