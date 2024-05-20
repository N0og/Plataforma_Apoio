import { ConneSUSRepository, instalacaoESUSRepository, municipioRepository } from "../../database/repository/DBRepositorys";

interface test {
    [key: string]: { [key: string]: { [key: string]: boolean } };
}


export default class unidadesFilterService{
    async execute(body_params, query_params){
        const { municipios } = query_params

        console.log(municipios)

        if (!municipios){
            return new Error("Falha na solicitação")
        }

        let unidades_response: any[] = []

        for (const mun of municipios){
            const unidades = await ConneSUSRepository.createQueryBuilder('conn')
                                        .where('conn.dados @> :dados',  { dados: JSON.stringify({ municipio: mun })})
                                        .getRawMany()

            const modifiedClients = unidades.map(unidade=>{
                return {id:unidade.conn_id, unidade: unidade.conn_dados.instalacao_esus}
            })

            unidades_response.push({[mun]: modifiedClients})
        
      
        }

        return unidades_response
        
    }
}