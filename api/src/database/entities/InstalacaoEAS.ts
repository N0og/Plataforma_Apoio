import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Municipio } from "./Municipios";

@Entity('tb_instalacoes_eas')
export class Instalacao_EAS {
    @PrimaryGeneratedColumn()
    id_instalacao_eas: number

    @Column()
    name_db: string

    @Column({nullable: true})
    user_eas: string

    @Column({nullable: true})
    password_eas: string

    @ManyToOne(() => Municipio, (municipio) => municipio.instalacoes)
    @JoinColumn({name:"municipio_id"})
    municipio: Municipio


}