import { useDispatch } from "react-redux"
import { BackButtonContainer } from "../../styles"
import { PagesActions } from "../../constants"

export const BackButton = () => {

    const dispatch = useDispatch()

    return (
        <BackButtonContainer>
            <div className='back_button'>
                <span>Voltar</span>
            </div>
            <button onClick={() => {
                dispatch({
                    type: PagesActions.BACKWARD
                })
            }}></button>
            <i className="fa-solid fa-circle-chevron-left"></i>
        </BackButtonContainer>
    )
}