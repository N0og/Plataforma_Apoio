import axios from "axios";
import { IControllersStateType } from "../interfaces/IControllerStates";


export const useDownload = async (url: string, params: object, setLoading: (key: keyof IControllersStateType, state: boolean) => void) => {
    setLoading('extract_state', true)
    return new Promise((resolve, reject) => {
        axios({
            method: 'get',
            url,
            params: { ...params, download: true },
            responseType: 'blob',
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }

        }).then(async response => {
            setLoading('extract_state', false);



            const contentDisposition: string = response.headers['content-disposition'];
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
            resolve(true);

        })
            .catch(async error => {
                console.error(error);
                setLoading('extract_state', false);
                const contentType = error.response.headers['content-type'];

                if (contentType && contentType.includes('application/json')) {
                    const text = await error.response.data.text();
                    const jsonResponse = JSON.parse(text);
                    console.log(jsonResponse)
                    reject(jsonResponse);
                } else {
                    reject({ msg: 'Falha na coleta de informações', error });
                }
            });
    })
};