import './Main.css'
import { useState } from "react"
import { TopMenu, SideBar } from "../../components/Components"
import {
    Dashboard,
    Historico,
    Relatorios,
    Ajuda,
    ProdutividadeUBS,
    Mapa
} from "../RenderPages/RenderPages"


export const Main = () => {
    const [currentPage, setCurrentPage] = useState("relatorios");
    const renderPage = () => {
        switch (currentPage) {
            case "dashboard":
                return <Dashboard />;
            case "relatorios":
                return <Relatorios setCurrentPage={setCurrentPage} />;
            case "historico":
                return <Historico />;
            case "ajuda":
                return <Ajuda />;
            case "produtividadeubs":
                return <ProdutividadeUBS setCurrentPage={setCurrentPage} />;
            case "mapa":
                return <Mapa setCurrentPage={setCurrentPage}/>;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="body_page">
            <TopMenu />
            <div className="container_bottom">
                <SideBar setCurrentPage={setCurrentPage} />
                <div className="content_container">
                    {renderPage()}
                </div>
            </div>
        </div>
    )
}