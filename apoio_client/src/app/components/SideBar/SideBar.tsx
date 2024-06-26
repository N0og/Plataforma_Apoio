import './SideBar.css'

export const SideBar:React.FC<{setCurrentPage:React.Dispatch<React.SetStateAction<string>>}> = ({setCurrentPage}) => {


    return (
        <div className="side_bar_container">
            <div className="side_bar">
                    <div className="side_bar_item">
                        <div className='item_icon'><i className="fa-solid fa-chart-simple"></i></div>
                        <div className='item'>
                            <button onClick={()=>{setCurrentPage("dashboard")}}></button>
                            <span>Dashboard</span>
                        </div>
                    </div>
                    <div className="side_bar_item">
                        <div className='item_icon'><i className="fa-solid fa-file-contract"></i></div>
                        <div className='item'>
                            <button onClick={()=>{setCurrentPage("relatorios")}}></button>
                            <span>Relatórios</span>
                        </div>
                    </div>
                    <div className="side_bar_item">
                        <div className='item_icon'><i className="fa-solid fa-map-location-dot"></i></div>
                        <div className='item'>
                            <button onClick={()=>{setCurrentPage("mapa")}}></button>
                            <span>Mapa</span>
                        </div>
                    </div>
                    <div className="side_bar_item">
                        <div className='item_icon'><i className="fa-solid fa-clock-rotate-left"></i></div>
                        <div className='item'>
                            <button onClick={()=>{setCurrentPage("historico")}}></button>
                            <span>Histórico</span>
                        </div>
                    </div>
                    <div className="side_bar_item">
                        <div className='item_icon'><i className="fa-solid fa-question"></i></div>
                        <div className='item'>
                            <button onClick={()=>{setCurrentPage("ajuda")}}></button>
                            <span>Ajuda</span>
                        </div>
                    </div>
            </div>
            <div className='infoSystem'>
                <span>&copy; 2024 Apoio Novetech.</span>
            </div>
        </div>
    );
}