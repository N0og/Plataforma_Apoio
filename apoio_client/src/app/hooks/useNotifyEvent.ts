import { toast, Flip, TypeOptions } from 'react-toastify'

export const useNotifyEvent = (message: string, autoClose: number | undefined | false, type: TypeOptions) => {
    
    try{
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
        
        return true
    }
    catch {
        return false
    }


}
