import { useState } from "react";
import { IControllersStateType } from "../interfaces/IControllerStates";

export const useStateController = (initialState?: IControllersStateType) => {

    const [control_states, setControl] = useState<IControllersStateType>(initialState ? initialState : {});
    
    const toggleState = (key:keyof IControllersStateType, state:boolean) => {
        setControl({
            ...control_states,
            [key]: state
        })
    }

    return {
        control_states,
        toggleState
    }
}

