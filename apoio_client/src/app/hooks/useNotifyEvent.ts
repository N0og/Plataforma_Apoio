import { toast, Flip, TypeOptions } from 'react-toastify'

export const useNotifyEvent = (message: string, type: TypeOptions, autoClose?: number | undefined | false,) => {
    
    try{
        toast(message,{
            type,
            position:"top-right",
            autoClose: autoClose ? autoClose : 1000,
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
        
        return true
    }
    catch {
        return false
    }


}
