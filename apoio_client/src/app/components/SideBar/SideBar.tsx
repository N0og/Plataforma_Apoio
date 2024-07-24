import { PagesEnum } from '../../constants/PageEnums';
import { InfoSystem, Item, ItemIcon, SideBarContainer, SideBarItem, SideBarStyled } from '../../styles';

export const SideBar: React.FC<{ setCurrentPage: React.Dispatch<React.SetStateAction<PagesEnum>> }> = ({ setCurrentPage }) => {

    return (
        <SideBarContainer>
            <SideBarStyled className="side_bar">
                <SideBarItem className="side_bar_item">
                    <ItemIcon className="item_icon"><i className="fa-solid fa-chart-simple"></i></ItemIcon>
                    <Item className="item">
                        <button onClick={() => { setCurrentPage(PagesEnum.Dashboard) }}></button>
                        <span>Dashboard</span>
                    </Item>
                </SideBarItem>
                <SideBarItem className="side_bar_item">
                    <ItemIcon className="item_icon"><i className="fa-solid fa-file-contract"></i></ItemIcon>
                    <Item className="item">
                        <button onClick={() => { setCurrentPage(PagesEnum.Relatorios) }}></button>
                        <span>Relatórios</span>
                    </Item>
                </SideBarItem>
                <SideBarItem className="side_bar_item">
                    <ItemIcon className="item_icon"><i className="fa-solid fa-map-location-dot"></i></ItemIcon>
                    <Item className="item">
                        <button onClick={() => { setCurrentPage(PagesEnum.Mapa) }}></button>
                        <span>Mapa</span>
                    </Item>
                </SideBarItem>
                <SideBarItem className="side_bar_item">
                    <ItemIcon className="item_icon"><i className="fa-solid fa-clock-rotate-left"></i></ItemIcon>
                    <Item className="item">
                        <button onClick={() => { setCurrentPage(PagesEnum.Historico) }}></button>
                        <span>Histórico</span>
                    </Item>
                </SideBarItem>
                <SideBarItem className="side_bar_item">
                    <ItemIcon className="item_icon"><i className="fa-solid fa-question"></i></ItemIcon>
                    <Item className="item">
                        <button onClick={() => { setCurrentPage(PagesEnum.Ajuda) }}></button>
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