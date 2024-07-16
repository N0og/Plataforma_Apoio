import { AlertsEnum } from "../../constants"
import { useNotifyEvent } from "../../hooks/useNotifyEvent"
import { IControllersStateType } from "../../interfaces/IControllerStates"
import './AlertMessage.css'

export const renderAlertMessage = (controllers: IControllersStateType) => {
    
    if (controllers.loading_state) {
        return (
            <div className='loading_container'>
                <div className='loading_filter'></div>
                <span>{AlertsEnum.Loading}</span>
            </div>
        )
    }

    if (controllers.extract_state) { 
        return (
            <div className='loading_container'>
                <div className='loading_filter'></div>
                <span>{AlertsEnum.Extract}</span>
            </div>
        )
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