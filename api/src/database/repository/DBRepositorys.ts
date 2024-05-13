
import { Estado } from "../entities/Estados";
import { IPs } from "../entities/IPs";
import { Instalacao } from "../entities/Instalacao";
import { Municipio } from "../entities/Municipios";
import { API_DB_DataSource } from "../init";

export const instalacaoRepository = API_DB_DataSource.getRepository(Instalacao)

export const municipioRepository = API_DB_DataSource.getRepository(Municipio)

export const estadoRepository = API_DB_DataSource.getRepository(Estado)

export const ipsRepository = API_DB_DataSource.getRepository(IPs)