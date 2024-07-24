import { instalacaoESUSRepository, unidadeRepository } from "../../database/repository/API_DB_Repositorys";

export default class unidadeoFilterService {
    async execute(params: any) {
        const order = Array.isArray(params.order) ? params.order : Array(params.order) as string[]

        if (!order) {
            return new Error("Falha na solicitação")
        }

        let instalacao_response: any[] = []

        for (const instalacao of order) {

            const inst = await instalacaoESUSRepository.findOneBy({ id_instalacao_esus: instalacao })

            const unidades_esus = await unidadeRepository.createQueryBuilder("unidade")
                .leftJoinAndSelect("unidade.instalacao", "instalacao")
                .where("instalacao.id_instalacao_esus = :id_instalacao", { id_instalacao: instalacao })
                .getMany();

            if (unidades_esus && inst) {
                const modifiedUnidade = unidades_esus.map(unidade => {
                    return { [unidade.no_estabelecimento]: { value: unidade.nu_cnes, condition: false } }
                })

                instalacao_response.push({ [inst.no_instalacao]: modifiedUnidade.reduce((obj1, obj2)=>({...obj1, ...obj2}), {}) })
            }


        }
        return instalacao_response.reduce((obj1, obj2)=> ({...obj1, ...obj2}), {})
    }
}