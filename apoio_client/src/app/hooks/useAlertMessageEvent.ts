import { AlertsEnum } from "../constants"
import { useNotifyEvent } from "./useNotifyEvent"
import { IControllersStateType } from "../interfaces/IControllerStates"
import { Loading } from "../components/Loading"
import React from "react";

export const useAlertMessageEvent = (controllers: IControllersStateType) => {

    if (controllers.loading_state) {
        return React.createElement(Loading, { Enum: AlertsEnum.Loading })
    }

    if (controllers.extract_state) {
        return React.createElement(Loading, { Enum: AlertsEnum.Extract })
    }

    if (controllers.data_state) {
        useNotifyEvent(AlertsEnum.DataFilter, 1000, 'error')
    }

    if (controllers.municipio_state) {
        useNotifyEvent(AlertsEnum.MunicipioFilter, 1000, 'error')
    }

    if (controllers.driver_state_more) {
        useNotifyEvent(AlertsEnum.DriverFilterMore, 1000, 'error')
    }

    if (controllers.driver_state_less) {
        useNotifyEvent(AlertsEnum.DriverFilterLess, 1000, 'error')
    }

    if (controllers.condicoes_state) {
        useNotifyEvent(AlertsEnum.CondicoesFilter, 1000, 'error')
    }

    return null
}