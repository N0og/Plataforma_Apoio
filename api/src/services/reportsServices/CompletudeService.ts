import { ICompletudeFilters, IATT_CPF } from "../../interfaces/ICompletude";
import checkFCI from "../../utils/reports/Completude/CheckFieldsFCI";
import DynamicParameters from "../../utils/reports/DynamicParameters";
import { queryConvert } from "../../utils/bd/pg/pgPlaceHolders";
import { ConnectDBs } from "../../database/init";
import { SQL_COMPLETUDE } from "./SQL";
import { SQL_COMPLETUDE_EAS } from "./SQL/SQLCompletude";
import { DefaultTypesJSON } from "../../utils/bd/DefaultTypesJSON";

export default class CompletudeQuery {

    parametros_dinamicos: DynamicParameters = new DynamicParameters()
    query_filters: string = ""
    dbtype: string

    async QuerySQL(dbClient: ConnectDBs) {

        if (this.dbtype === 'psql') {
            const SQL_BASE = new SQL_COMPLETUDE().SQL_BASE + this.query_filters
            let result = await dbClient.getPostgDB().query(queryConvert(SQL_BASE, this.parametros_dinamicos.GetAll()))
            return result.rows
        }
        else {
            const SQL_BASE = new SQL_COMPLETUDE_EAS().SQL_BASE + this.query_filters
            let result = await dbClient.getMariaDB().query(SQL_BASE, this.parametros_dinamicos.GetAll())
            return DefaultTypesJSON(result[0])
        }

    }


    async execute(dbtype: string, dbClient: ConnectDBs, filtros: ICompletudeFilters) {

        this.dbtype = dbtype


        if (dbtype === 'psql'){
            if (filtros.unidadeId) {
                this.query_filters += `
                    AND tdus.nu_cnes = :unidadeId
                `
                this.parametros_dinamicos.Add(":unidadeId", filtros.unidadeId)
            }
    
            if (filtros.equipeId) {
                this.query_filters += `
                    AND tde.nu_ine = :equipeId
                `
                this.parametros_dinamicos.Add(":equipeId", filtros.equipeId)
            }
    
            if (filtros.micro_area) {
                this.query_filters += `
                    AND tfci.nu_micro_area = :micro_area
                `
                this.parametros_dinamicos.Add(":micro_area", filtros.micro_area)
            }
    
            if (filtros.profissionalId) {
                this.query_filters += `
                    AND tdp.nu_cns = :profissionalId
                `
                this.parametros_dinamicos.Add(":profissionalId", filtros.profissionalId)
            }
    
            if (filtros.data_inicial != null && filtros.data_final != null) {
                this.query_filters += `
                    and tdtficha.dt_registro between :data_inicio and :data_final
                `
                this.parametros_dinamicos.Add('data_inicio', filtros.data_inicial);
                this.parametros_dinamicos.Add('data_final', filtros.data_final);
            }
        }

        else{
            if (filtros.unidadeId) {
                this.query_filters += `
                    AND e.Cnes = :unidadeId
                `
                this.parametros_dinamicos.Add(":unidadeId", filtros.unidadeId)
            }
    
            if (filtros.equipeId) {
                this.query_filters += `
                    AND eq.id = :equipeId
                `
                this.parametros_dinamicos.Add(":equipeId", filtros.equipeId)
            }
    
            if (filtros.micro_area) {
                this.query_filters += `
                    AND i.MicroArea = :micro_area
                `
                this.parametros_dinamicos.Add(":micro_area", filtros.micro_area)
            }
    
            if (filtros.profissionalId) {
                this.query_filters += `
                    AND p.CartaoSus = :profissionalId
                `
                this.parametros_dinamicos.Add(":profissionalId", filtros.profissionalId)
            }
    
            if (filtros.data_inicial != null && filtros.data_final != null) {
                this.query_filters += `
                    and i.DataAlteracao between :data_inicio and :data_final
                `
                this.parametros_dinamicos.Add('data_inicio', filtros.data_inicial);
                this.parametros_dinamicos.Add('data_final', filtros.data_final);
            }
        }
        

        const resultATT_CPF = await this.QuerySQL(dbClient) as any[];

        if (resultATT_CPF instanceof Error) {
            return new Error('Falha na consulta.')
        }

        let dataExport: IATT_CPF[] = []

        resultATT_CPF.forEach((row) => {

            const completude = checkFCI(row)
            dataExport.push(
                {
                    "CIDADÃO": row.CIDADÃO,
                    "DOCUMENTO PESSOAL": row["DOCUMENTO PESSOAL"],
                    "É RESPONSÁVEL FAMILIAR": row["É RESPONSÁVEL FAMILIAR"],
                    "ULTIMA ATUALIZAÇÃO": row["ULTIMA ATUALIZAÇÃO"],
                    "STATUS DOCUMENTO": row["STATUS DOCUMENTO"],
                    "TEMPO SEM ATUALIZAR": row["TEMPO SEM ATUALIZAR"],
                    "MESES SEM ATUALIZAR": row["MESES SEM ATUALIZAR"],
                    "MICRO ÁREA": row["MICRO ÁREA"],
                    "PROFISSIONAL CADASTRANTE": row["PROFISSIONAL CADASTRANTE"],
                    "CBO PROFISSIONAL": row["CBO PROFISSIONAL"],
                    "DESCRIÇÃO CBO": row["DESCRIÇÃO CBO"],
                    "UNIDADE DE SAÚDE": row["UNIDADE DE SAÚDE"],
                    "CNES": row.CNES,
                    "NOME EQUIPE": row["NOME EQUIPE"],
                    "INE": row.INE,
                    "TIPO DE EQUIPE": row["TIPO DE EQUIPE"],
                    "STATUS DE RECUSA": row["STATUS DE RECUSA"],
                    "COMPLETUDE": `${completude['status']}%`,
                    "ERROS": completude['erros'].join(', ')
                }
            )

        })

        return dataExport!

    }
}