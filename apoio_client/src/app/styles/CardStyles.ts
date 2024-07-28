import styled from 'styled-components'

export const CardContainer = styled.div`
    display:flex;
    flex-direction: center;
    justify-content:center;
    width: 11.5vw;
    height: 5vw;
`

export const CardStyled = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 10vw;
    height: 4vw;
    border-radius: 1vw;
    background-color: var(--cor-min_grey);
    box-shadow: 0px 0.3vw 0.1vw 0px var(--cor-shadow-mid);
    transition: 0.3s;
    gap: 0.5vw;
    padding: 0.5vw;

    &:hover{
        box-shadow: 0px 0px 0.0vw 0.1vw var(--cor-shadow-mid);
        width: 10.5vw;
    }

    &:active{
        background-color: #d5d4d4;
        box-shadow: 0px 0px 0.0vw 0.2vw var(--cor-shadow-mid);
        width: 12vw;
    }
`

export const CardIcon = styled.div`
    display: flex;
    left: 1vw;
    justify-content: center;
    align-items: center;
    font-size: 2vw;
    i{
        color: var(--cor-rose);
    }
`

export const CardButton = styled.button`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: absolute;
    background-color: transparent;
    width: 100%;
    height: 100%;
    border-radius: 35px;
    border: none;
    cursor: pointer;
    z-index: 999;
`
export const CardTitle = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 60%;
    
    span{
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        text-wrap: wrap;
        width: 100%;
        height: 100%; 
        font-size: 0.7vw;
    }
`