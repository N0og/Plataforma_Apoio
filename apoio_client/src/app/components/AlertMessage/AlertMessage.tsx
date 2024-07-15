import { AlertsEnum } from "../../constants"
import { IControllersStateType } from "../../interfaces/IControllerStates"
import './AlertMessage.css'
import { Flip, toast } from "react-toastify"

export const renderAlertMessage = (controllers: IControllersStateType) => {


    const showNotification = (message: AlertsEnum) => {
        toast(message,{
            type:'error',
            position:"top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            rtl:false,
            pauseOnFocusLoss:true,
            draggable:true,
            pauseOnHover:true,
            theme:"light",
            transition: Flip
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

    if (controllers.extract_state) return (
        <div className='loading_container'>
            <div className='loading_filter'></div>
            <span>{AlertsEnum.Extract}</span>
        </div>
    )


    if (controllers.data_state) {
        showNotification(AlertsEnum.DataFilter)
    }

    if (controllers.municipio_state) {
        showNotification(AlertsEnum.MunFilter)
    }
}