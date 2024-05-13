
import fs from 'fs'
import path from "path";
import { JSON_PATH } from "../../consts";



export default class JSONLoader{
    private esus_path: string = path.join(JSON_PATH, 'esus.json')
    private eas_path: string = path.join(JSON_PATH, 'eas.json')

    private esus_ips: any
    private eas_ips: any

    constructor(){
        
        try {
            this.esus_ips = JSON.parse(fs.readFileSync(this.esus_path, 'utf-8'))
        } catch (error) {
            throw new Error(`Erro na abertura do esus_ips ${error}`)
        }
    }

    getESUS(){
        return this.esus_ips
    }

    getEAS(){
        return this.eas_ips
    }
}