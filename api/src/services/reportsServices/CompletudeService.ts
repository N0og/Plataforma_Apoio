import { ICompletudeFilters, IATT_CPF } from "../../interfaces/ICompletude";
import checkFCI from "../../utils/reports/Completude/CheckFieldsFCI";
import DynamicParameters from "../../utils/reports/DynamicParameters";
import { queryConvert } from "../../utils/bd/pg/pgPlaceHolders";
import { ConnectDBs } from "../../database/init";
import { SQL_COMPLETUDE } from "./SQL";

export default class CompletudeQuery {
    async execute(dbClient:ConnectDBs ,filtros: ICompletudeFilters) {

        let query_filters = ""
        let parametros_dinamicos = new DynamicParameters()
        if (filtros.unidadeId) {
            query_filters += `
                AND tdus.nu_cnes = :unidadeId
            `
            parametros_dinamicos.Add(":unidadeId", filtros.unidadeId)
        }

        if (filtros.equipeId) {
            query_filters += `
                AND tde.nu_ine = :equipeId
            `
            parametros_dinamicos.Add(":equipeId", filtros.equipeId)
        }

        if (filtros.micro_area) {
            query_filters += `
                AND tfci.nu_micro_area = :micro_area
            `
            parametros_dinamicos.Add(":micro_area", filtros.micro_area)
        }

        if (filtros.profissionalId) {
            query_filters += `
                AND tdp.nu_cns = :profissionalId
            `
            parametros_dinamicos.Add(":profissionalId", filtros.profissionalId)
        }

        if (filtros.data_inicial != null && filtros.data_final != null) {
            query_filters += `
                and tdtficha.dt_registro between :data_inicio and :data_final
            `
            parametros_dinamicos.Add('data_inicio', filtros.data_inicial);
            parametros_dinamicos.Add('data_final', filtros.data_final);
        }

        const SQL = new SQL_COMPLETUDE()
        let query_FCI = SQL.SQL_BASE +=  query_filters
               
        const resultATT_CPF = await dbClient.getPostgDB().query(queryConvert(query_FCI, parametros_dinamicos.GetAll()))

        if (resultATT_CPF instanceof Error) {
            return new Error('Falha na consulta.')
        }

        const rowsATT_CPF: IATT_CPF[] = resultATT_CPF.rows

        let dataExport: IATT_CPF[] = []


        rowsATT_CPF.forEach((row) => {

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