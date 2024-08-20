import styled from 'styled-components'

export const RelatoriosPageContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    height: 100%;
    width: 75%;
    .page-title{
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        gap: 0.5vw;
        width: 100%;
        margin-top: 2vw;
        min-height: 45px;
        h2{
            font-size: 35px;
        }
        span{
            font-size: 35px;
            color: var(--cor-rose);
        }
    }

    @media (max-width:760px){
        .page-title{
            h2{
                font-size: 5vw;
            }
            span{
            font-size: 5vw;
        }
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
`

export const CardsContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    padding:45px;
    width: calc(250px * 4);
    gap: 25px;
    
    @media (max-width:760px){
        padding:25px;
        gap: 10px;
    }
    
`

