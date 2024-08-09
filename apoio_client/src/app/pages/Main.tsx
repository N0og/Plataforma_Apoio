import './Main.css'
import { TopMenu, SideBar } from "../components"
import { renderPage } from '../components'
import { useSelector, TypedUseSelectorHook} from 'react-redux'
import { rootReducer } from '../../redux/root-reducer'


export const Main = () => {

    const useTypedSelector: TypedUseSelectorHook<rootReducer> = useSelector;

    const {currentPage} = useTypedSelector(rootReducer => rootReducer.pageReducer);

    return (
        <div className="body_page">
            <TopMenu />
            <div className="container_bottom">
                <SideBar/>
                <div className="content_container"> 
                    {renderPage({currentPage})}
                </div>
            </div>
            
        </div>
    )
}