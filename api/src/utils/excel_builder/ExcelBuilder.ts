import { Workbook, Worksheet, } from 'excel4node';
import { isDate } from 'util/types';
import { WorkbookConfig, WorksheetConfig, styles } from './configs/WorkBookConfig';

export default class ExcelBuilder {
    private planilha: Workbook;
    private consolidado: Worksheet;
    private columns: any;

    constructor() {
        this.planilha = new Workbook(new WorkbookConfig())
        this.consolidado = this.planilha.addWorksheet('CONSOLIDADO', new WorksheetConfig());

    }


    insert_columns(json: any) {

        this.columns = Object.keys(json[0]);

        this.columns.forEach((column: string, col_index: number) => {
            this.consolidado.cell(1, col_index + 1).string(column).style(styles.header)
        })
    }

    insert(json: any, municipio?: string, unidade?: string) {

        json.forEach((row: Object, row_index: number) => {
            this.columns.forEach((column: string, col_index: number) => {
                let value: any = Object.values(row)[col_index];
                if (typeof value === "string") {
                    this.consolidado.cell(row_index + 2, col_index + 1).string(value)
                }

                else if (typeof value === "number") {
                    this.consolidado.cell(row_index + 2, col_index + 1).number(value).style(styles.numbers)
                }

                else if (typeof value === "boolean") {
                    this.consolidado.cell(row_index + 2, col_index + 1).bool(value).style(styles.numbers)
                }

                else if (isDate(value)) {
                    this.consolidado.cell(row_index + 2, col_index + 1).date(value).style(styles.numbers)
                }

            })

        })


    }

    async save_worksheet() {
        return await this.planilha.writeToBuffer()
    }
}