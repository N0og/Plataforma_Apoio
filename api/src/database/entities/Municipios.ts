import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Estado } from "./Estados";
import { Instalacao_eSUS } from "./InstalacaoeSUS";

@Entity('tb_municipio')
export class Municipio {
    @PrimaryGeneratedColumn()
    id_municipio: number

    @Column({ type: "varchar", length: "100" })
    no_municipio: string

    @Column({ type: "varchar", length: "50", nullable: true})
    nu_ibge: string

    @ManyToOne(() => Estado, (estado) => estado.municipios)
    @JoinColumn({name:"estado_id"})
    uf: Estado

    @OneToMany(() => Instalacao_eSUS, (instalacao) => instalacao.municipio)
    instalacoes: Instalacao_eSUS[]
}