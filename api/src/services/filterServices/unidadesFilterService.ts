import { ConneSUSRepository, instalacaoESUSRepository, municipioRepository } from "../../database/repository/DBRepositorys";

export default class unidadesFilterService {
    async execute(_body_params:any, _query_params:any) {
        const { municipios } = _query_params

        if (!municipios) {
            return new Error("Falha na solicitação")
        }

        let unidades_response: any[] = []

        for (const mun of municipios) {
            const unidades = await ConneSUSRepository.createQueryBuilder('conn')
                .where('conn.dados @> :dados', { dados: JSON.stringify({ municipio: mun }) })
                .getRawMany()

            const modifiedClients = unidades.map(unidade => {
                return { id: unidade.conn_id, unidade: unidade.conn_dados.instalacao_esus }
            })
            unidades_response.push({ [mun]: modifiedClients })
        }
        return unidades_response
    }
}