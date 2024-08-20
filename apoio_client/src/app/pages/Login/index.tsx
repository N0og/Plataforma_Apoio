import { useRef } from 'react';
import { Form } from '../../components/Form';
import {
    BottomLoginContainer,
    CenterLoginContainer,
    ImageLogoContainer,
    LoginContainer,
    LoginPageContainer,
    SubmitButton,
    SubTitleLogin,
    TitleLogin,
    TopLoginContainer
} from '../../styles/LoginPageStyles';
import { useTypedSelector } from '../../hooks';

export const Login = () => {
    // Criando uma referência para o componente Form

    const randomImg = [
        'istp',
        'istp-v',
        'istp-p',
        'istp-v-red',
        'istp-v-blue'
    ]
    const formRef = useRef<{ handleLogin: () => void }>(null);
    const userContext = useTypedSelector(state => state.userReducer);
    console.log(userContext)

    const handleButtonClick = () => {
        if (formRef.current) {
            formRef.current.handleLogin(); // Chama a função de login diretamente
        }
    };

    return (
        <LoginPageContainer>
            <LoginContainer>
                <TopLoginContainer>
                    <TitleLogin>
                        <h1>ATEND</h1>
                        <span>APOIO</span>
                    </TitleLogin>
                    <SubTitleLogin>
                        <span className='Title'>Bem-vindo ao</span>
                        <span className='TitleSpan'>LOGIN</span>
                    </SubTitleLogin>
                    <span>Preencha os dados do login para acessar</span>
                </TopLoginContainer>
                <CenterLoginContainer>
                    {/* Passando a ref para o Form */}
                    <Form ref={formRef} />
                </CenterLoginContainer>
                <BottomLoginContainer>
                    {/* Botão chama a função de login diretamente */}
                    <SubmitButton type="button" onClick={handleButtonClick}>
                        Entrar
                    </SubmitButton>
                </BottomLoginContainer>
            </LoginContainer>
            <ImageLogoContainer>
                <img src={`./${randomImg[Math.floor(Math.random() * randomImg.length)]}.png`} alt="Logo" />
            </ImageLogoContainer>
        </LoginPageContainer>
    );
};
