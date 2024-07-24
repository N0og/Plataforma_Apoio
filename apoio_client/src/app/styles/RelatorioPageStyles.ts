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
    height: 3vw;
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
    width: 95%;
    padding: 1vw;
    background-color: trasparent;
    gap: 1vw;
`

export const GroupFilter = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    padding: 1vw;
    gap: 1.5vw;
    background-color: var(--cor-min_grey);
    border-radius: 2vw;
`

export const ExtractButton = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    width: 6vw;

    button{
        width: 5vw;
        height: 1.5vw;
        border-radius: 2vw;
        border: none;
        background-color: var(--cor-rose);
        color: var(--cor-light);
        box-shadow: 0 2px 5px var(--cor-shadow-mid);
        transition: 0.2s;
        font-size:0.7vw;
        cursor: pointer;
    }

    button:hover{
        width: 5.2vw;
        height: 1.5vw;
        border-radius: 2vw;
        border: none;
        background-color: var(--cor-rose);
        color: var(--cor-light);
        box-shadow: 0 1px 3px var(--cor_black);
        cursor: pointer;
    }

    button:active{
        width: 5vw;
        height: 1.5vw;
        border-radius: 2vw;
        border: none;
        background-color: var(--cor-rose-mid);
        color: var(--cor-light);
        box-shadow: 0 1px 3px var(--cor_black);
        cursor: pointer;
    }
`