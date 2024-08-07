import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tb_esus_imunos')
export class Imunobiologico{
    @PrimaryGeneratedColumn()
    id_imunobiologico: number

    @Column()
    co_imuno_esus: number

    @Column()
    sg_imuno_esus: string

    @Column()
    no_imuno_esus: string

}