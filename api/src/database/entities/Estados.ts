import { Column, Entity, OneToMany,PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Municipio } from "./Municipios";

@Entity('tb_uf')
export class Estado{
    @PrimaryGeneratedColumn()
    id_uf:number

    @Column({type:"varchar", length: "100", nullable: true})
    no_uf: string

    @Column({type:"char", length: "2" , nullable: false})
    sg_uf:string

    @OneToMany(() => Municipio, (municipio) => municipio.uf)
    municipios: Municipio[]

}