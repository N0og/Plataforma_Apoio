
import axios from "axios";

export function checkAuth(): Promise<boolean>{
    return new Promise((resolve, reject) => {
        axios.get(`${process.env.VITE_API_URL}/`, {
            headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
        })
        .
        then(() => {
            resolve(true) 
        })
        .catch(() => {
            reject(false)
        })
    })
    
}