import styled from 'styled-components'

export const RelatoriosPageContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    width: 100%;
    height: 100%;
    .page-title{
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        gap: 0.5vw;
        margin-top: 2vw;
        width: 100%;
        height:10%;
        h2{
            font-size: 2vw;
        }
        span{
            font-size: 2vw;
            color: var(--cor-rose);
        }
    }
`

export const ContentContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: start;
    flex-wrap: wrap;
    width: 100%;
    height: 100%;
    gap: 1vw;
`

export const CardsContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    padding:5vw;
    width: 40%;
    gap: 1vw;
`

