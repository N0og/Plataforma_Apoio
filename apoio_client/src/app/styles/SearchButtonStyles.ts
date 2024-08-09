import styled from 'styled-components'

export const SearchButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 35px;
    width: 100%;
    button{
        width: 100%;
        height: 100%;
        border: none;
        background-color: var(--cor-rose);
        color: var(--cor-light);
        transition: 0.1s;
        font-size:15px;
        cursor: pointer;
    }

    button:hover{
        border: none;
        background-color: var(--cor-rose);
        color: var(--cor-shadow-mid);
    }

`