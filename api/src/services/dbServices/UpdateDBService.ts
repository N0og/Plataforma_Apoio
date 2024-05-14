import { InsertResult } from "typeorm";
import { estadoRepository, instalacaoEASRepository, instalacaoESUSRepository, ConneSUSRepository, municipioRepository, ConnEASRepository } from "../../database/repository/DBRepositorys";
import JSONLoader from "../../utils/bd/JSONLoader";
import { Municipio } from "../../database/entities/Municipios";


export default class UpdateDBService {
    async execute() {
        const ESUS_IPS = new JSONLoader().getESUS()
        const EAS_IPS = new JSONLoader().getEAS()

        for (const ESTADO of Object.keys(ESUS_IPS)) {
            for (const MUNICIPIO of Object.keys(ESUS_IPS[ESTADO])) {

                let IBGE = ESUS_IPS[ESTADO][MUNICIPIO]['IBGE']
                let CREDENCIAIS = ESUS_IPS[ESTADO][MUNICIPIO]['CREDENCIAIS']
                let IPS = ESUS_IPS[ESTADO][MUNICIPIO]['IPS']

                for (const INSTALACAO of Object.keys(IPS)) {

                    const IP = IPS[INSTALACAO]

                    let new_municipio: InsertResult, new_uf: InsertResult, new_instalacao: InsertResult

                    let old_uf = await estadoRepository.findOneBy({ sg_uf: ESTADO })

                    if (!old_uf) {

                        new_uf = await estadoRepository.insert({ sg_uf: ESTADO })

                        new_municipio = await municipioRepository.insert({
                            no_municipio: MUNICIPIO,
                            nu_ibge: IBGE,
                            uf: new_uf.generatedMaps[0]
                        })

                        new_instalacao = await instalacaoESUSRepository.insert({
                            no_instalacao: INSTALACAO,
                            ip_address: IP,
                            name_db: CREDENCIAIS.bd_name,
                            user_db: CREDENCIAIS.bd_user,
                            port_db: CREDENCIAIS.bd_port,
                            password_db: CREDENCIAIS.bd_pwd,
                            user_pec: CREDENCIAIS.user,
                            password_pec: CREDENCIAIS.password,
                            municipio: new_municipio.generatedMaps[0]
                        })

                        ConneSUSRepository.insert({
                            dados: {
                                uf: ESTADO,
                                municipio: MUNICIPIO,
                                instalacao_esus: INSTALACAO,
                                ip_esus: IP,
                                port_esus: CREDENCIAIS.bd_port,
                                db_user_esus: CREDENCIAIS.bd_user,
                                db_password_esus: CREDENCIAIS.bd_pwd,
                                id_instalacao_esus: new_instalacao.generatedMaps[0].id_instalacoes_pec                            
                            }
                        })

                        continue
                    }

                    let old_muni = await municipioRepository.findOneBy({ no_municipio: MUNICIPIO })

                    if (!old_muni) {

                        new_municipio = await municipioRepository.insert({
                            no_municipio: MUNICIPIO,
                            nu_ibge: IBGE,
                            uf: { id_uf: old_uf.id_uf }
                        })

                        new_instalacao = await instalacaoESUSRepository.insert({
                            no_instalacao: INSTALACAO,
                            ip_address: IP,
                            name_db: CREDENCIAIS.bd_name,
                            user_db: CREDENCIAIS.bd_user,
                            port_db: CREDENCIAIS.bd_port,
                            password_db: CREDENCIAIS.bd_pwd,
                            user_pec: CREDENCIAIS.user,
                            password_pec: CREDENCIAIS.password,
                            municipio: new_municipio.generatedMaps[0]
                        })

                        ConneSUSRepository.insert({
                            dados: {
                                uf: old_uf.sg_uf,
                                municipio: MUNICIPIO,
                                instalacao_esus: INSTALACAO,
                                ip_esus: IP,
                                port_esus: CREDENCIAIS.bd_port,
                                db_user_esus: CREDENCIAIS.bd_user,
                                db_password_esus: CREDENCIAIS.bd_pwd,
                                id_instalacao_esus: new_instalacao.generatedMaps[0].id_instalacoes_pec
                            }
                        })

                        continue
                    }



                    let old_instalacao = await instalacaoESUSRepository.createQueryBuilder("instalacao")
                        .leftJoinAndSelect("instalacao.municipio", "municipio")
                        .where("instalacao.no_instalacao = :no_instalacao and municipio.no_municipio = :no_municipio", { no_instalacao: INSTALACAO, no_municipio: MUNICIPIO })
                        .getOne();

                    if (old_instalacao) {



                        await municipioRepository.update(old_instalacao.municipio,
                            {
                                nu_ibge: IBGE
                            })

                        await instalacaoESUSRepository.update(old_instalacao.id_instalacao_esus,
                            {
                                no_instalacao: INSTALACAO,
                                user_pec: CREDENCIAIS.user,
                                password_pec: CREDENCIAIS.password,
                                ip_address: IP,
                                name_db: CREDENCIAIS.bd_name,
                                user_db: CREDENCIAIS.bd_user,
                                port_db: CREDENCIAIS.bd_port,
                                password_db: CREDENCIAIS.bd_pwd
                            })

                        let old_jsonip = await ConneSUSRepository.createQueryBuilder("jsonIP")
                            .where("jsonIP.dados @> :dados", { dados: JSON.stringify({ id_instalacoes_pec: old_instalacao.id_instalacao_esus }) })
                            .getOne()

                        if (old_jsonip) {
                            await ConneSUSRepository.update(old_jsonip.id, {
                                dados: {
                                    uf: ESTADO,
                                    municipio: MUNICIPIO,
                                    instalacao_esus: INSTALACAO,
                                    ip_esus: IP,
                                    port_esus: CREDENCIAIS.bd_port,
                                    db_user_esus: CREDENCIAIS.bd_user,
                                    db_password_esus: CREDENCIAIS.bd_pwd,
                                    id_instalacao_esus: old_instalacao.id_instalacao_esus
                                }
                            })
                        }
                        
                        continue
                    }

                    new_instalacao = await instalacaoESUSRepository.insert({
                        no_instalacao: INSTALACAO,
                        ip_address: IP,
                        name_db: CREDENCIAIS.bd_name,
                        user_db: CREDENCIAIS.bd_user,
                        port_db: CREDENCIAIS.bd_port,
                        password_db: CREDENCIAIS.bd_pwd,
                        user_pec: CREDENCIAIS.user,
                        password_pec: CREDENCIAIS.password,
                        municipio: old_muni
                    })

                    await ConneSUSRepository.insert({
                        dados: {
                            uf: ESTADO,
                            municipio: MUNICIPIO,
                            instalacao_esus: INSTALACAO,
                            ip_esus: IP,
                            port_esus: CREDENCIAIS.bd_port,
                            db_user_esus: CREDENCIAIS.bd_user,
                            db_password_esus: CREDENCIAIS.bd_pwd,
                            id_instalacao_esus: new_instalacao.generatedMaps[0].id_instalacoes_pec
                        }
                    })
                }
            }
        }

    for (const ESTADO of Object.keys(EAS_IPS)) {
        for (const MUNICIPIO of Object.keys(EAS_IPS[ESTADO])) {

            let IBGE = EAS_IPS[ESTADO][MUNICIPIO]['IBGE']
            let CREDENCIAIS = EAS_IPS[ESTADO][MUNICIPIO]['CREDENCIAIS']
            let DBNAME = EAS_IPS[ESTADO][MUNICIPIO]['DBNAME']

            let new_municipio: InsertResult, new_uf: InsertResult, new_instalacao: InsertResult

            let old_uf = await estadoRepository.findOneBy({ sg_uf: ESTADO })

            if (!old_uf) {

                new_uf = await estadoRepository.insert({ sg_uf: ESTADO })

                new_municipio = await municipioRepository.insert({
                    no_municipio: MUNICIPIO,
                    nu_ibge: IBGE,
                    uf: new_uf.generatedMaps[0]
                })

                new_instalacao = await instalacaoEASRepository.insert({
                    name_db: DBNAME,
                    user_eas: CREDENCIAIS.user,
                    password_eas: CREDENCIAIS.password,
                    municipio: new_municipio.generatedMaps[0]
                })

                ConnEASRepository.insert({
                    dados: {
                        uf: ESTADO,
                        municipio: MUNICIPIO,
                        db_name_eas: DBNAME,
                        id_instalacao_eas: new_instalacao.generatedMaps[0].id_instalacao_eas
                    }
                })

                continue
            }

                let old_muni = await municipioRepository.findOneBy({ no_municipio: MUNICIPIO })

                if (!old_muni) {

                    new_municipio = await municipioRepository.insert({
                        no_municipio: MUNICIPIO,
                        nu_ibge: IBGE,
                        uf: { id_uf: old_uf.id_uf }
                    })

                    new_instalacao = await instalacaoEASRepository.insert({
                        name_db: DBNAME,
                        user_eas: CREDENCIAIS.user,
                        password_eas: CREDENCIAIS.password,
                        municipio: new_municipio.generatedMaps[0]
                    })

                    ConnEASRepository.insert({
                        dados: {
                            uf: old_uf.sg_uf,
                            municipio: MUNICIPIO,
                            db_name_eas: DBNAME,
                            id_instalacao_eas: new_instalacao.generatedMaps[0].id_instalacao_eas
                        }
                    })

                    continue
                }



                let old_instalacao = await instalacaoEASRepository.createQueryBuilder("instalacao")
                    .leftJoinAndSelect("instalacao.municipio", "municipio")
                    .where("municipio.no_municipio = :no_municipio", { no_municipio: MUNICIPIO })
                    .getOne();

                if (old_instalacao) {



                    await municipioRepository.update(old_instalacao.municipio,
                        {
                            nu_ibge: IBGE
                        })

                    await instalacaoEASRepository.update(old_instalacao.id_instalacao_eas,
                        {
                            name_db: DBNAME,
                            user_eas: CREDENCIAIS.user,
                            password_eas: CREDENCIAIS.password
                        })

                    let old_jsonip = await ConneSUSRepository.createQueryBuilder("jsonIP")
                        .where("jsonIP.dados @> :dados", { dados: JSON.stringify({ id_instalacoes_pec: old_instalacao.id_instalacao_eas }) })
                        .getOne()

                    if (old_jsonip) {
                        await ConnEASRepository.update(old_jsonip.id, {
                            dados: {
                                uf: ESTADO,
                                municipio: MUNICIPIO,
                                db_name_eas: DBNAME,
                                id_instalacao_eas: old_instalacao.id_instalacao_eas
                            }
                        })
                    }
                    continue
                }

                new_instalacao = await instalacaoEASRepository.insert({
                    name_db: DBNAME,
                    user_eas: CREDENCIAIS.user,
                    password_eas: CREDENCIAIS.password,
                    municipio: old_muni
                })

                await ConnEASRepository.insert({
                    dados: {
                        uf: ESTADO,
                        municipio: MUNICIPIO,
                        db_name_eas: DBNAME,
                        id_instalacao_eas: new_instalacao.generatedMaps[0].id_instalacao_eas
                    }
                })
            }
        }
    }
}

