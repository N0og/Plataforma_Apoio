import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

type jsonIps = {
    uf: string,
    municipio: string,
    instalacao: string,
    ip: string,
    user: string,
    password: string,
    id_instalacoes_pec: number
}

@Entity("tb_ips")
export class IPs{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type:'jsonb'})
    dados: jsonIps
}