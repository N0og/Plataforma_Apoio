import { useDispatch } from "react-redux"
import { BackButtonContainer } from "../../styles"
import { PagesActions } from "../../constants"
import { useNavigate } from "react-router-dom"

export const BackButton: React.FC<{ emergencyRollBack?: boolean }> = ({ emergencyRollBack }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    return (
        <BackButtonContainer>
            <div className='back_button'>
                <span>Voltar</span>
            </div>
            <button onClick={() => {
                if (emergencyRollBack) {
                    navigate('/')
                }
                else {
                    dispatch({
                        type: PagesActions.BACKWARD
                    })
                }
            }}></button>
            <i className="fa-solid fa-circle-chevron-left"></i>
        </BackButtonContainer>
    )
}