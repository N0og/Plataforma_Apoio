import styled from 'styled-components'

export const SearchButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 10vw;
    height: 1.6vw;

    button{
        width: 100%;
        height: 100%;
        border-radius: 0.3vw;
        border: none;
        background-color: var(--cor-rose);
        color: var(--cor-light);
        box-shadow: 0 2px 5px var(--cor-shadow-mid);
        transition: 0.1s;
        font-size:0.8vw;
        cursor: pointer;
    }

    button:hover{
        border: none;
        background-color: var(--cor-rose);
        color: var(--cor-rose-mid);
    }

`