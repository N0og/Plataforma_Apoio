import { municipioRepository } from "../../database/repository/API_DB_Repositorys";

interface test {
    [key: string]: { [key: string]: { [key: string]: boolean } };
}


export default class clientsFilterService{
    async execute(){
        const clients = await municipioRepository.find({order: {no_municipio: 'ASC'}})
        const modifiedClients = clients.map(client=>{
            let mun = client.no_municipio
            return {[mun]: false}
        })
        return modifiedClients
    }
}