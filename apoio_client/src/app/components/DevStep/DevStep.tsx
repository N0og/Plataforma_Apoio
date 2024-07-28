import { BackButton } from '../BackButton'
import './DevStep.css'

export const DevStep = () =>{
   return(
        <div className="dev_moment">
            
            <i className="fa-solid fa-person-digging"></i>
            <div className="msg_container">
                
                <i className="fa-brands fa-dev"></i>
                <BackButton/>
                <span> EM DESENVOLVIMENTO </span>  
                <i className="fa-brands fa-dev"></i>
            </div>
        </div>
   )
}