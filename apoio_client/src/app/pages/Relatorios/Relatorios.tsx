//#region imports
import { PagesEnum } from "../../constants/PageEnums" //Enum - Pages
import { DefaultProps } from "../../types"
import { Card } from "../../components" //Components

import './Relatorios.css' //Styles
//#endregion

export const Relatorios: React.FC<DefaultProps> = ({ setCurrentPage })=> {

    return (
        <div className='container_relatorios'>
            <div className='page-title'>
                
            <h2>PRINCIPAIS</h2>
                <span>RELATÓRIOS</span>
            </div>
            <div className="container_card">
                <Card icon={'fa-solid fa-hospital'} title="Produtividade UBS" onclick = {()=>{setCurrentPage(PagesEnum.ProdutividadeUBS)}}/>
                <Card icon={'fa-solid fa-id-badge'} title="Produtividade ACS" onclick = {()=>{setCurrentPage(PagesEnum.Ajuda)}}/>
                <Card icon={'fa-solid fa-user-group'} title="Cadastros Duplicados" onclick = {()=>{setCurrentPage(PagesEnum.Ajuda)}}/>
                <Card icon={'fa-solid fa-syringe'} title="Imunização" onclick = {()=>{setCurrentPage(PagesEnum.Ajuda)}}/>
                <Card icon={'fa-solid fa-people-roof'} title="Visitas Prioritárias" onclick = {()=>{setCurrentPage(PagesEnum.Ajuda)}}/>
                <Card icon={'fa-solid fa-hospital-user'} title="Vínculo e Acompanhamento" onclick = {()=>{setCurrentPage(PagesEnum.Ajuda)}}/>
                <Card icon={'fa-solid fa-server'} title="Versionamento PEC" onclick = {()=>{setCurrentPage(PagesEnum.Ajuda)}}/>
                <Card icon={'fa-solid fa-house-medical-circle-xmark'} title="Atendimentos Não Finalizados" onclick = {()=>{setCurrentPage(PagesEnum.Ajuda)}}/>
            </div>
        </div>
                  
    )
}
