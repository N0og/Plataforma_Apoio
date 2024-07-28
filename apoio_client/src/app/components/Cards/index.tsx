import { useDispatch } from 'react-redux';
import { CardButton, CardContainer, CardStyled, CardIcon, CardTitle } from '../../styles'
import { PagesActions, Pages } from '../../constants';

export const Card: React.FC<{
    icon: string,
    title: string,
    page: Pages
}> = ({
    icon,
    title,
    page }) => {

        const dispatch = useDispatch();

        return (
            <CardContainer>
                <CardStyled>
                    <CardButton onClick={() => {
                        dispatch({
                            type: PagesActions.FORWARD,
                            payload: page
                        })
                    }}></CardButton>
                    <CardIcon><i className={icon}></i></CardIcon>
                    <CardTitle><span>{title}</span></CardTitle>
                </CardStyled>
            </CardContainer>
        )
    }