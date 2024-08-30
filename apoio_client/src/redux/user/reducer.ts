import { UserActions } from "../../app/constants";

const initialState = {
    user : null,
    isAuthenticated: false
};

export const userReducer = (state = initialState, action: any) => {

    switch (action.type) {
        case UserActions.LOGIN:
            return {...state, user:action.payload.user, isAuthenticated: action.payload.isAuthenticated}

        case UserActions.LOGOUT:
            localStorage.clear() 
            return {...state, ...initialState}
        default:
            return state;
    }
};

