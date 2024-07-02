import { atendimentoUBSRepository, equipeRepository, instalacaoESUSRepository, processamentoRepository, unidadeRepository } from "../../database/repository/API_DB_Repositorys"
import { queryConvert } from "../../utils/bd/pg/pgPlaceHolders"
import DynamicParameters from "../../utils/reports/DynamicParameters"
import { SQL_PROD_UBS } from "../reportsServices/SQL"
import { Pool as PGPool } from "pg"
import { IAtendimentosUBS } from "../../interfaces/ReportsInterfaces/IProdutividadeUBS"
import { ConneSUS } from "../../database/entities/Conn"
import { formatInTimeZone } from 'date-fns-tz'
import { subDays } from "date-fns"
import { IsNull, Not } from "typeorm"

export default class ProcessDBService {

    private DATA_PROCESSAMENTO = new Date(formatInTimeZone(new Date(), 'America/Sao_Paulo', 'yyyy-MM-dd'))
    DB: PGPool
    conn: ConneSUS

    async execute(DB:PGPool, conn:ConneSUS) {

        console.log()
        this.DB = DB;
        this.conn = conn;
        if (await this.atendimentosUBSProcess()){
            
            instalacaoESUSRepository.update({id_instalacao_esus:this.conn.dados.id_instalacao_esus!},
                {
                    date_process: this.DATA_PROCESSAMENTO,
                    sucess_process: "Processado com Sucesso."
                })
            return {sucess:200}
        }

    }

    async test(){

    }

    async atendimentosUBSProcess() {

        const DYNAMIC_PARAMETERS = new DynamicParameters()
        let QUERY_FILTERS = ""

        const SQL = new SQL_PROD_UBS()

        let SQL_BASE = SQL.getBase()

        const ULTIMO_PROCESSAMENTO_GERAL = await processamentoRepository
            .createQueryBuilder('process')
            .select('MAX(process.dt_processamento)', 'maxDate')
            .getOne();

        const ULTIMO_PROCESSAMENTO_INSTALACAO = await instalacaoESUSRepository.findOne({where: {id_instalacao_esus: this.conn.dados.id_instalacao_esus!, date_process: Not(IsNull())}})

        if (ULTIMO_PROCESSAMENTO_INSTALACAO) {
            QUERY_FILTERS += `
                and subquery.dt_registro between :data_inicio and :data_final
            `
            DYNAMIC_PARAMETERS.Add('data_inicio', ULTIMO_PROCESSAMENTO_INSTALACAO.date_process);
            DYNAMIC_PARAMETERS.Add('data_final', subDays(this.DATA_PROCESSAMENTO, 1).toISOString().split('T')[0]);
        }

        SQL_BASE += `${QUERY_FILTERS}${SQL.getFrom()}`

        const atendimentos = await this.DB.query(queryConvert(SQL_BASE, DYNAMIC_PARAMETERS.GetAll()))

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

        const equipes = await this.DB.query(query_equipes)


        for (const equipe of equipes.rows) {

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

        for (const atendimento of atendimentos.rows) {

            const atdwithmeta: IAtendimentosUBS = { id_instalacao: this.conn.dados.id_instalacao_esus!, uf: this.conn.dados.uf, municipio: this.conn.dados.municipio, instalacao: this.conn.dados.instalacao_esus!, data_processamento: this.DATA_PROCESSAMENTO, ...atendimento }

            await atendimentoUBSRepository.insert({ dados: atdwithmeta })
        }
        return true


    }
}