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
                    {/*<Card icon={'fa-solid fa-id-badge'} title="Produtividade ACS" page={Pages.HELP_PAGE} />*/}
                    <Card icon={'fa-solid fa-user-group'} title="Completude" page={Pages.COMPLETENESS} />
                    <Card icon={'fa-solid fa-user-group'} title="Cadastros Duplicados" page={Pages.DUPLICATES_PAGE} />
                    <Card icon={'fa-solid fa-syringe'} title="Imunização" page={Pages.VACCINES} />
                    <Card icon={'fa-solid fa-people-roof'} title="Visitas Prioritárias" page={Pages.PRIORITY_VISITS_PAGE} />
                    {/*<Card icon={'fa-solid fa-hospital-user'} title="Vínculo e Acompanhamento" page={Pages.HELP_PAGE} />*/}
                    <Card icon={'fa-solid fa-server'} title="Versionamento PEC" page={Pages.HELP_PAGE} />
                    <Card icon={'fa-solid fa-house-medical-circle-xmark'} title="Atendimentos Não Finalizados" page={Pages.NOT_FINISHED} />
                    <Card icon={'fa-solid fa-tooth'} title="Saúde Bucal" page={Pages.ORAL_CARE_PAGE} />
                    <Card icon={'fa-solid fa-hands-holding-child'} title="Procedimentos" page={Pages.PROCEDURES} />
                </CardsContainer>
            </ContentContainer>
        </RelatoriosPageContainer>

    )
}
