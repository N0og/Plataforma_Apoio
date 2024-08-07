import { useEffect, useState } from "react"
import { useGetData } from "./useGetData"
import { IControllersStateType } from "../interfaces/IControllerStates"
import { IDynamicFilterPartition } from "../interfaces/IFilters";
import { useNotifyEvent } from "./useNotifyEvent";

export const useGetVaccines = (toggleState: (key: keyof IControllersStateType, state: boolean) => void) => {

    const [vaccinesFilter, setVaccinesFilter] = useState<IDynamicFilterPartition>({});

    useEffect(() => {
        useGetData(
            `${process.env.VITE_API_URL}/api/v1/filters/imunos`,
            {},
            toggleState
        ).then((response => {
            if (response) setVaccinesFilter(response as {})
        }))
    .catch((error)=>{
        useNotifyEvent(error.msg, 'error')
    })
    }, [])

    return { vaccinesFilter, setVaccinesFilter }
}