
import '@fortawesome/fontawesome-free/css/all.css';
import { useState } from 'react';

export const SubMenu:React.FC<{loggedState:boolean}> = ({ loggedState }) => {

    const [devopt, setDevopt] = useState(false)
    const [isHovered, setIsHovered] = useState(false);

    if(devopt){
        if (loggedState){
            return(
                <div className="submenu_top">
                    <div className="item_container">
                        <div className="item">
                            <button><i className="fa-solid fa-user"></i></button>
                        </div>
                    </div>
                    <div className="item_container">
                        <div className="item">
                            <button><i className="fa-solid fa-right-to-bracket"></i></button>
                        </div>
                    </div>
                </div>
            )
        }

        else{
                return(
                    <div className="submenu_top">
                        <div className="item_login_container">
                            <div className="item_hover">
                                <div className="item_login">
                                    <span>Login</span> 
                                    <button
                                    onMouseEnter={() => setIsHovered(true)} 
                                    onMouseLeave={() => setIsHovered(false)}
                                    ><i className={isHovered ? "fa-solid fa-door-open" : "fa-solid fa-door-closed"}></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
        }
    }
    
}