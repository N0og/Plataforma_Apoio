import { useEffect, useState } from "react"
import { SubMenu } from "./components/SubMenu"
import "./TopMenu.css"


export const TopMenu = ()=>{

    const [loggedState, _setLoged] = useState(false)

    useEffect(()=>{
        //Verifica a autenticação aqui.
    },[])

   
    return(
    
        <div className="container_top">
        <div className="left_container_top">
            <div className="title_top">
                <h1>PLATAFORMA</h1>
                <span>APOIO</span>
            </div>
        </div>
        <div className="mid_container_top">
        </div>
        <div className="right_container_top">
            <SubMenu loggedState={loggedState}/>
        </div>
    </div>
    )

}