import axios from "axios";
import { IControllersStateType } from "../interfaces/IControllerStates";

export const useGetData = async (url: string, params: object, setLoading:(key: keyof IControllersStateType, state:boolean) => void) => {
    setLoading('loading_state', true)
    try {
        const response = await axios({
            method: 'get', 
            url, 
            params,
            headers:{
                'Content-Type': 'application/json',
            }});     
        setLoading('loading_state', false)
        return response.data;
    } catch (error) {
        console.error('Erro na requisição GET: ', error);
        setLoading('loading_state', false)
        return null;
    }
};
