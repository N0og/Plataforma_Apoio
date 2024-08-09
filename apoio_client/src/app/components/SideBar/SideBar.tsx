import { useDispatch } from 'react-redux';
import { PagesActions, Pages } from '../../constants';
import {
    InfoSystem,
    Item,
    ItemIcon,
    SideBarContainer,
    SideBarItem,
    SideBarStyled
} from '../../styles';


export const SideBar = () => {

    const dispatch = useDispatch();

    const handleTogglePage = (page: Pages) => {
        dispatch({
            type: PagesActions.FORWARD,
            payload: page
        })
    }


    return (
        <SideBarContainer className="side_bar_container">
            <SideBarStyled className="side_bar">
                <SideBarItem className="side_bar_item">
                    <ItemIcon className="item_icon"><i className="fa-solid fa-chart-simple"></i></ItemIcon>
                    <Item className="item">
                        <button onClick={() => { handleTogglePage(Pages.DASHBOARD_PAGE) }}></button>
                        <span>Dashboard</span>
                    </Item>
                </SideBarItem>
                <SideBarItem className="side_bar_item">
                    <ItemIcon className="item_icon"><i className="fa-solid fa-file-contract"></i></ItemIcon>
                    <Item className="item">
                        <button onClick={() => { handleTogglePage(Pages.REPORTS_PAGE) }}></button>
                        <span>Relatórios</span>
                    </Item>
                </SideBarItem>
                <SideBarItem className="side_bar_item">
                    <ItemIcon className="item_icon"><i className="fa-solid fa-map-location-dot"></i></ItemIcon>
                    <Item className="item">
                        <button onClick={() => { handleTogglePage(Pages.MAP_PAGE) }}></button>
                        <span>Mapa</span>
                    </Item>
                </SideBarItem>
                <SideBarItem className="side_bar_item">
                    <ItemIcon className="item_icon"><i className="fa-solid fa-clock-rotate-left"></i></ItemIcon>
                    <Item className="item">
                        <button onClick={() => { handleTogglePage(Pages.HISTORY_PAGE) }}></button>
                        <span>Histórico</span>
                    </Item>
                </SideBarItem>
                <SideBarItem className="side_bar_item">
                    <ItemIcon className="item_icon"><i className="fa-solid fa-question"></i></ItemIcon>
                    <Item className="item">
                        <button onClick={() => { handleTogglePage(Pages.HELP_PAGE) }}></button>
                        <span>Ajuda</span>
                    </Item>
                </SideBarItem>
            </SideBarStyled>
            <InfoSystem className="infoSystem">
                <span>&copy; 2024 Apoio Novetech.</span>
            </InfoSystem>
        </SideBarContainer>
    );
}