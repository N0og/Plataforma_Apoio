import { municipioRepository } from "../database/repository/API_DB_Repositorys";

export class ClientsFilterService {
    async execute() {
        const clients = await municipioRepository.find({ order: { no_municipio: 'ASC' } })
        const modifiedClients = clients.map(client => {
            let mun = client.no_municipio
            return { [mun]: { value: null, condition: false } }
        })
        return modifiedClients.reduce((obj1, obj2) => ({ ...obj1, ...obj2 }), {})
    }
}