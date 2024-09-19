//#region imports

//Components
import { Card } from "../../components"

//Constants
import { Pages } from "../../constants"

//Styles
import {
    CardsContainer,
    ContentContainer,
    RelatoriosPageContainer
} from "../../styles"
//#endregion

export const Reports = () => {
    return (
        <RelatoriosPageContainer>
            <div className='page-title'>
                <h2>PRINCIPAIS</h2>
                <span>RELATÓRIOS</span>
            </div>
            <ContentContainer>
                <CardsContainer>
                    <Card icon={'fa-solid fa-hospital'} title="Produtividade UBS" page={Pages.TEAM_PROD_PAGE} />
                    <Card icon={'fa-solid fa-user'} title="Cadastros Individuais" page={Pages.COMPLETENESS} />
                    <Card icon={'fa-solid fa-user-group'} title="Cadastros Duplicados" page={Pages.DUPLICATES_PAGE} />
                    <Card icon={'fa-solid fa-syringe'} title="Imunização" page={Pages.VACCINES} />
                    <Card icon={'fa-solid fa-people-roof'} title="Visitas Prioritárias" page={Pages.PRIORITY_VISITS_PAGE} />
                    <Card icon={'fa-solid fa-server'} title="Versionamento PEC" page={Pages.VERSION_PEC} />
                    <Card icon={'fa-solid fa-house-medical-circle-xmark'} title="Atendimentos Não Finalizados" page={Pages.NOT_FINISHED} />
                    <Card icon={'fa-solid fa-tooth'} title="Cuidados Bucais" page={Pages.ORAL_CARE_PAGE} />
                    <Card icon={'fa-solid fa-hands-holding-child'} title="Procedimentos" page={Pages.PROCEDURES} />
                    <Card icon={'fa-solid fa-universal-access'} title="Garantia de Acesso" page={Pages.GUARANTEED_ACCESS} />
                    <Card icon={'fa-solid fa-teeth'} title="Saúde Bucal - SR" page={Pages.ORAL_HEALTH} />
                </CardsContainer>
            </ContentContainer>
        </RelatoriosPageContainer>

    )
}
