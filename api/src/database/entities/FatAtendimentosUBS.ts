import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IAtendimentosUBS } from "../../interfaces/ReportsInterfaces/IProdutividadeUBS";


@Entity('tb_fat_atendimento_ubs')
export default class AtendimentoUBS {

    @PrimaryGeneratedColumn()
    co_seq_atendimento_ubs: number;

    @Column({type:"jsonb"})
    dados: IAtendimentosUBS;

}