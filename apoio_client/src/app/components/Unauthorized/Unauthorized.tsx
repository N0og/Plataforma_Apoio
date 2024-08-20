import { ReportContainer, TitlePageContainer, ViewPageContainer } from '../../styles'

import './Unauthorized.css'

export const Unauthorized = () => {
    return (
        <ReportContainer>
            <TitlePageContainer>
                <div className='title_container'>
                    <h4>Realize o login</h4>
                </div>
            </TitlePageContainer>
            <ViewPageContainer className='dev_moment'>
                <div className="msg_container">

                    <i className="fa-solid fa-xmark"></i>
                    <span> NÃO AUTORIZADO </span>
                    <i className="fa-solid fa-xmark"></i>
                </div>
            </ViewPageContainer>
        </ReportContainer>
    )
}