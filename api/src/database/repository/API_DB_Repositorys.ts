
import {
    Estado,
    ConnEAS,
    ConneSUS,
    Instalacao_EAS,
    Instalacao_eSUS,
    Municipio,
    Equipe,
    Processamento,
    Unidade,
    Imunobiologico,
    User,
    UserTokens
} from "../entities"; // Importa as entidades

import { API_DB_DataSource } from "../init"; // Importa o DataSource configurado para o banco de dados

import {
    EntityTarget,
    ObjectLiteral
} from "typeorm"; // Importa a tipagem do TypeORM

/**
 * Função genérica para criar um repositório para uma entidade específica.
 * @param entity - A entidade para a qual o repositório será criado.
 * @returns O repositório da entidade.
 */
const createRepository = <T extends EntityTarget<ObjectLiteral>>(entity: T) => API_DB_DataSource.getRepository(entity);

// Criação dos repositórios para cada entidade utilizando a função genérica
export const instalacaoESUSRepository = createRepository(Instalacao_eSUS); // Repositório para a entidade Instalacao_eSUS
export const instalacaoEASRepository = createRepository(Instalacao_EAS); // Repositório para a entidade Instalacao_EAS
export const processamentoRepository = createRepository(Processamento); // Repositório para a entidade Processamento
export const equipeRepository = createRepository(Equipe); // Repositório para a entidade Equipe
export const unidadeRepository = createRepository(Unidade); // Repositório para a entidade Unidade
export const municipioRepository = createRepository(Municipio); // Repositório para a entidade Municipio
export const estadoRepository = createRepository(Estado); // Repositório para a entidade Estado
export const ConneSUSRepository = createRepository(ConneSUS); // Repositório para a entidade ConneSUS
export const ConnEASRepository = createRepository(ConnEAS); // Repositório para a entidade ConnEAS
export const ImunoseSUSRepository = createRepository(Imunobiologico); // Repositório para a entidade Imunobiologico
export const UserRepository = createRepository(User);  // Repositório para a entidade de Usuários
export const UserTokensRepository = createRepository(UserTokens);  // Repositório para a entidade de Tokens (Refresh Token)