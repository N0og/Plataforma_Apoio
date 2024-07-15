import { AlertsEnum } from "../../constants"
import { IControllersStateType } from "../../interfaces/IControllerStates"
import './AlertMessage.css'
import { Flip, toast } from "react-toastify"

export const renderAlertMessage = (controllers: IControllersStateType) => {


    const showNotification = (message: AlertsEnum, autoClose?:number|false) => {
        toast(message,{
            type:'error',
            position:"top-right",
            autoClose,
            hideProgressBar: true,
            closeOnClick: true,
            rtl:false,
            pauseOnFocusLoss:true,
            draggable:true,
            pauseOnHover:true,
            theme:"light",
            transition: Flip,
            closeButton:true
        });
    };

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
        showNotification(AlertsEnum.DataFilter, 1000)
    }

    if (controllers.municipio_state) {
        showNotification(AlertsEnum.MunicipioFilter, 1000)
    }

    if (controllers.driver_state) {
        showNotification(AlertsEnum.DriverFilter, 1000)
    }

    if (controllers.condicoes_state) {
        showNotification(AlertsEnum.CondicoesFilter, 1000)
    }

    return null
}