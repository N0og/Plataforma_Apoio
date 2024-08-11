
import {
    estadoRepository,
    instalacaoEASRepository,
    instalacaoESUSRepository,
    ConneSUSRepository,
    municipioRepository,
    ConnEASRepository
} from "../database/repository/API_DB_Repositorys";
import { JSONLoader } from "../utils";

export class UpdateDBService {
    async execute() {
        const JSON_IPS = new JSONLoader().loadInfos();
        const ESUS_IPS = JSON_IPS.getESUS()
        const EAS_IPS = JSON_IPS.getEAS();

        await this.processIPS(ESUS_IPS, 'ESUS');
        await this.processIPS(EAS_IPS, 'EAS');
    }

    async processIPS(data: any, type: string) {
        for (const ESTADO of Object.keys(data)) {
            for (const MUNICIPIO of Object.keys(data[ESTADO])) {
                const info = data[ESTADO][MUNICIPIO];
                const CREDENCIAIS = info['CREDENCIAIS'];
                const IPS = info['IPS'];
                const DBNAME = info['DBNAME']

                const new_uf = await this.getOrCreateUF(ESTADO);
                const new_municipio = await this.getOrCreateMunicipio(MUNICIPIO, info, new_uf);

                if (type === 'ESUS') {
                    for (const INSTALACAO of Object.keys(IPS)) {
                        const IP = IPS[INSTALACAO];

                        await this.handleESUSInstalacao(new_municipio, INSTALACAO, IP, CREDENCIAIS, ESTADO, MUNICIPIO);
                    }
                }
                else {
                    await this.handleEASInstalacao(new_municipio, DBNAME, CREDENCIAIS, ESTADO, MUNICIPIO);
                }
            }
        }
    }

    async getOrCreateUF(ESTADO: string) {
        let uf = await estadoRepository.findOneBy({ sg_uf: ESTADO });
        if (!uf) {
            const new_uf = await estadoRepository.insert({ sg_uf: ESTADO });
            return new_uf.generatedMaps[0];
        }
        return uf;
    }

    async getOrCreateMunicipio(MUNICIPIO: string, info: any, uf: any) {
        let municipio = await municipioRepository.findOneBy({ no_municipio: MUNICIPIO });
        if (!municipio) {
            const new_municipio = await municipioRepository.insert({
                no_municipio: MUNICIPIO,
                nu_ibge: info['IBGE'],
                ivs: info['IVS'],
                habitantes_ibge: info['POP_IBGE'],
                porte_populacional: info['PORT_IBGE'],
                ied: info['IED'],
                uf: { id_uf: uf.id_uf }
            });
            return new_municipio.generatedMaps[0];
        }
        return municipio;
    }

    async handleESUSInstalacao(municipio: any, INSTALACAO: string, IP: string, CREDENCIAIS: any, ESTADO: string, MUNICIPIO: string) {
        const old_instalacao = await instalacaoESUSRepository.createQueryBuilder("instalacao")
            .leftJoinAndSelect("instalacao.municipio", "municipio")
            .where("instalacao.no_instalacao = :no_instalacao and municipio.no_municipio = :no_municipio", { no_instalacao: INSTALACAO, no_municipio: MUNICIPIO })
            .getOne();

        if (old_instalacao) {
            await this.updateESUSInstalacao(old_instalacao, municipio, IP, CREDENCIAIS);
        } else {
            const new_instalacao = await instalacaoESUSRepository.insert({
                no_instalacao: INSTALACAO,
                ip_address: IP,
                name_db: CREDENCIAIS.bd_name,
                user_db: CREDENCIAIS.bd_user,
                port_db: CREDENCIAIS.bd_port,
                password_db: CREDENCIAIS.bd_pwd,
                user_pec: CREDENCIAIS.user,
                password_pec: CREDENCIAIS.password,
                municipio: municipio
            });

            await ConneSUSRepository.insert({
                dados: {
                    uf: ESTADO,
                    municipio: MUNICIPIO,
                    instalacao_esus: INSTALACAO,
                    ip_esus: IP,
                    port_esus: CREDENCIAIS.bd_port,
                    db_name_esus: CREDENCIAIS.bd_name,
                    db_user_esus: CREDENCIAIS.bd_user,
                    db_password_esus: CREDENCIAIS.bd_pwd,
                    id_instalacao_esus: new_instalacao.generatedMaps[0].id_instalacao_esus
                }
            });
        }
    }

