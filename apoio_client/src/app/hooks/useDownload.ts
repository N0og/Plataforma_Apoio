import axios, { AxiosResponse } from "axios";
import { IControllersStateType } from "../interfaces/IControllerStates";

export const useDownload = async (url: string, params: object, setLoading:(key: keyof IControllersStateType, state:boolean) => void) => {
    setLoading('extract_state', true)
    try {
        const response: AxiosResponse<any, any> = await axios({
            method: 'get',
            url,
            params,
            responseType: 'blob'
        })

        if (response) {

            console.log(response.request)
            const contentDisposition:string = response.headers['content-disposition'];
            let fileName = 'arquivo.zip'; 

            if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
                if (fileNameMatch && fileNameMatch.length === 2) {
                    fileName = fileNameMatch[1].replace(/[^a-zA-Z0-9.\-_]/g, '_').replace(/_+$/, '');;
                }
            }    
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            console.error('Falha ao obter o arquivo.');
        }
        setLoading('extract_state', false)
        return true;
    } catch (error) {
        console.error('Erro na requisição GET: ', error);
        setLoading('extract_state', false)
        return null;
    }
};