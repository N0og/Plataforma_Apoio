import styled from 'styled-components';

export const LoginPageContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 100%;
    min-height: 100vh;
    overflow: hidden;
`;

export const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 10rem;
    align-items: center;
    width: 450px;
    min-height: 400px;
    padding: 2rem;
    background-color: #ffffff;
    border-radius: 15px;
    gap: 2.5rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    z-index: 9999;
    user-select: none;

    @media (max-width:1350px){
        position: relative;
        left: 0;
    }

    @media (max-width: 550px){
        justify-content: center;
        width: 100%;
        height: 100vh;
        position: relative;
        left: 0rem;
    }
`;

export const TopLoginContainer = styled.div`
    text-align: center;
    margin-bottom: 0.5rem;
    width: 100%;
`;

export const TitleLogin = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
    width: 100%;
    margin-bottom: 1rem;
    gap: 0.5rem;

    h1{
        font-size: 35px;
    }
    span{
        font-size: 35px;
        font-weight: bold;
        color:var(--cor-rose)
    }
`;

export const SubTitleLogin = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 25px;
    font-weight: bold;
    flex-wrap: wrap;
    width: 100%;
    margin-bottom: 2rem;
    gap: 0.5rem;
    .Title{
        color: black;
    }
    .TitleSpan{
        color: var(--cor-rose);  
        font-weight: bold;
    }
`;

export const CenterLoginContainer = styled.div`
    width: 100%;
`;

export const BottomLoginContainer = styled.div`
    width: 100%;
`;

export const SubmitButton = styled.button`
  background-color: var(--cor-rose);
  color: var(--cor-light);
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--cor-rose-mid);
  }
`;

export const ImageLogoContainer = styled.div`
    display: flex;
    position: fixed;
    right: 10rem;
    opacity: 90%;
    img {
        width: 100%;
        max-height: 100vh;
        filter: drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.5));
    }

    @media (max-width:1350px){
        display: none;
    }

`