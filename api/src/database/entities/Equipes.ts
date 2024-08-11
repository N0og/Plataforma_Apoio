import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Unidade } from ".";

@Entity('tb_equipes_esus')
export class Equipe {
    @PrimaryGeneratedColumn()
    id_equipe: number

    @Column({ type: "varchar", length: "100" })
    no_equipe: string

    @Column({ type: "varchar", length: "50", nullable: true})
    nu_ine: string

    @Column()
    tp_equipe: string

    @ManyToOne(() => Unidade, (unidade) => unidade.equipes)
    @JoinColumn({name:"Unidade_id"})
    unidade: Unidade
}