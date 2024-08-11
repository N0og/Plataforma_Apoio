import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Municipio, Unidade } from ".";

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

    @Column({type:"date", nullable:true})
    date_process:Date

    @Column({nullable: true})
    sucess_process: string

    @ManyToOne(() => Municipio, (municipio) => municipio.instalacoes)
    @JoinColumn({name:"municipio_id"})
    municipio: Municipio

    @OneToMany(()=>Unidade, (unidade)=> unidade.instalacao)
    unidades: Unidade[]


}