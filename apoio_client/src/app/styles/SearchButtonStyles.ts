import styled from 'styled-components'

export const SearchButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 10vw;
    height: 1.5vw;

    button{
        width: 100%;
        height: 100%;
        border-radius: 0.3vw;
        border: none;
        background-color: var(--cor-rose);
        color: var(--cor-light);
        box-shadow: 0 2px 5px var(--cor-shadow-mid);
        transition: 0.1s;
        font-size:0.7vw;
        cursor: pointer;
    }

    button:hover{
        width: 100%;
        height: 105%;
        border-radius: 0.5vw;
        border: none;
        background-color: var(--cor-rose);
        color: var(--cor-light);
        box-shadow: 0 1px 3px var(--cor_black);
        cursor: pointer;
    }

    button:active{
        width: 98%;
        border-radius: 0.5vw;
        border: none;
        background-color: var(--cor-rose-mid);
        color: var(--cor-light);
        box-shadow: 0 1px 3px var(--cor_black);
        cursor: pointer;
    }
`