import {
    PagesActions,
    Pages
} from "../../app/constants";

// Defina a interface para o estado do reducer
interface PageState {
    currentPage: Pages;
    previousPage: Pages[];
  }
  
  // Estado inicial com tipagem explícita
  const initialState: PageState = {
    currentPage: Pages.REPORTS_PAGE,
    previousPage: [],
  };

const pageReducer = (state = initialState, action: any) => {

    switch (action.type) {
        case PagesActions.FORWARD:
            if (action === Pages.HISTORY_PAGE) state.previousPage = []
            return {
                ...state,
                currentPage: action.payload,
                previousPage: [...state.previousPage, state.currentPage],
            };
        case PagesActions.BACKWARD:
            if (state.previousPage.length > 0) {
                const newPreviousPage = [...state.previousPage];
                const lastPage = newPreviousPage.pop();

                return {
                    ...state,
                    currentPage: lastPage,
                    previousPage: newPreviousPage,
                };
            }
            return { ...state, currentPage: Pages.REPORTS_PAGE };
        default:
            return state;
    }
};

export default pageReducer;
