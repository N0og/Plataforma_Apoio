import {
    Dashboard,
    Historico,
    Relatorios,
    Ajuda,
    ProdutividadeUBS,
    Mapa,
    Duplicados,
    VisitasPrioritarias,
    Completude,
    Vacinas
} from "../../pages";
import { Pages } from '../../constants/';
import React from "react";

export function renderPage({ currentPage }: { currentPage: Pages }) {

    const pages: { [key in Pages]: React.ElementType } = {
        [Pages.DASHBOARD_PAGE]: Dashboard,
        [Pages.REPORTS_PAGE]: Relatorios,
        [Pages.HISTORY_PAGE]: Historico,
        [Pages.HELP_PAGE]: Ajuda,
        [Pages.TEAM_PROD_PAGE]: ProdutividadeUBS,
        [Pages.MAP_PAGE]: Mapa,
        [Pages.DUPLICATES_PAGE]: Duplicados,
        [Pages.PRIORITY_VISITS_PAGE]: VisitasPrioritarias,
        [Pages.COMPLETENESS]: Completude,
        [Pages.VACCINES]: Vacinas
    };
    const PageComponent = pages[currentPage];
    return <PageComponent currentPage={currentPage} />;
};
