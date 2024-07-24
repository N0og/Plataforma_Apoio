import { useEffect, useState } from "react"
import { useGetData } from "./useGetData"
import { IControllersStateType } from "../interfaces/IControllerStates"
import { ISimpleFilterPartition } from "../interfaces/IFilters";
import { useNotifyEvent } from "./useNotifyEvent";

export const useGetClients = (toggleState:(key: keyof IControllersStateType, state: boolean) => void) => {

    const [clientsFilter, setClientFilter] = useState<ISimpleFilterPartition>({});

    useEffect(() => {
        useGetData(
            `${process.env.VITE_API_URL}/api/v1/filters/clients`,
            {},
            toggleState
        ).then((response => {
            if (response) setClientFilter(response as {})
        }))
    .catch((error)=>{
        useNotifyEvent(error.msg, 1000, 'error')
    })
    }, [])

    return { clientsFilter, setClientFilter }
}