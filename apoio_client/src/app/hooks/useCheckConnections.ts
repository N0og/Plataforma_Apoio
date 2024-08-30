import { IControllersStateType } from "../interfaces/IControllerStates"
import { ISimpleFilterPartition, IDynamicFilterPartition } from "../interfaces/IFilters";
import { useGetData } from "./useGetData"
import { useNotifyEvent } from "./useNotifyEvent"

export const useCheckConnections = async (filters: { [key: string]: ISimpleFilterPartition | IDynamicFilterPartition }, toggleState: (key: keyof IControllersStateType, state: boolean) => void): Promise<boolean | any> => {
    try {
        let URL = `${process.env.VITE_API_URL}/api/v1/checkConnections?driver=psql`

        console.log(filters)
        if (Object.keys(filters).length > 0) {
            for (const [filter, value] of Object.entries(filters)) {
                if (filter === 'clients') {
                    URL += `${Object.entries(value)
                        .filter(([_key, value]) => value.condition === true)
                        .map(([key, _value]) => `&${filter}=${key.replace(/ /g, "%20")}`)
                        .join('')}`
                }

                else {
                    URL += `${Object.entries(value)
                        .flatMap(([_containerKey, containerValue]) =>
                            Object.entries(containerValue)
                                .filter(([_key, value]) => (value as {condition:boolean}).condition === true)
                                .map(([_key, value]) => `&${filter}=${(value as {value:boolean}).value}`)
                        )
                        .join('')
                        }`
                }
            }
        }

        console.log(URL)
        const response = await useGetData(
            URL,
            {},
            toggleState
        );

        if (response) {
            console.log(response)
            return response;
        }
    } catch (error) {
        useNotifyEvent((error as { msg: any }).msg, 'error');
    }

    return false;
};