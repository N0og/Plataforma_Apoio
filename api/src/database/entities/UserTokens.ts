import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn
} from "typeorm"


@Entity('auth_user_tokens')
export class UserTokens{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    refresh_token: string

    @Column()
    user_id: string

    @Column({type:"timestamp", nullable:false})
    expires_date: Date
    
    @CreateDateColumn({type:"timestamp", nullable:false})
    created_at: Date
}