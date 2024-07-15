import {
    Dashboard,
    Historico,
    Relatorios,
    Ajuda,
    ProdutividadeUBS,
    Mapa
} from "../../pages";
import { PagesEnum } from '../../constants/PageEnums';
import React from "react";

type RenderPagesProps = {
    currentPage: PagesEnum,
    setCurrentPage: React.Dispatch<React.SetStateAction<PagesEnum>>
}

export const renderPage = ({ currentPage, setCurrentPage }: RenderPagesProps) => {
    const pages: { [key in PagesEnum]: React.ElementType } = {
        [PagesEnum.Dashboard]: Dashboard,
        [PagesEnum.Relatorios]: Relatorios,
        [PagesEnum.Historico]: Historico,
        [PagesEnum.Ajuda]: Ajuda,
        [PagesEnum.ProdutividadeUBS]: ProdutividadeUBS,
        [PagesEnum.Mapa]: Mapa,
    };

    const PageComponent = pages[currentPage];

    return <PageComponent setCurrentPage={setCurrentPage} />;

};

export default renderPage;