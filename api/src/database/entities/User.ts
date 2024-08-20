import { 
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Entity
} from "typeorm";

@Entity('tb_users')
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({type: "varchar", length: 255, nullable:false})
    name: string

    @Column({type: "char", length: 11, nullable:true})
    cpf: string

    @Column({type: "varchar", length: 100, nullable:false})
    email: string

    @Column({type: "varchar", length: 255, nullable:false})
    password: string

    @CreateDateColumn({type:"timestamp", nullable:false})
    created_at: Date

    @Column({type: "boolean", nullable:false, default:0})
    authtwofactors: Boolean
}