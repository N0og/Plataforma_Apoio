import styled from 'styled-components'

export const BackButtonContainer = styled.div` 
    display: flex;
    justify-content: start;
    align-items: center;
    position: absolute;
    left: 20px;
    height: 45%;
    width: 1%;
    transition:0.2s;
    z-index:9997;
    .back_button{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background-color: var(--cor-min_grey);  
        border-radius: 50px;
        opacity: 0%;
        transition:0.5s;
        span{
            opacity: 0%;
            font-size: 0.8vi;
            color:black;
        }
    }

    i{
        position: absolute;
        font-size: 1.4vw;
        left:-2px;
        color: var(--cor-min_grey);
    }

    button{
        width:100%;
        height: 100%;
        position: absolute;
        z-index: 100%;
        cursor: pointer;
        background-color: transparent;
        border-radius: 100%;
        z-index: 999;
        border: none;
    }

    &:hover{
        width: 7%;
        .back_button, span{
            opacity: 100%;
        }
        i{
            color: var(--cor-rose);
        }
    }
`