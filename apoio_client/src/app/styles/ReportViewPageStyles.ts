import styled from 'styled-components'


export const ReportContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    height: 100%;
    width: 100%;
    
`

export const ViewContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    max-height: 100%;
    width: 95%;
`

export const TitlePageContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 100%;
    min-height: 35px;
    z-index: 9997;
    background-color: var(--cor-rose);
    color: var(--cor-light);
    
    .title_container{
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: center;
        font-size: 20px;
    }

    @media (max-width:450px){
        .title_container{
            font-size: 12px;
        }
    }
`

export const GroupFilterContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    max-width: 95%;
`

export const GroupFilter = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    flex-wrap: wrap;
    gap: 15px;
    padding: 12px;
`

export const ViewPageContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
`