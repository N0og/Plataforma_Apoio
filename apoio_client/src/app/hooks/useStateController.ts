import { useState } from "react";
import { IControllersStateType } from "../interfaces/IControllerStates";

export const useStateController = (initialState?: IControllersStateType) => {

    const [control_states, setControl] = useState<IControllersStateType>(initialState ? initialState : {});

    const toggleState = (key: keyof IControllersStateType, state: boolean) => {

        setControl((prevControl) => ({
            ...prevControl,
            [key]: state
        }));
        return true

    }

    const toggleAllFalse = () => {
        setControl((prevControl) => {
            const newState = {} as IControllersStateType;
            for (const key in prevControl) {
                newState[key as keyof IControllersStateType] = false;
            }
            return newState;
        });
        return true;
    }

    return {
        control_states,
        toggleState,
        toggleAllFalse
    }
}

