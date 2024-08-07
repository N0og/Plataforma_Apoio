import { equipeRepository, unidadeRepository } from "../../database/repository/API_DB_Repositorys";

export default class equipeFilterService {

    async execute(params: any) {
        const order = Array.isArray(params.order) ? params.order : Array(params.order) as string[]

        if (!order) {
            return new Error("Falha na solicitação")
        }

        let equipes_response: any[] = []

        for (const unidade of order) {

            const unidadeReference = await unidadeRepository.findOneBy({ nu_cnes: unidade })

            const equipes_esus = await equipeRepository.createQueryBuilder("equipe")
                .leftJoinAndSelect("equipe.unidade", "unidade")
                .where("unidade.id_unidade = :id_unidade", { id_unidade: unidadeReference?.id_unidade })
                .getMany();

            if (equipes_esus && unidadeReference) {
                const modifiedEquipes = equipes_esus.map(equipe => {
                    return { [equipe.no_equipe]: { value: equipe.nu_ine, condition: false } }
                })

                equipes_response.push({ [unidadeReference.no_estabelecimento]: modifiedEquipes.reduce((obj1, obj2)=>({...obj1, ...obj2}), {}) })
            }

            
        }
        return equipes_response.reduce((obj1, obj2) => ({...obj1, ...obj2}), {})
    }
}