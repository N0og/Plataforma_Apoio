import { municipioRepository } from "../../database/repository/DBRepositorys";

interface test {
    [key: string]: { [key: string]: { [key: string]: boolean } };
}


export default class clientsFilterService{
    async execute(){
        const clients = await municipioRepository.find()
        const modifiedClients = clients.map(client=>{
            let mun = client.no_municipio
            return {[mun]: false}
        })
        return modifiedClients
    }
}