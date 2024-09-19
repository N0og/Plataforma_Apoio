import {
    ICompletudeFilters,
    IATT_CPF
} from "../../interfaces";

import {
    DynamicParameters,
    checkFieldsFCI
} from "../../utils";

import {
    SQL_COMPLETENESS_ESUS,
    SQL_COMPLETENESS_EAS
} from "./SQL";
import { ExecuteSQL } from "../../database/execute";
import { ConnectDBs } from "../../database/init";

export class CompletenessReportService {

    DYNAMIC_PARAMETERS: DynamicParameters = new DynamicParameters()
    QUERY_FILTERS: string = ""
    DBTYPE: string



    async execute(dbtype: string, dbClient: ConnectDBs, filtros_params: ICompletudeFilters) {

        this.DBTYPE = dbtype


        if (this.DBTYPE === 'psql') {
            if (filtros_params.cnes != null) {
                this.QUERY_FILTERS += `
                    AND tdus.nu_cnes = :cnes
                `
                this.DYNAMIC_PARAMETERS.Add(":cnes", filtros_params.cnes)
            }

            if (filtros_params.ine != null) {
                this.QUERY_FILTERS += `
                    AND tde.nu_ine = :ine
                `
                this.DYNAMIC_PARAMETERS.Add(":ine", filtros_params.ine)
            }

            if (filtros_params.micro_area != null) {
                this.QUERY_FILTERS += `
                    AND tfci.nu_micro_area = :micro_area
                `
                this.DYNAMIC_PARAMETERS.Add(":micro_area", filtros_params.micro_area)
            }

            if (filtros_params.profissionalId && filtros_params.profissionalId > 0) {
                this.QUERY_FILTERS += `
                    AND tdp.nu_cns = :profissionalId
                `
                this.DYNAMIC_PARAMETERS.Add(":profissionalId", filtros_params.profissionalId)
            }

            if (filtros_params.data_inicial != null && filtros_params.data_final != null) {
                this.QUERY_FILTERS += `
                    and tdtficha.dt_registro between :data_inicio and :data_final
                `
                this.DYNAMIC_PARAMETERS.Add('data_inicio', filtros_params.data_inicial);
                this.DYNAMIC_PARAMETERS.Add('data_final', filtros_params.data_final);
            }
        }

        else {
            if (filtros_params.cnes != null) {
                this.QUERY_FILTERS +=
                    `
                    AND e.Cnes = :cnes
                `
                this.DYNAMIC_PARAMETERS.Add(":cnes", filtros_params.cnes)
            }

            if (filtros_params.ine != null) {
                this.QUERY_FILTERS +=
                    `
                    AND eq.id = :ine
                `
                this.DYNAMIC_PARAMETERS.Add(":ine", filtros_params.ine)
            }

            if (filtros_params.micro_area != null) {
                this.QUERY_FILTERS +=
                    `
                    AND i.MicroArea = :micro_area
                `
                this.DYNAMIC_PARAMETERS.Add(":micro_area", filtros_params.micro_area)
            }

            if (filtros_params.profissionalId && filtros_params.profissionalId > 0) {
                this.QUERY_FILTERS +=
                    `
                    AND p.CartaoSus = :profissionalId
                `
                this.DYNAMIC_PARAMETERS.Add(":profissionalId", filtros_params.profissionalId)
            }

            if (filtros_params.data_inicial != null && filtros_params.data_final != null) {
                this.QUERY_FILTERS +=
                    `
                    and i.DataAlteracao between :data_inicio and :data_final
                `
                this.DYNAMIC_PARAMETERS.Add('data_inicio', filtros_params.data_inicial);
                this.DYNAMIC_PARAMETERS.Add('data_final', filtros_params.data_final);
            }
        }

        const SQL_COMMAND = (this.DBTYPE === 'psql') ? new SQL_COMPLETENESS_ESUS().getBase() + this.QUERY_FILTERS : new SQL_COMPLETENESS_EAS().getBase() + this.QUERY_FILTERS

        const RESULT_QUERY_ATT_CPF = await ExecuteSQL(this.DBTYPE, SQL_COMMAND, this.DYNAMIC_PARAMETERS, dbClient) as any[];

        if (!RESULT_QUERY_ATT_CPF) {
            return new Error('Falha na consulta.')
        }

        let dataExport: IATT_CPF[] = []

        RESULT_QUERY_ATT_CPF.forEach((row) => {

            const COMPLETUDE = checkFieldsFCI(row)
            dataExport.push(
                {
                    "CIDADÃO": row.CIDADÃO,
                    "DOCUMENTO PESSOAL": row["DOCUMENTO PESSOAL"],
                    "DATA DE NASCIMENTO": row["DATA DE NASCIMENTO"],
                    "MICRO-ÁREA": row["MICRO-ÁREA"],
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