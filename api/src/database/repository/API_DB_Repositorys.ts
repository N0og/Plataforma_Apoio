
import { Estado } from "../entities/Estados";
import { ConnEAS, ConneSUS } from "../entities/Conn";
import { Instalacao_EAS } from "../entities/InstalacaoEAS";
import { Instalacao_eSUS } from "../entities/InstalacaoeSUS";
import { Municipio } from "../entities/Municipios";
import { API_DB_DataSource } from "../init";
import { Processamento } from "../entities/Processamento";
import { Equipe } from "../entities/Equipes";
import { Unidade } from "../entities/Unidades";
import { Imunobiologico } from "../entities/Imunobiologicos";


export const instalacaoESUSRepository = API_DB_DataSource.getRepository(Instalacao_eSUS)

export const instalacaoEASRepository = API_DB_DataSource.getRepository(Instalacao_EAS)

export const processamentoRepository = API_DB_DataSource.getRepository(Processamento)

export const equipeRepository = API_DB_DataSource.getRepository(Equipe)

export const unidadeRepository = API_DB_DataSource.getRepository(Unidade)

export const municipioRepository = API_DB_DataSource.getRepository(Municipio)

export const estadoRepository = API_DB_DataSource.getRepository(Estado)

export const ConneSUSRepository = API_DB_DataSource.getRepository(ConneSUS)

export const ConnEASRepository = API_DB_DataSource.getRepository(ConnEAS)

export const ImunoseSUSRepository = API_DB_DataSource.getRepository(Imunobiologico)