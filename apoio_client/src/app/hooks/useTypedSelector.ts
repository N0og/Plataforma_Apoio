import {
    TypedUseSelectorHook,
    useSelector
} from 'react-redux';

import { rootReducer } from '../../redux/root-reducer';

export const useTypedSelector: TypedUseSelectorHook<rootReducer> = useSelector;