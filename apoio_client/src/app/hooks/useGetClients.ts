import { useEffect, useState } from "react"
import { useGetData } from "./useGetData"
import { IControllersStateType } from "../interfaces/IControllerStates"
import { Flip, toast } from "react-toastify";

export const useGetClients = (toggleState:(key: keyof IControllersStateType, state: boolean) => void) => {

    const [clientsFilter, setClientFilter] = useState<any[]>([]);

    useEffect(() => {
        useGetData(
            "http://26.197.116.207:9090/api/v1/filters/clients",
            {},
            toggleState
        ).then((response => {
            if (response) setClientFilter(response as [])
        }))
    .catch((error)=>{
        toast(error.msg, {
            type: 'error',
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            rtl: false,
            pauseOnFocusLoss: true,
            draggable: true,
            pauseOnHover: true,
            theme: "light",
            transition: Flip,
            closeButton: true
          });
    })
    }, [])

    return { clientsFilter, setClientFilter }
}