import { instalacaoESUSRepository, unidadeRepository } from "../../database/repository/API_DB_Repositorys";

export default class unidadeoFilterService {
    async execute(_body_params:any, _query_params:any) {
        const { instalacoes } = _query_params

        if (!instalacoes) {
            return new Error("Falha na solicitação")
        }

        let instalacao_response: any[] = []

        for (const instalacao of instalacoes) {

            const inst = await instalacaoESUSRepository.findOneBy({id_instalacao_esus: instalacao})

            const unidades_esus = await unidadeRepository.createQueryBuilder("unidade")
            .leftJoinAndSelect("unidade.instalacao", "instalacao")
            .where("instalacao.id_instalacao_esus = :id_instalacao", { id_instalacao: instalacao})
            .getMany();

            if (unidades_esus && inst){
                const modifiedUnidade = unidades_esus.map(unidade => {
                    return { id: unidade.id_unidade, unidade: unidade.nu_cnes, checked:false }
                })
                
                const mun = inst.no_instalacao

                instalacao_response.push({ [mun]: modifiedUnidade })
            }

            
        }
        return instalacao_response
    }
}