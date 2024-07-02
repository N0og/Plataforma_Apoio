import { ConnectDBs } from "../../database/init"
import { municipioRepository } from "../../database/repository/API_DB_Repositorys"
import axios from "axios"

export interface IIEDResponse {
    [key: string]: {
        ubs: string,
        latitude: string,
        longitude: string,
        cnes: string,
        ine: string,
        qtd_indi: number,
        tp_equipe: string
    }[]
}

export default class IEDService {
    async execute(dbClient: ConnectDBs, filtros_body: any, filtros_query: any) {
        let query_base = `
        SELECT 
            est.Nome ubs,
            est.Cnes cnes,
            equipe.id ine,
            case 
                when equipe.TipoEquipe = 70 then 'ESF'
                when equipe.TipoEquipe = 76 then 'EAP'
                else equipe.TipoEquipe 
            end as tp_equipe
            ,
            (select 
                count(*)
            from 
                Individuo i
            WHERE 
                i.MudouSe = 0
                and i.Deletado = 0
                and i.MotivoDaRecusa is null
                and i.MotivoDeSaida is null
                and i.DataDoObito is null
                and i.CodigoEquipe = equipe.id
            ) as qtd_indi
        from Equipe equipe
            inner join Estabelecimento est on est.Id = equipe.Estabelecimento_Id 
        WHERE 
            (equipe.TipoEquipe = 70 or equipe.TipoEquipe = 76 )
       `
        const relatorio = await dbClient.getMariaDB().query(query_base)


        if (relatorio && Array.isArray(relatorio[0])) {
            const promises = relatorio[0].map(async (element, ind) => {
                const response = await axios.get(`https://apidadosabertos.saude.gov.br/cnes/estabelecimentos/${element.cnes}`)

                relatorio[0][ind].latitude = response.data.latitude_estabelecimento_decimo_grau;
                relatorio[0][ind].longitude = response.data.longitude_estabelecimento_decimo_grau;

                const municipioIncid = await municipioRepository.findOneBy({no_municipio:filtros_body.municipio})

                relatorio[0][ind].ied = municipioIncid?.ied
                relatorio[0][ind].municipio = municipioIncid?.no_municipio


                if (municipioIncid?.ied === "1"){
                    if (relatorio[0][ind].tp_equipe == 'ESF'){
                        relatorio[0][ind].param = 2000
                        relatorio[0][ind].max = 3000
                    }
                    else if (relatorio[0][ind].tp_equipe == 'EAP'){
                        relatorio[0][ind].param = 1000
                        relatorio[0][ind].max = 1500
                    }
                }

                else if (municipioIncid?.ied === "2"){
                    if (relatorio[0][ind].tp_equipe == 'ESF'){
                        relatorio[0][ind].param = 2500
                        relatorio[0][ind].max = 3750
                    }
                    else if (relatorio[0][ind].tp_equipe == 'EAP'){
                        relatorio[0][ind].param = 1250
                        relatorio[0][ind].max = 1875
                    }
                }

                else if (municipioIncid?.ied === "3"){
                    if (relatorio[0][ind].tp_equipe == 'ESF'){
                        relatorio[0][ind].param = 2750
                        relatorio[0][ind].max = 4125
                    }
                    else if (relatorio[0][ind].tp_equipe == 'EAP'){
                        relatorio[0][ind].param = 1375
                        relatorio[0][ind].max = 1500
                    }
                }

                else if (municipioIncid?.ied === "4"){
                    if (relatorio[0][ind].tp_equipe == 'ESF'){
                        relatorio[0][ind].param = 3000
                        relatorio[0][ind].max = 4500
                    }
                    else if (relatorio[0][ind].tp_equipe == 'EAP'){
                        relatorio[0][ind].param = 1500
                        relatorio[0][ind].max = 2250
                    }
                }

                return
            });
        
            await Promise.all(promises);
        
        }

        return relatorio[0]
    }
}