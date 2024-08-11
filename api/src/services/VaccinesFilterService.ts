import {
    ImunoseSUSRepository
} from "../database/repository/API_DB_Repositorys";

export class VaccinesFilterService {
    async execute() {
        const imunos = await ImunoseSUSRepository.find({ order: { co_imuno_esus: 'ASC' } })
        const modifiedImunos = imunos.map(item => {
            let imuno = item.no_imuno_esus
            return { [imuno]: { value: item.co_imuno_esus, condition: false } }
        })

        const imunos_list = [{ "IMUNOBIOLÓGICOS": modifiedImunos.reduce((obj1, obj2) => ({ ...obj1, ...obj2 }), {}) }]

        return imunos_list.reduce((obj1, obj2) => ({ ...obj1, ...obj2 }), {})
    }
}