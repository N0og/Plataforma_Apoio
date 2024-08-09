import styled from 'styled-components'


export const LoadingContainer = styled.div`
    display: flex;
    flex-direction: row;
    position: absolute;
    right: 2vw;
    justify-content: center;
    align-items: center;
    gap: 0.5vw;
    font-size: 12px;

    @media (max-width:768px){
        span{display: none;}
    }
`

export const LoadingComponent = styled.div`
    margin-left: 5px;
    border: 2px solid #f3f3f3;
    border-top: 2px solid var(--cor-rose);
    border-radius: 50%;
    width: 12px;
    height: 12px;
    animation: spin 1s linear infinite;
`