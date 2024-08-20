import { SubMenu } from "./components/SubMenu"
import "./TopMenu.css"


export const TopMenu = ()=>{
  
    return(
    
        <div className="container_top">
        <div className="left_container_top">
            <div className="title_top">
                <h1>ATEND</h1>
                <span>APOIO</span>
            </div>
        </div>
        <div className="mid_container_top">
        </div>
        <div className="right_container_top">  
            <img src="./nvtch.png" alt="" />
            
        </div>
        <SubMenu/> 
    </div>
    )

}