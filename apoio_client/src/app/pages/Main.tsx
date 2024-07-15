import './Main.css'
import { useState, Suspense } from "react"
import { TopMenu, SideBar } from "../components"
import { PagesEnum } from '../constants/PageEnums'
import { setPage } from '../components'


export const Main = () => {
    const [currentPage, setCurrentPage] = useState<PagesEnum>(PagesEnum.Relatorios);

    return (
        <div className="body_page">
            <TopMenu />
            <div className="container_bottom">
                <SideBar setCurrentPage={setCurrentPage} />
                <div className="content_container">
                    <Suspense fallback={<div>Loading...</div>}>
                        {setPage({currentPage, setCurrentPage})}
                    </Suspense>
                </div>
            </div>
        </div>
    )
}