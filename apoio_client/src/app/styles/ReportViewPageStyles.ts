import styled from 'styled-components'


export const ReportContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    width: 100%;
    height: 100%;
`

export const TitlePageContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 100%;
    height: 2vw;
    z-index: 9995;
    background-color: var(--cor-rose);
    color: var(--cor-light);
    
    .title_container{
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: center;
        height: 100%;
        font-size: 1.3vw;
    }
`

export const GroupFilterContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 7%;
    gap: 1vw;
`

export const GroupFilter = styled.div`
    display: flex;
    max-width: 100%;
    font-size: 14px;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 1.5vw;
`

export const ViewPageContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 88%;
`