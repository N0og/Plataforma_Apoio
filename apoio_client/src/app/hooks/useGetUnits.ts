import { useEffect, useState } from "react"
import { useGetData } from "./useGetData"
import { IControllersStateType } from "../interfaces/IControllerStates"
import { IDynamicFilterPartition } from "../interfaces/IFilters";
import { useNotifyEvent } from "./useNotifyEvent";

export const useGetUnits = (installationsFilter: IDynamicFilterPartition, toggleState: (key: keyof IControllersStateType, state: boolean) => void) => {

    const [UnitsFilter, setUnitsFilter] = useState<IDynamicFilterPartition>({});

    useEffect(() => {
        if (Object.keys(installationsFilter).length > 0) {
            useGetData(
                `${process.env.VITE_API_URL}/api/v1/filters/unidades?dbtype=psql${Object.entries(installationsFilter)
                    .flatMap(([_containerKey, containerValue]) =>
                        Object.entries(containerValue)
                            .filter(([_key, value]) => value.condition === true)
                            .map(([_key, value]) => `&order=${value.value}`)
                    )
                    .join('')
                }`,
                {},
                toggleState
            ).then((response => {
                if (response) {
                    setUnitsFilter((prevFilter) => {

                        const responseEntries: IDynamicFilterPartition = Object.entries(response)
                            .filter(([_key, value]) => Object.keys(value).length > 0)
                            .map(([key, value]) => { return { [key]: value } })
                            .reduce((obj1, obj2) => ({ ...obj1, ...obj2 }), {})

                        const updatedFilter = { ...prevFilter };

                        Object.entries(responseEntries).forEach(([key1, value1]) => {
                            Object.entries(value1).forEach(([key2, value2]) => {
                                if (!(key1 in updatedFilter)) {
                                    updatedFilter[key1] = value1
                                    updatedFilter[key1][key2] = value2;
                                }
                            })
                        })

                        Object.keys(prevFilter).forEach((key) => {
                            if (!responseEntries[key]) {
                                delete updatedFilter[key];
                            }
                        });

                        return updatedFilter
                    });
                }

            }))
                .catch((error) => {
                    useNotifyEvent(error.msg, 1000, 'error')
                })
        }
        else setUnitsFilter({})
    }, [installationsFilter])

    return { UnitsFilter, setUnitsFilter }
}