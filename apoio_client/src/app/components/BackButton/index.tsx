import { PagesEnum } from "../../constants"
import { BackButtonContainer } from "../../styles"
import { DefaultProps } from "../../types"

export const BackButton: React.FC<DefaultProps> = ({setCurrentPage}) => {
    return (
        <BackButtonContainer>
            <div className='back_button'>
                <span>Voltar</span>
            </div>
            <button onClick={() => setCurrentPage(PagesEnum.Relatorios)}></button>
            <i className="fa-solid fa-circle-chevron-left"></i>
        </BackButtonContainer>
    )
}