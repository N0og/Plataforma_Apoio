import { ReportContainer, TitlePageContainer, ViewPageContainer } from '../../styles'
import { BackButton } from '../BackButton'
import './DevStep.css'

export const DevStep = () => {
    return (
        <ReportContainer>
            <TitlePageContainer>
                <BackButton />
                <div className='title_container'>
                    <h4>MÃOS A OBRA</h4>
                </div>
            </TitlePageContainer>
            <ViewPageContainer className='dev_moment'>
                <i className="fa-solid fa-person-digging"></i>
                <div className="msg_container">

                    <i className="fa-brands fa-dev"></i>
                    <span> EM DESENVOLVIMENTO </span>
                    <i className="fa-brands fa-dev"></i>
                </div>
            </ViewPageContainer>
        </ReportContainer>
    )
}