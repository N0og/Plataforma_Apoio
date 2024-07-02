import { ICompletudeFilters, IATT_CPF } from "../../interfaces/ReportsInterfaces/ICompletude";
import checkFCI from "../../utils/reports/Completude/CheckFieldsFCI";
import DynamicParameters from "../../utils/reports/DynamicParameters";
import { queryConvert } from "../../utils/bd/pg/pgPlaceHolders";
import { ConnectDBs } from "../../database/init";
import { SQL_COMPLETUDE_ESUS } from "./SQL";
import { SQL_COMPLETUDE_EAS } from "./SQL";
import { DefaultTypesJSON } from "../../utils/bd/DefaultTypesJSON";

export default class CompletudeQuery {

    DYNAMIC_PARAMETERS: DynamicParameters = new DynamicParameters()
    QUERY_FILTERS: string = ""
    DBTYPE: string

    async QuerySQL(dbClient: ConnectDBs) {

        if (this.DBTYPE === 'psql') {
            const SQL_BASE = new SQL_COMPLETUDE_ESUS().getBase() + this.QUERY_FILTERS
            const REPORT = await dbClient.getPostgDB().query(queryConvert(SQL_BASE, this.DYNAMIC_PARAMETERS.GetAll()))
            return REPORT.rows
        }
        else {
            const SQL_BASE = new SQL_COMPLETUDE_EAS().getBase() + this.QUERY_FILTERS
            const REPORT = await dbClient.getMariaDB().query(SQL_BASE, this.DYNAMIC_PARAMETERS.GetAll())
            return DefaultTypesJSON(REPORT[0])
        }

    }


    async execute(dbtype: string, dbClient: ConnectDBs, filtros: ICompletudeFilters) {

        this.DBTYPE = dbtype


        if (this.DBTYPE === 'psql') {
            if (filtros.cnes != null) {
                this.QUERY_FILTERS += `
                    AND tdus.nu_cnes = :cnes
                `
                this.DYNAMIC_PARAMETERS.Add(":cnes", filtros.cnes)
            }

            if (filtros.ine != null) {
                this.QUERY_FILTERS += `
                    AND tde.nu_ine = :ine
                `
                this.DYNAMIC_PARAMETERS.Add(":ine", filtros.ine)
            }

            if (filtros.micro_area != null) {
                this.QUERY_FILTERS += `
                    AND tfci.nu_micro_area = :micro_area
                `
                this.DYNAMIC_PARAMETERS.Add(":micro_area", filtros.micro_area)
            }

            if (filtros.profissionalId && filtros.profissionalId > 0) {
                this.QUERY_FILTERS += `
                    AND tdp.nu_cns = :profissionalId
                `
                this.DYNAMIC_PARAMETERS.Add(":profissionalId", filtros.profissionalId)
            }

            if (filtros.data_inicial != null && filtros.data_final != null) {
                this.QUERY_FILTERS += `
                    and tdtficha.dt_registro between :data_inicio and :data_final
                `
                this.DYNAMIC_PARAMETERS.Add('data_inicio', filtros.data_inicial);
                this.DYNAMIC_PARAMETERS.Add('data_final', filtros.data_final);
            }
        }

        else {
            if (filtros.cnes != null) {
                this.QUERY_FILTERS +=
                    `
                    AND e.Cnes = :cnes
                `
                this.DYNAMIC_PARAMETERS.Add(":cnes", filtros.cnes)
            }

            if (filtros.ine != null) {
                this.QUERY_FILTERS +=
                    `
                    AND eq.id = :ine
                `
                this.DYNAMIC_PARAMETERS.Add(":ine", filtros.ine)
            }

            if (filtros.micro_area != null) {
                this.QUERY_FILTERS +=
                    `
                    AND i.MicroArea = :micro_area
                `
                this.DYNAMIC_PARAMETERS.Add(":micro_area", filtros.micro_area)
            }

            if (filtros.profissionalId && filtros.profissionalId > 0) {
                this.QUERY_FILTERS +=
                    `
                    AND p.CartaoSus = :profissionalId
                `
                this.DYNAMIC_PARAMETERS.Add(":profissionalId", filtros.profissionalId)
            }

            if (filtros.data_inicial != null && filtros.data_final != null) {
                this.QUERY_FILTERS +=
                    `
                    and i.DataAlteracao between :data_inicio and :data_final
                `
                this.DYNAMIC_PARAMETERS.Add('data_inicio', filtros.data_inicial);
                this.DYNAMIC_PARAMETERS.Add('data_final', filtros.data_final);
            }
        }


        const RESULT_QUERY_ATT_CPF = await this.QuerySQL(dbClient) as any[];

        if (RESULT_QUERY_ATT_CPF instanceof Error) {
            return new Error('Falha na consulta.')
        }

        let dataExport: IATT_CPF[] = []

        RESULT_QUERY_ATT_CPF.forEach((row) => {

            const COMPLETUDE = checkFCI(row)
            dataExport.push(
                {
                    "CIDADÃO": row.CIDADÃO,
                    "DOCUMENTO PESSOAL": row["DOCUMENTO PESSOAL"],
                    "É RESPONSÁVEL FAMILIAR": row["É RESPONSÁVEL FAMILIAR"],
                    "ULTIMA ATUALIZAÇÃO": row["ULTIMA ATUALIZAÇÃO"],
                    "STATUS DOCUMENTO": row["STATUS DOCUMENTO"],
                    "TEMPO SEM ATUALIZAR": row["TEMPO SEM ATUALIZAR"],
                    "MESES SEM ATUALIZAR": row["MESES SEM ATUALIZAR"],
                    "DISTRITO": row["DISTRITO"],
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
                    "COMPLETUDE": `${COMPLETUDE['status']}%`,
                    "ERROS": COMPLETUDE['erros'].join(', ')
                }
            )

        })

        return dataExport!

    }
}