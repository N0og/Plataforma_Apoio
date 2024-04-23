import 'reflect-metadata'
import express from 'express'
import { router } from './routes'
import ConnectDB from './database/datasource'
import cors from 'cors'
import { config as DotEnvConfig } from 'dotenv'

DotEnvConfig()
const api = express()

api.use(express.json())
api.use(router)
api.use(cors({
    origin: process.env.FRONT_END_ADDRESS
}))

export const databases = new ConnectDB()

databases.start()
.then(()=>{
    api.listen(process.env.API_PORT, ()=>{
        console.log(`API em execução... porta utilizada: ${process.env.API_PORT}`)
        }
    )
})
.catch((erro)=>{
    console.error(erro)
})


