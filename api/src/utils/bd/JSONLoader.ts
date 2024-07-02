
import fs from 'fs'
import path from "path";
import { JSON_PATH } from "../../consts";



export default class JSONLoader{
    private esus_path: string = path.join(JSON_PATH, 'esus.json')
    private eas_path: string = path.join(JSON_PATH, 'eas.json')
    private whitelist_path: string = path.join(JSON_PATH, 'whitelist.json')

    private esus_ips: any
    private eas_ips: any
    private whitelist: any

    constructor(){
    }

    loadInfos(){
        try {
            this.esus_ips = JSON.parse(fs.readFileSync(this.esus_path, 'utf-8'))
            this.eas_ips = JSON.parse(fs.readFileSync(this.eas_path, 'utf-8'))

            return this
        } catch (error) {
            throw new Error(`Erro na abertura do JSON ${error}`)
        }
    }

    loadWhitelist(){
        try {
            this.whitelist = JSON.parse(fs.readFileSync(this.whitelist_path, 'utf-8'))
            return this
        } catch (error) {
            throw new Error(`Erro na abertura do JSON ${error}`)
        }
    }

    getWhitelist(){
        if (this.whitelist) return this.whitelist.cors
    }

    getESUS(){
        if (this.esus_ips) return this.esus_ips
       
    }

    getEAS(){
        if (this.eas_ips) return this.eas_ips
    }
}

