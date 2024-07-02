import { Workbook, Worksheet, } from 'excel4node';
import { isDate } from 'util/types';
import { WorkbookConfig, WorksheetConfig, styles } from '../configs/WorkBookConfig';
import path from 'path';
import { ASSETS_PATH } from '../../../consts';

export default class VisitasPrioritariasOrganizer {
    private planilha: Workbook;
    private consolidado: Worksheet;
    private analitico: Worksheet;
    private columns_analitico: any;
    private columns_consolidado: any;

    constructor() {
        this.planilha = new Workbook(new WorkbookConfig())
        this.analitico = this.planilha.addWorksheet('Analítico', new WorksheetConfig());

    }


    insert_header() {
        this.analitico.addImage({
            path: path.join(ASSETS_PATH,'atend_logo.jpg'),
            type: 'picture',
            position: {
                type:'absoluteAnchor',
                x:'1in',
                y:'2in'
            }

        })
        this.analitico.cell(1, 1, 2, this.columns_analitico.length, true).string('Relatório de Visitas Prioritárias ACS').style(styles.top)
    }


    insert_columns(json: any) {

        this.columns_analitico = Object.keys(json[0]);

        this.columns_analitico.forEach((column: string, col_index: number) => {
            this.analitico.cell(6, col_index + 1).string(column).style(styles.header)
        })
    }

    insert(json: any, municipio?: string, unidade?: string) {

        json.forEach((row: Object, row_index: number) => {
            this.columns_analitico.forEach((column: string, col_index: number) => {
                let value: any = Object.values(row)[col_index];
                if (typeof value === "string") {
                    this.consolidado.cell(row_index + 7, col_index + 1).string(value)
                }

                else if (typeof value === "number") {
                    this.consolidado.cell(row_index + 7, col_index + 1).number(value).style(styles.numbers)
                }

                else if (typeof value === "boolean") {
                    this.consolidado.cell(row_index + 7, col_index + 1).bool(value).style(styles.numbers)
                }

                else if (isDate(value)) {
                    this.consolidado.cell(row_index + 7, col_index + 1).date(value).style(styles.numbers)
                }

            })

        })


    }

    async save_worksheet() {
        return await this.planilha.writeToBuffer()
    }

}