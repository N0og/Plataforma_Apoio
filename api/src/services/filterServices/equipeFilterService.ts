import { equipeRepository, unidadeRepository } from "../../database/repository/API_DB_Repositorys";

export default class equipeFilterService {
    
    async execute(_body_params:any, _query_params:any) {
        const { unidades } = _query_params

        if (!unidades) {
            return new Error("Falha na solicitação")
        }

        let equipes_response: any[] = []

        for (const unidade of unidades) {

            const uni = await unidadeRepository.findOneBy({id_unidade: unidade})

            const equipes_esus = await equipeRepository.createQueryBuilder("equipe")
            .leftJoinAndSelect("equipe.unidade", "unidade")
            .where("unidade.id_unidade = :id_unidade", { id_unidade: unidade})
            .getMany();

            if (equipes_esus && uni){
                const modifiedUnidade = equipes_esus.map(equipe => {
                    return { id: equipe.id_equipe, unidade: equipe.nu_ine, checked:false }
                })
                
                const mun = uni.no_estabelecimento

                equipes_response.push({ [mun]: modifiedUnidade })
            }

            
        }
        return equipes_response
    }
}