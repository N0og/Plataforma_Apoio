import {
    ModalActions,
    Modal
} from "../../app/constants";


interface ModalState {
    isOpen: boolean;
    msg: Modal;
    values: any;
    confirmCallback?: (confirm: boolean) => void;
}

const initialState: ModalState = {
    isOpen: false,
    msg: Modal.EXCEPTION_SEARCH,
    values: undefined,
    confirmCallback: undefined,
};

export const modalReducer = (state = initialState, action: any) => {

    switch (action.type) {
        case ModalActions.OPEN:
            return {
                ...state,
                isOpen: true,
            };
        case ModalActions.CLOSE:
            return {
                ...state,
                isOpen: false,
                confirmCallback: undefined,
            };
        case ModalActions.CONFIRM:
            return {
                ...state,
                confirmCallback: action.payload,
            };

        case ModalActions.VALUE:
            return {
                ...state,
                values: action.payload
            }
        default:
            return state;
    }
}