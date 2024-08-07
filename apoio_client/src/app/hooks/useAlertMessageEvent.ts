import { Alerts } from "../constants"
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

    return null
}