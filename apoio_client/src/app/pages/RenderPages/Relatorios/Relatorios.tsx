//#region imports
import { Card } from "./Components/Components" //Components

import './Relatorios.css' //Styles
//#endregion

export const Relatorios:React.FC<{setCurrentPage:React.Dispatch<React.SetStateAction<string>>}> = ({setCurrentPage}) => {

    return (
        <div className='container_relatorios'>
            <div className='page-title'>
                
            <h2>PRINCIPAIS</h2>
                <span>RELATÓRIOS</span>
            </div>
            <div className="container_card">
                <Card icon={'fa-solid fa-hospital'} title="Produtividade UBS" onclick = {()=>{setCurrentPage('produtividadeubs')}}/>
                <Card icon={'fa-solid fa-id-badge'} title="Produtividade ACS" onclick = {()=>{setCurrentPage('produtividadeacs')}}/>
                <Card icon={'fa-solid fa-user-group'} title="Cadastros Duplicados" onclick = {()=>{setCurrentPage('duplicados')}}/>
                <Card icon={'fa-solid fa-syringe'} title="Imunização" onclick = {()=>{setCurrentPage('imunizacao')}}/>
                <Card icon={'fa-solid fa-people-roof'} title="Visitas Prioritárias" onclick = {()=>{setCurrentPage('prioritarias')}}/>
                <Card icon={'fa-solid fa-hospital-user'} title="Vínculo e Acompanhamento" onclick = {()=>{setCurrentPage('acompanhamento')}}/>
                <Card icon={'fa-solid fa-server'} title="Versionamento PEC" onclick = {()=>{setCurrentPage('versaopec')}}/>
                <Card icon={'fa-solid fa-house-medical-circle-xmark'} title="Atendimentos Não Finalizados" onclick = {()=>{setCurrentPage('naofinalizados')}}/>
            </div>
        </div>
                  
    )
}

//#region Exports SubPages

export { ProdutividadeUBS } from './RenderPages/RenderPages'

//#endregion