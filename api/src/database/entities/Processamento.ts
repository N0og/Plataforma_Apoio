import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tb_processamento_dados')
export class Processamento {
    @PrimaryGeneratedColumn()
    id_processamento: number

    @CreateDateColumn()
    dt_processamento: Date

    @Column()
    nu_instalacoes_processadas: number
}