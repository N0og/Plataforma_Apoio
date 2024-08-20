import './Main.css'
import { TopMenu, SideBar } from "../components"
import { renderPage } from '../components'
import { useTypedSelector } from '../hooks'



export const Main = () => {
   
   
    const {currentPage} = useTypedSelector(rootReducer => rootReducer.pageReducer);

    return (
        <div className="body_page">
            <TopMenu />
            <div className="container_bottom">
                <SideBar/>
                <div className="content_container"> 
                    {renderPage({currentPage})}
                </div>
            </div>
            
        </div>
    )
}