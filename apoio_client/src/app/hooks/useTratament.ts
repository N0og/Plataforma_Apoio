import { ISimpleFilterPartition } from "../interfaces/IFilters";
import { useNotifyEvent } from "./useNotifyEvent"


type filtersTypes = {
    no_empty?: { filter: any, enums: any }[],
    only_one?: { filter: any, enums: any }[]
}

const isSimpleFilterPartition = (obj: any) => {
    if (typeof obj !== 'object' || obj === null) {
        return false;
    }

    for (const key in obj) {
        if (typeof obj[key] !== 'object' || obj[key] === null || !('condition' in obj[key])) {
            return false;
        }

        if (typeof obj[key].condition !== 'boolean') {
            return false;
        }
    }

    return true;
}

export const useTratament = (filters: filtersTypes, toggleAllFalse: any) => {
    toggleAllFalse()
    if (filters.no_empty)
        for (const { filter, enums } of filters.no_empty) {

            let filtered: any;

            if (isSimpleFilterPartition(filter)) {
                filtered = Object.entries(filter)
                    .filter(([_key, value]) => (value as { condition: boolean }).condition == true)
            }
            else {
                filtered = Object.entries(filter)
                    .flatMap(([_containerKey, containerValue]) =>
                        Object.entries(containerValue as ISimpleFilterPartition)
                            .filter(([_key, value]: [string, any]) => value.condition === true))
            }


            if (filtered.length == 0) {
                useNotifyEvent(enums.LESS, 'error', 1000)
                return false
            }
        }

    if (filters.only_one)
        for (const { filter, enums } of filters.only_one) {
            let filtered: any;

            if (isSimpleFilterPartition(filter)) {
                filtered = Object.entries(filter)
                    .filter(([_key, value]) => (value as { condition: boolean }).condition == true)
            }
            else {
                filtered = Object.entries(filter)
                    .flatMap(([_containerKey, containerValue]) =>
                        Object.entries(containerValue as ISimpleFilterPartition)
                            .filter(([_key, value]: [string, any]) => value.condition === true))
            }

            if (filtered.length > 1) {
                useNotifyEvent(enums.EXCESS, 'error', 1000)
                return false;
            }
        }

    return true;
}
