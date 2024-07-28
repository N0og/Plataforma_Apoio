import { Alerts } from "../constants"
import { useNotifyEvent } from "./useNotifyEvent"
import { IControllersStateType } from "../interfaces/IControllerStates"
import { Loading } from "../components"
import React from "react";

export const useAlertMessageEvent = (controllers: IControllersStateType) => {

    if (controllers.loading_state) {
        return React.createElement(Loading, { alert: Alerts.LOADING })
    }

    if (controllers.extract_state) {
        return React.createElement(Loading, { alert: Alerts.EXTRACTING })
    }

    if (controllers.data_state) {
        useNotifyEvent(Alerts.DATA_LESS, 1000, 'error')
    }

    if (controllers.municipio_state) {
        useNotifyEvent(Alerts.CITY_LESS, 1000, 'error')
    }

    if (controllers.driver_state_more) {
        useNotifyEvent(Alerts.DBFILTER_EXCESS, 1000, 'error')
    }

    if (controllers.driver_state_less) {
        useNotifyEvent(Alerts.DB_FILTER_LESS, 1000, 'error')
    }

    if (controllers.condicoes_state) {
        useNotifyEvent(Alerts.CONDITION_LESS, 1000, 'error')
    }

    return null
}