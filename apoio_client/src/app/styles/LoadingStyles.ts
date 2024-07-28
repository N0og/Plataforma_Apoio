import styled from 'styled-components'


export const LoadingContainer = styled.div`
    display: flex;
    flex-direction: row;
    position: absolute;
    right: 2vw;
    justify-content: center;
    align-items: center;
    gap: 0.5vw;
    font-size: 1vw;
`

export const LoadingComponent = styled.div`
    margin-left: 0.8vw;
    border: 0.3vw solid #f3f3f3;
    border-top: 0.3vw solid var(--cor-rose);
    border-radius: 50%;
    width: 1vw;
    height: 1vw;
    animation: spin 1s linear infinite;
`