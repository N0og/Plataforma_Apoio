import { ConneSUSRepository } from "../../database/repository/API_DB_Repositorys";

export class InstallationsFilterService {
    async execute(params: any) {
        const order = Array.isArray(params.order) ? params.order : Array(params.order) as string[]

        if (!order) {
            return new Error("Falha na solicitação")
        }

        let instalacao_response: any[] = []

        for (const mun of order) {
            const instalacoes_esus = await ConneSUSRepository.createQueryBuilder('conn')
                .where('conn.dados @> :dados', { dados: JSON.stringify({ municipio: mun }) })
                .getRawMany()

            const modifiedInstalacao = instalacoes_esus.map(unidade => {
                return { [unidade.conn_dados.instalacao_esus]: { value: unidade.conn_dados.id_instalacao_esus, condition: false } }
            })
            instalacao_response.push({ [mun]: modifiedInstalacao.reduce((obj1, obj2) => ({ ...obj1, ...obj2 }), {}) })
        }

        return instalacao_response.reduce((obj1, obj2) => ({ ...obj1, ...obj2 }), {})
    }
}