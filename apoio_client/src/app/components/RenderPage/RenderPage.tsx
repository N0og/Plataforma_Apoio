import {
    Dashboard,
    History,
    Reports,
    Help,
    TeamProductivity,
    Map,
    Duplicates,
    PriorityVisits,
    Completeness,
    Vaccines,
    OralCare,
    Procedures,
    NotFinished,
    VersionPEC
} from "../../pages";
import { Pages } from '../../constants/';
import React from "react";

export function renderPage({ currentPage }: { currentPage: Pages }) {

    const pages: { [key in Pages]: React.ElementType } = {
        [Pages.DASHBOARD_PAGE]: Dashboard,
        [Pages.REPORTS_PAGE]: Reports,
        [Pages.HISTORY_PAGE]: History,
        [Pages.HELP_PAGE]: Help,
        [Pages.TEAM_PROD_PAGE]: TeamProductivity,
        [Pages.MAP_PAGE]: Map,
        [Pages.DUPLICATES_PAGE]: Duplicates,
        [Pages.PRIORITY_VISITS_PAGE]: PriorityVisits,
        [Pages.COMPLETENESS]: Completeness,
        [Pages.VACCINES]: Vaccines,
        [Pages.ORAL_CARE_PAGE]: OralCare,
        [Pages.PROCEDURES]: Procedures,
        [Pages.NOT_FINISHED]: NotFinished,
        [Pages.VERSION_PEC]: VersionPEC
    };
    const PageComponent = pages[currentPage];
    return <PageComponent currentPage={currentPage} />;
};