    async updateESUSInstalacao(instalacao: any, municipio: any, IP: string, CREDENCIAIS: any) {

        await municipioRepository.update(instalacao.municipio.id_municipio, {
            nu_ibge: municipio.nu_ibge,
            ivs: municipio.ivs,
            habitantes_ibge: municipio.habitantes_ibge,
            porte_populacional: municipio.porte_populacional,
            ied: municipio.ied
        });

        await instalacaoESUSRepository.update(instalacao.id_instalacao_esus, {
            no_instalacao: instalacao.no_instalacao,
            user_pec: CREDENCIAIS.user,
            password_pec: CREDENCIAIS.password,
            ip_address: IP,
            name_db: CREDENCIAIS.bd_name,
            user_db: CREDENCIAIS.bd_user,
            port_db: CREDENCIAIS.bd_port,
            password_db: CREDENCIAIS.bd_pwd
        });

        const old_jsonip = await ConneSUSRepository.createQueryBuilder("jsonIP")
            .where("jsonIP.dados @> :dados", { dados: JSON.stringify({ id_instalacao_esus: instalacao.id_instalacao_esus }) })
            .getOne();

        if (old_jsonip) {
            await ConneSUSRepository.update(old_jsonip.id, {
                dados: {
                    uf: instalacao.uf,
                    municipio: instalacao.municipio.no_municipio,
                    instalacao_esus: instalacao.no_instalacao,
                    ip_esus: IP,
                    port_esus: CREDENCIAIS.bd_port,
                    db_name_esus: CREDENCIAIS.bd_name,
                    db_user_esus: CREDENCIAIS.bd_user,
                    db_password_esus: CREDENCIAIS.bd_pwd,
                    id_instalacao_esus: instalacao.id_instalacao_esus
                }
            });
        }
    }

    async handleEASInstalacao(municipio: any, DBNAME: string, CREDENCIAIS: any, ESTADO: string, MUNICIPIO: string) {
        const old_instalacao = await instalacaoEASRepository.createQueryBuilder("instalacao")
            .leftJoinAndSelect("instalacao.municipio", "municipio")
            .where("municipio.no_municipio = :no_municipio", { no_municipio: MUNICIPIO })
            .getOne();

        if (old_instalacao) {
            await this.updateEASInstalacao(old_instalacao, DBNAME, municipio, CREDENCIAIS);
        } else {
            const new_instalacao = await instalacaoEASRepository.insert({
                name_db: DBNAME,
                user_eas: CREDENCIAIS.user,
                password_eas: CREDENCIAIS.password,
                municipio: municipio
            });

            await ConnEASRepository.insert({
                dados: {
                    uf: ESTADO,
                    municipio: MUNICIPIO,
                    db_name_eas: DBNAME,
                    id_instalacao_eas: new_instalacao.generatedMaps[0].id_instalacao_eas
                }
            });
        }
    }

    async updateEASInstalacao(instalacao: any, DBNAME: string, municipio: any, CREDENCIAIS: any) {
        await municipioRepository.update(instalacao.municipio.id_municipio, {
            nu_ibge: municipio.nu_ibge,
            ivs: municipio.ivs,
            habitantes_ibge: municipio.habitantes_ibge,
            porte_populacional: municipio.porte_populacional,
            ied: municipio.ied
        });

        await instalacaoEASRepository.update(instalacao.id_instalacao_eas, {
            name_db: DBNAME,
            user_eas: CREDENCIAIS.user,
            password_eas: CREDENCIAIS.password
        });

        const old_jsonip = await ConnEASRepository.createQueryBuilder("jsonIP")
            .where("jsonIP.dados @> :dados", { dados: JSON.stringify({ id_instalacao_eas: instalacao.id_instalacao_eas }) })
            .getOne();

        if (old_jsonip) {
            await ConnEASRepository.update(old_jsonip.id, {
                dados: {
                    uf: instalacao.uf,
                    municipio: instalacao.municipio.no_municipio,
                    db_name_eas: instalacao.name_db,
                    id_instalacao_eas: instalacao.id_instalacao_eas
                }
            });
        }
    }
}
