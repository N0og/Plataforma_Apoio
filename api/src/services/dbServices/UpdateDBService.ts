import { InsertResult, createQueryBuilder } from "typeorm";
import { estadoRepository, instalacaoRepository, ipsRepository, municipioRepository } from "../../database/repository/DBRepositorys";
import JSONLoader from "../../utils/bd/JSONLoader";
import { API_DB_DataSource } from "../../database/init";

export default class UpdateDBService {
    async execute() {
        const ESUS_IPS = new JSONLoader().getESUS()
        const EAS_IPS = new JSONLoader().getESUS()


        for (const estado of Object.keys(ESUS_IPS)) {
            for (const municipio of Object.keys(ESUS_IPS[estado])) {
                for (const instalacao of Object.keys(ESUS_IPS[estado][municipio])) {
                    let ip = ESUS_IPS[estado][municipio][instalacao]

                    let new_municipio: InsertResult, new_uf: InsertResult, new_instalacao: InsertResult

                    let old_uf = await estadoRepository.findOneBy({ sg_uf: estado })

                    if (!old_uf) {

                        new_uf = await estadoRepository.insert({ sg_uf: estado })

                        new_municipio = await municipioRepository.insert({
                            no_municipio: municipio,
                            uf: new_uf.generatedMaps[0]
                        })

                        new_instalacao = await instalacaoRepository.insert({
                            no_instalacao: instalacao,
                            ip_address: ip,
                            municipio: new_municipio.generatedMaps[0]
                        })

                        ipsRepository.insert({
                            dados: {
                                uf: estado,
                                municipio: municipio,
                                instalacao: instalacao,
                                ip: ip,
                                user: undefined,
                                password: undefined,
                                id_instalacoes_pec: new_instalacao.generatedMaps[0].id_instalacoes_pec
                            }
                        })

                        continue
                    }

                    let old_muni = await municipioRepository.findOneBy({ no_municipio: municipio })

                    if (!old_muni) {

                        new_municipio = await municipioRepository.insert({
                            no_municipio: municipio,
                            uf: { id_uf: old_uf.id_uf }
                        })

                        new_instalacao = await instalacaoRepository.insert({
                            no_instalacao: instalacao,
                            ip_address: ip,
                            municipio: new_municipio.generatedMaps[0]
                        })

                        ipsRepository.insert({
                            dados: {
                                uf: old_uf.sg_uf,
                                municipio: municipio,
                                instalacao: instalacao,
                                ip: ip,
                                user: undefined,
                                password: undefined,
                                id_instalacoes_pec: new_instalacao.generatedMaps[0].id_instalacoes_pec
                            }
                        })

                        continue
                    }


                    
                    let old_instalacao =  await instalacaoRepository.createQueryBuilder("instalacao")
                                            .leftJoinAndSelect("instalacao.municipio", "municipio")
                                            .where("instalacao.no_instalacao = :no_instalacao and municipio.no_municipio = :no_municipio", { no_instalacao: instalacao, no_municipio: municipio })
                                            .getOne();

                    if (old_instalacao) {

                        await instalacaoRepository.update(old_instalacao.id_instalacoes_pec,
                            {
                                no_instalacao: instalacao,
                                ip_address: ip
                            })

                        let old_jsonip = await ipsRepository.createQueryBuilder("jsonIP")
                                                    .where("jsonIP.dados @> :dados", { dados: JSON.stringify({ id_instalacoes_pec: old_instalacao.id_instalacoes_pec })})
                                                    .getOne()

                        if (old_jsonip) {
                            await ipsRepository.update(old_jsonip.id, {
                                dados: {
                                    uf: estado,
                                    municipio: municipio,
                                    instalacao: instalacao,
                                    ip: ip,
                                    user: undefined,
                                    password: undefined,
                                    id_instalacoes_pec: old_instalacao.id_instalacoes_pec
                                }
                            })
                        }
                        continue
                    }

                    new_instalacao = await instalacaoRepository.insert({
                        no_instalacao: instalacao,
                        ip_address: ip,
                        municipio: old_muni
                    })

                    await ipsRepository.insert({
                        dados: {
                            uf: estado,
                            municipio: municipio,
                            instalacao: instalacao,
                            ip: ip,
                            user: undefined,
                            password: undefined,
                            id_instalacoes_pec: new_instalacao.generatedMaps[0].id_instalacoes_pec
                        }
                    })
                }
            }
        }
    }
}
