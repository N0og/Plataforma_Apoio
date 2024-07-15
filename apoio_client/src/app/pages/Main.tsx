import './Main.css'
import { useState } from "react"
import { TopMenu, SideBar } from "../components"
import { PagesEnum } from '../constants/PageEnums'
import { renderPage } from '../components'


export const Main = () => {
    const [currentPage, setCurrentPage] = useState<PagesEnum>(PagesEnum.Relatorios);

    return (
        <div className="body_page">
            <TopMenu />
            <div className="container_bottom">
                <SideBar setCurrentPage={setCurrentPage} />
                <div className="content_container"> 
                    {renderPage({currentPage, setCurrentPage})}
                </div>
            </div>
        </div>
    )
}