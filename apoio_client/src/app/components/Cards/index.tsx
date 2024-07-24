import { CardButton, CardContainer, CardStyled, CardIcon, CardTitle } from '../../styles'

export const Card: React.FC<{
    icon: string,
    title: string,
    onclick: Function
}> = ({ icon, title, onclick }) => {

    return (
        <CardContainer>
            <CardStyled>
                <CardButton onClick={() => { onclick() }}></CardButton>
                <CardIcon><i className={icon}></i></CardIcon>
                <CardTitle><span>{title}</span></CardTitle>
            </CardStyled>
        </CardContainer>
    )
}