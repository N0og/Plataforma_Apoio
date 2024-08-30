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
import { Pages, UserActions } from '../../constants/';
import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";

export function renderPage({ currentPage }: { currentPage: Pages }) {

    const dispatch = useDispatch();

    useEffect(() => {
        axios.get(`${process.env.VITE_API_URL}/`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }).then(() => {
            dispatch({ type: UserActions.LOGIN, payload: { isAuthenticated: true } });
        }).catch(error => {
            console.error("Erro durante a autenticação", error);
            dispatch({ type: UserActions.LOGOUT});
        });
    }, [currentPage]);

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
