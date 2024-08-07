import axios from "axios";
import { IControllersStateType } from "../interfaces/IControllerStates";

export const useGetData = (url: string, params: object, setLoading: (key: keyof IControllersStateType, state: boolean) => void) => {
    setLoading('loading_state', true);
    
    return new Promise((resolve, reject) => {
        axios({
            method: 'get', 
            url, 
            params,
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            setLoading('loading_state', false);
            resolve(response.data);
        })
        .catch(error => {
            console.error(error);
            setLoading('loading_state', false);
            reject({msg:error.response.data.msg, error});
        });
    });
};
