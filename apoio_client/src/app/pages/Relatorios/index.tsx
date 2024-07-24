//#region imports
import { PagesEnum } from "../../constants/PageEnums" //Enum - Pages
import { DefaultProps } from "../../types"
import { Card } from "../../components" //Components
import { CardsContainer, ContentContainer, RelatoriosPageContainer } from "../../styles"
//#endregion

export const Relatorios: React.FC<DefaultProps> = ({ setCurrentPage }) => {

    return (
        <RelatoriosPageContainer>
            <div className='page-title'>
                <h2>PRINCIPAIS</h2>
                <span>RELATÓRIOS</span>
            </div>
            <ContentContainer>
                <CardsContainer>
                    <Card icon={'fa-solid fa-hospital'} title="Produtividade UBS" onclick={() => { setCurrentPage(PagesEnum.ProdutividadeUBS) }} />
                    <Card icon={'fa-solid fa-id-badge'} title="Produtividade ACS" onclick={() => { setCurrentPage(PagesEnum.Ajuda) }} />
                    <Card icon={'fa-solid fa-user-group'} title="Completude" onclick={() => { setCurrentPage(PagesEnum.Completude) }} />
                    <Card icon={'fa-solid fa-user-group'} title="Cadastros Duplicados" onclick={() => { setCurrentPage(PagesEnum.Duplicados) }} />
                    <Card icon={'fa-solid fa-syringe'} title="Imunização" onclick={() => { setCurrentPage(PagesEnum.Vacinas) }} />
                    <Card icon={'fa-solid fa-people-roof'} title="Visitas Prioritárias" onclick={() => { setCurrentPage(PagesEnum.VisitasPrioritarias) }} />
                    <Card icon={'fa-solid fa-hospital-user'} title="Vínculo e Acompanhamento" onclick={() => { setCurrentPage(PagesEnum.Ajuda) }} />
                    <Card icon={'fa-solid fa-server'} title="Versionamento PEC" onclick={() => { setCurrentPage(PagesEnum.Ajuda) }} />
                    <Card icon={'fa-solid fa-house-medical-circle-xmark'} title="Atendimentos Não Finalizados" onclick={() => { setCurrentPage(PagesEnum.Ajuda) }} />
                </CardsContainer>
            </ContentContainer>
        </RelatoriosPageContainer>

    )
}
