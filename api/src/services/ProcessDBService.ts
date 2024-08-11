import {
    equipeRepository,
    ImunoseSUSRepository,
    instalacaoESUSRepository,
    unidadeRepository
} from "../database/repository/API_DB_Repositorys"
import { DynamicParameters } from "../utils"
import { ConneSUS } from "../database/entities"
import { formatInTimeZone } from 'date-fns-tz'
import { ConnectDBs } from "../database/init"
import { ExecuteSQL } from "../database/execute"

export class ProcessDBService {

    private DATA_PROCESSAMENTO: Date
    private conn: ConneSUS

    async execute(DB_TYPE: string, DB_CLIENT: ConnectDBs, REQ_PARAMS: any, conn: ConneSUS) {
        this.DATA_PROCESSAMENTO = new Date(formatInTimeZone(new Date(), 'America/Sao_Paulo', 'yyyy-MM-dd'))
        this.conn = conn;
        if (await this.equipeProcess(DB_TYPE, DB_CLIENT)) {
            instalacaoESUSRepository.update({ id_instalacao_esus: this.conn.dados.id_instalacao_esus! },
                {
                    date_process: this.DATA_PROCESSAMENTO,
                    sucess_process: "Processado com Sucesso."
                })
            return { sucess: 200 }
        }

    }

    async equipeProcess(DB_TYPE: string, DB_CLIENT: ConnectDBs) {

        const DYNAMIC_PARAMETERS = new DynamicParameters()

        const query_equipes = `
            select distinct 
                tdus.no_unidade_saude as no_estabelecimento, 
                tdus.nu_cnes as nu_cnes,
                tde.no_equipe as no_equipe, 
                tde.nu_ine as nu_ine,
                tte.sg_tipo_equipe as tp_equipe
            from tb_fat_atendimento_individual tfai 
                inner join tb_dim_unidade_saude tdus on tdus.co_seq_dim_unidade_saude = tfai.co_dim_unidade_saude_1
                inner join tb_dim_equipe tde on tde.co_seq_dim_equipe = tfai.co_dim_equipe_1 
                inner join tb_equipe te on te.nu_ine = tde.nu_ine 
                inner join tb_tipo_equipe tte on te.tp_equipe = tte.co_seq_tipo_equipe 
            group by 
                tdus.no_unidade_saude,
                tdus.nu_cnes,
                tde.no_equipe,
                tde.nu_ine,
                tte.sg_tipo_equipe
        `

        const equipes = await ExecuteSQL(DB_TYPE, query_equipes, DYNAMIC_PARAMETERS, DB_CLIENT)

        if (!equipes) {
            return false
        }

        for (const equipe of equipes) {

            const UNIDADE = await unidadeRepository.findOneBy({ nu_cnes: equipe.nu_cnes })

            if (!UNIDADE) {
                const new_unidade = await unidadeRepository.insert({
                    no_estabelecimento: equipe.no_estabelecimento,
                    nu_cnes: equipe.nu_cnes,
                    instalacao: { id_instalacao_esus: this.conn.dados.id_instalacao_esus! }
                })

                const EQUIPE = await equipeRepository.findOneBy({ nu_ine: equipe.nu_ine })

                if (!EQUIPE) {
                    await equipeRepository.insert({
                        no_equipe: equipe.no_equipe,
                        nu_ine: equipe.nu_ine,
                        tp_equipe: equipe.tp_equipe,
                        unidade: new_unidade.generatedMaps[0]
                    })
                }
                continue
            }

            const EQUIPE = await equipeRepository.findOneBy({ nu_ine: equipe.nu_ine })

            if (!EQUIPE) {
                await equipeRepository.insert({
                    no_equipe: equipe.no_equipe,
                    nu_ine: equipe.nu_ine,
                    tp_equipe: equipe.tp_equipe,
                    unidade: { id_unidade: UNIDADE.id_unidade }
                })
            }

        }
        return true
    }

    async imunoProcess(DB_TYPE: string, DB_CLIENT: ConnectDBs) {

        const DYNAMIC_PARAMETERS = new DynamicParameters()

        const query_equipes = `
            select * from tb_imunobiologico ti 
        `

        const imunobiologicos = await ExecuteSQL(DB_TYPE, query_equipes, DYNAMIC_PARAMETERS, DB_CLIENT)

        if (!imunobiologicos) {
            return false
        }

        for (const imuno of imunobiologicos) {

            const IMUNO = await ImunoseSUSRepository.findOneBy({ co_imuno_esus: imuno.co_imunobiologico })

            if (!IMUNO) {
                const new_imuno = await ImunoseSUSRepository.insert({
                    co_imuno_esus: imuno.co_imunobiologico,
                    sg_imuno_esus: imuno.sg_imunibiologico,
                    no_imuno_esus: imuno.no_imunobiologico
                })

                continue
            }
        }
        return true


    }
}