import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Instalacao_eSUS } from "./InstalacaoeSUS";
import { Equipe } from "./Equipes";

@Entity('tb_unidades_esus')
export class Unidade {
    @PrimaryGeneratedColumn()
    id_unidade: number

    @Column({ type: "varchar", length: "100" })
    no_estabelecimento: string

    @Column({ type: "varchar", length: "50", nullable: true})
    nu_cnes: string

    @ManyToOne(() => Instalacao_eSUS, (instalacao) => instalacao.unidades)
    @JoinColumn({name:"instalacao_id"})
    instalacao: Instalacao_eSUS

    @OneToMany(() => Equipe, (equipe) => equipe.unidade)
    equipes: Equipe[]
}