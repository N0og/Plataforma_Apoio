import { useTypedSelector } from '../../hooks'
import { ReportContainer, TitlePageContainer, ViewPageContainer } from '../../styles'
import { BackButton } from '../BackButton'

import './Unauthorized.css'

export const Unauthorized = () => {

    const { isAuthenticated } = useTypedSelector(rootReducer => rootReducer.userReducer)

    return (
        <ReportContainer>

            <TitlePageContainer>
                <div className='title_container'>
                    <h4>{isAuthenticated ? 'Retorne a URL principal' : 'Realize o login'}</h4>
                </div>
                {isAuthenticated ? (<BackButton emergencyRollBack={isAuthenticated}/>) : (null)}
            </TitlePageContainer>
            <ViewPageContainer className='dev_moment'>
                <div className="msg_container">            
                    <span> NÃO AUTORIZADO </span>              
                </div>
            </ViewPageContainer>
        </ReportContainer>
    )
}