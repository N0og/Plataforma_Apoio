import { ConneSUSRepository } from "../../database/repository/API_DB_Repositorys";

export default class instalacaoFilterService {
    async execute(_body_params:any, _query_params:any) {
        const { municipios } = _query_params

        if (!municipios) {
            return new Error("Falha na solicitação")
        }

        let instalacao_response: any[] = []

        for (const mun of municipios) {
            const instalacoes_esus = await ConneSUSRepository.createQueryBuilder('conn')
                .where('conn.dados @> :dados', { dados: JSON.stringify({ municipio: mun }) })
                .getRawMany()

            const modifiedInstalacao = instalacoes_esus.map(unidade => {
                return { id: unidade.conn_id, unidade: unidade.conn_dados.instalacao_esus, checked:false }
            })
            instalacao_response.push({ [mun]: modifiedInstalacao })
        }
        return instalacao_response
    }
}