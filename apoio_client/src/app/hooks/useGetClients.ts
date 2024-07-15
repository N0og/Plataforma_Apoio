import { useEffect, useState } from "react"
import { useGetData } from "./useGetData"
import { IControllersStateType } from "../interfaces/IControllerStates"

export const useGetClients = (toggleState:(key: keyof IControllersStateType, state: boolean) => void) => {

    const [clientsFilter, setClientFilter] = useState<any[]>([]);

    useEffect(() => {
        useGetData(
            "http://26.197.116.207:9090/api/v1/filters/clients",
            {},
            toggleState
        ).then((response => {
            if (response) setClientFilter(response)
        }))
    }, [])

    return { clientsFilter, setClientFilter }
}