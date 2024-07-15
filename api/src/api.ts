import 'reflect-metadata'
import { config as DotEnvConfig } from 'dotenv'
import express from 'express'
import { router } from './routes'
import { API_DB_DataSource } from './database/init'
import cors from 'cors'
import JSONLoader from './utils/bd/JSONLoader'
DotEnvConfig()

const api = express()

api.use(express.json())

api.use(cors({
    origin: (origin, callback) => {
        const alloweds = new JSONLoader().loadWhitelist().getWhitelist().includes(origin)
        callback(null, alloweds)
    },
    allowedHeaders: 'Content-Type, Authorization',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
}))

api.use(router)

API_DB_DataSource.initialize()
    .then(async () => {
        console.log("API_DB inicializado.")
        api.listen(process.env.API_PORT, () => {
            console.log(`API em execução... porta utilizada: ${process.env.API_PORT}`)
        }
        )
    })
    .catch((error) => {
        throw new Error(error)
    })





