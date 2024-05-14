
import { Estado } from "../entities/Estados";
import { ConnEAS, ConneSUS } from "../entities/Conn";
import { Instalacao_EAS } from "../entities/InstalacaoEAS";
import { Instalacao_eSUS } from "../entities/InstalacaoeSUS";
import { Municipio } from "../entities/Municipios";
import { API_DB_DataSource } from "../init";

export const instalacaoESUSRepository = API_DB_DataSource.getRepository(Instalacao_eSUS)

export const instalacaoEASRepository = API_DB_DataSource.getRepository(Instalacao_EAS)

export const municipioRepository = API_DB_DataSource.getRepository(Municipio)

export const estadoRepository = API_DB_DataSource.getRepository(Estado)

export const ConneSUSRepository = API_DB_DataSource.getRepository(ConneSUS)

export const ConnEASRepository = API_DB_DataSource.getRepository(ConnEAS)