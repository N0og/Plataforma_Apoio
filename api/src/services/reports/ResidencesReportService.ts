import {
    ICompletudeFilters,
    IATT_CPF
} from "../../interfaces";

import {
    DynamicParameters,
    checkFieldsFCI
} from "../../utils";

import {
    SQL_RESIDENCES_EAS,
    SQL_RESIDENCES_ESUS
} from "./SQL";
import { ExecuteSQL } from "../../database/execute";
import { ConnectDBs } from "../../database/init";

export class ResidencesReportService {

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
                    AND tccd.nu_micro_area = :micro_area
                `
                this.DYNAMIC_PARAMETERS.Add(":micro_area", filtros_params.micro_area)
            }

            if (filtros_params.data_inicial != null && filtros_params.data_final != null) {
                this.QUERY_FILTERS += `
                    and tccd.dt_cad_domiciliar between :data_inicio and :data_final
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
                    AND d.MicroArea = :micro_area
                `
                this.DYNAMIC_PARAMETERS.Add(":micro_area", filtros_params.micro_area)
            }
    
            if (filtros_params.data_inicial != null && filtros_params.data_final != null) {
                this.QUERY_FILTERS +=
                    `
                    and d.DataAlteracao between :data_inicio and :data_final
                `
                this.DYNAMIC_PARAMETERS.Add('data_inicio', filtros_params.data_inicial);
                this.DYNAMIC_PARAMETERS.Add('data_final', filtros_params.data_final);
            }
        }

        const SQL_COMMAND = (this.DBTYPE === 'psql') ? new SQL_RESIDENCES_ESUS().getBase() + this.QUERY_FILTERS : new SQL_RESIDENCES_EAS().getBase() + this.QUERY_FILTERS

        const RESULT_QUERY_ATT_CPF = await ExecuteSQL(this.DBTYPE, SQL_COMMAND, this.DYNAMIC_PARAMETERS, dbClient) as any[];

        if (!RESULT_QUERY_ATT_CPF) {
            return new Error('Falha na consulta.')
        }

        return RESULT_QUERY_ATT_CPF!

    }
}