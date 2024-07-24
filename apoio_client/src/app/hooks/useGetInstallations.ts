import { useEffect, useState } from "react"
import { useGetData } from "./useGetData"
import { IControllersStateType } from "../interfaces/IControllerStates"
import { IDynamicFilterPartition, ISimpleFilterPartition } from "../interfaces/IFilters";
import { useNotifyEvent } from "./useNotifyEvent";

export const useGetInstallations = (clientsFilter: ISimpleFilterPartition, toggleState: (key: keyof IControllersStateType, state: boolean) => void) => {

    const [installationsFilter, setInstallationsFilter] = useState<IDynamicFilterPartition>({});

    useEffect(() => {

        if (Object.entries(clientsFilter).filter(([_key, value]) => value.condition === true).length > 0) {
            useGetData(
                `${process.env.VITE_API_URL}/api/v1/filters/instalacoes?dbtype=psql${Object.entries(clientsFilter)
                    .filter(([_key, value]) => value.condition === true)
                    .map(([key, _value]) => `&order=${key.replace(/ /g, "%20")}`)
                    .join('')}`,
                {},
                toggleState
            ).then((response => {
                if (response) {
                    setInstallationsFilter((prevFilter) => {

                        const responseEntries: ISimpleFilterPartition = Object.entries(response)
                            .filter(([_key, value]) => Object.keys(value).length > 0)
                            .reduce((obj1, [key, value]) => ({ ...obj1, [key]: value }), {});

                        const updatedFilter = { ...prevFilter };

                        Object.entries(responseEntries).forEach(([key, value]) => {
                            if (!(key in updatedFilter)) {
                                updatedFilter[key] = value;
                            }
                        });

                        Object.keys(prevFilter).forEach((key) => {
                            if (!responseEntries[key]) {
                                delete updatedFilter[key];
                            }
                        });

                        return updatedFilter;
                    });
                }
            }))
                .catch((error) => {
                    useNotifyEvent(error.msg, 1000, 'error')
                })
        }
        setInstallationsFilter({})
    }, [clientsFilter])

    return { installationsFilter, setInstallationsFilter }
}