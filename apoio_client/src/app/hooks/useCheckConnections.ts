import { IControllersStateType } from "../interfaces/IControllerStates"
import { ISimpleFilterPartition } from "../interfaces/IFilters";
import { useGetData } from "./useGetData"
import { useNotifyEvent } from "./useNotifyEvent"

export const useCheckConnections = async (clientsFilter: ISimpleFilterPartition, toggleState: (key: keyof IControllersStateType, state: boolean) => void): Promise<boolean | any> => {
    try {
        const response = await useGetData(
            `${process.env.VITE_API_URL}/api/v1/checkConnections?${Object.entries(clientsFilter)
                .filter(([_key, value]) => value.condition === true)
                .map(([key, _value]) => `&order=${key.replace(/ /g, "%20")}`)
                .join('')}`,
            {},
            toggleState
        );

        if (response) {
            console.log(response)
            return response;
        }
    } catch (error) {
        useNotifyEvent((error as {msg:any}).msg, 'error');
    }

    return false;
};