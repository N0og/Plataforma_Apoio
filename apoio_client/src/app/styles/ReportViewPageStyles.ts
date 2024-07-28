import styled from 'styled-components'


export const ReportContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: transparent;
`

export const TitlePageContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 100%;
    height: 5%;
    z-index: 9995;
    background-color: var(--cor-rose);
    color: var(--cor-light);
    transition:0.5s;
    
    .title_container{
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: center;
        height: 100%;
        font-size: 1.5vw;
    }
`

export const GroupFilterContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 6%;
    background-color: red;
    gap: 1vw;
`

export const GroupFilter = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 1.5vw;
`

export const ExtractButton = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    width: 6vw;

    button{
        width: 100%;
        height: 2vw;
        border-radius: 0.5vw;
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
        height: 2vw;
        border-radius: 0.5vw;
        border: none;
        background-color: var(--cor-rose);
        color: var(--cor-light);
        box-shadow: 0 1px 3px var(--cor_black);
        cursor: pointer;
    }

    button:active{
        width: 90%;
        height: 1.8vw;
        border-radius: 0.5vw;
        border: none;
        background-color: var(--cor-rose-mid);
        color: var(--cor-light);
        box-shadow: 0 1px 3px var(--cor_black);
        cursor: pointer;
    }
`

export const ViewPageContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: blue;
`