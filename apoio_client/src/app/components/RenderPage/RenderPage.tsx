import {
    Dashboard,
    Historico,
    Relatorios,
    Ajuda,
    ProdutividadeUBS,
    Mapa
} from "../../pages";
import { Pages } from '../../constants/PageEnums';
import React from "react";

type RenderPagesProps = {
    currentPage: Pages,
    setCurrentPage: React.Dispatch<React.SetStateAction<Pages>>
}

export const renderPage = ({ currentPage, setCurrentPage }: RenderPagesProps) => {
    const pages: { [key in Pages]: React.ElementType } = {
        [Pages.Dashboard]: Dashboard,
        [Pages.Relatorios]: Relatorios,
        [Pages.Historico]: Historico,
        [Pages.Ajuda]: Ajuda,
        [Pages.ProdutividadeUBS]: ProdutividadeUBS,
        [Pages.Mapa]: Mapa,
    };

    const PageComponent = pages[currentPage];

    return <PageComponent setCurrentPage={setCurrentPage} />;

};

export default renderPage;
