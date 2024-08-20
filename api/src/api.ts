/**
 * Importa as dependências necessárias para o funcionamento da API.
 * 
 * - 'reflect-metadata': Módulo para adicionar suporte a decorators no TypeScript.
 * - 'dotenv': Carrega variáveis de ambiente de um arquivo .env para o process.env.
 * - 'express': Framework para construção de APIs web no Node.js.
 * - 'router': Arquivo contendo as rotas da API.
 * - 'API_DB_DataSource': DataSource utilizado para inicializar a conexão com o banco de dados.
 * - 'cors': Middleware que permite o controle de segurança sobre quem pode acessar a API.
 * - 'JSONLoader': Utilitário para carregar e manipular listas em JSON, como a whitelist.
 * 
 * Desenvolvedor: Gabriel S. Nogueira
 */

import 'reflect-metadata'
import { config as DotEnvConfig } from 'dotenv'
import express from 'express'
import { router } from './routes'
import { API_DB_DataSource } from './database/init'
import cors from 'cors'
import { JSONLoader } from './utils'
import { AuthTokenMiddleware } from './middlewares/AuthTokenMiddleware'

// Carrega as variáveis de ambiente do arquivo .env para o process.env.
DotEnvConfig()

// Cria uma instância do Express para criar e configurar a API.
const api = express()

// Configura a API para utilizar JSON como formato de entrada/saída.
api.use(express.json())


/**
 * Configura o middleware CORS para controlar o acesso à API.
 * 
 * - origin: Verifica se a origem da requisição está presente na whitelist. 
 *            Caso esteja, a requisição é permitida.
 * - allowedHeaders: Especifica os cabeçalhos permitidos nas requisições.
 * - methods: Define os métodos HTTP permitidos na API.
 */
api.use(cors({
    origin: (origin, callback) => {
        const alloweds = new JSONLoader().loadWhitelist().getWhitelist().includes(origin)
        callback(null, alloweds)
    },
    allowedHeaders: 'Content-Type, Authorization',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
}))

// Aplica o middleware AUTHTOKEN que verifica se o usuário está autenticado.
api.use(new AuthTokenMiddleware().handlerAuth)

// Aplica as rotas definidas no arquivo router.
api.use(router)

/**
 * Inicializa a conexão com o banco de dados e, em seguida, inicia o servidor da API.
 * 
 * - Caso a conexão com o banco de dados seja bem-sucedida, a API começa a escutar na porta especificada.
 * - Caso ocorra um erro na inicialização do banco de dados, uma exceção é lançada.
 */
API_DB_DataSource.initialize()
    .then(async () => {
        console.log("API_DB initialized.")
        api.listen(process.env.API_PORT, () => {
            console.log(`API is running... PORT: ${process.env.API_PORT}`)
        })
    })
    .catch((error) => {
        throw new Error(`Falha ao conectar com o banco de dados da API: ${error.message}`)
    })
