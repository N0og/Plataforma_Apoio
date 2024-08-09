import styled from 'styled-components'

export const BackButtonContainer = styled.div` 
    display: flex;
    justify-content: start;
    align-items: center;
    position: absolute;
    left: 10px;
    height: 18px;
    width: 20px;
    transition:0.2s;
    z-index:9997;

    .back_button{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: var(--cor-min_grey);
        border-radius: 50px;
        width: 100%;
        height: 100%;
        opacity: 0%;
        transition:0.5s;
        span{
            opacity: 0%;
            padding-left: 20px;
            font-size: 12px;
            color:black;
        }
    }

    i{
        position: absolute;
        font-size: 20px;
        left:-1px;
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
        width: 90px;
        .back_button, span{
            opacity: 100%;
        }
        i{
            color: var(--cor-rose);
        }

        @media (max-width: 768px){
            width: 20px;
            .back_button, span{
                display: none;
            }
            i{
                color: var(--cor-shadow-mid);
            }
        }
    }
`