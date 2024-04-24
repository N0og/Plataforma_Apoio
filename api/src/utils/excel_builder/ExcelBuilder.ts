import { Workbook, Worksheet, } from 'excel4node';
import { isDate } from 'util/types';
import { WorkbookConfig, WorksheetConfig, styles } from './configs/WorkBookConfig';
import AdjustLength from '../AdjustColumnsLength';

export default class ExcelBuilder{
    private planilha: Workbook;
    private consolidado: Worksheet;

    async execute(json:any, municipio?:string, unidade?:string){
        return new Promise((resolve, reject)=>{

            this.planilha = new Workbook(new WorkbookConfig())
            this.consolidado = this.planilha.addWorksheet('CONSOLIDADO', new WorksheetConfig());
        
            const columns = Object.keys(json[0]);

            columns.forEach((column:string, col_index:number)=>{
                this.consolidado.cell(1, col_index+1).string(column).style(styles.cabecalho)
            })

            json.forEach((row:Object, row_index:number)=>{
                columns.forEach((column:string, col_index:number)=>{
                    let value:any = Object.values(row)[col_index];
                    if (typeof value === "string"){
                        this.consolidado.cell(row_index+2, col_index+1).string(value)
                    }

                    else if (typeof value === "number"){
                        this.consolidado.cell(row_index+2, col_index+1).number(value).style(styles.numeros)
                    }
                    
                    else if (typeof value === "boolean"){
                        this.consolidado.cell(row_index+2, col_index+1).bool(value).style(styles.numeros)
                    }

                    else if (isDate(value)){
                        this.consolidado.cell(row_index+2, col_index+1).date(value).style(styles.numeros)
                    }
                    
                })
                    
            })
           
            this.planilha.writeToBuffer()
            .then(buffer => {
                resolve(buffer);
            })
            .catch(err =>{
                reject(err);
            })
        })
    }

}