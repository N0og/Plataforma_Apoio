import styled from "styled-components";


export const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px); /* Desfoque aplicado */
  transition: backdrop-filter 0.3s ease, background-color 0.3s ease; /* Transição suave */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

export const ModalContainer = styled.div`
  width: 500px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease; /* Suaviza a entrada do modal */
  
`;

export const ModalButton = styled.button`
  margin: 10px 0px;
  padding: 10px 20px;
  width:50%;
  background-color: #4e7950;
  color: white;
  border: none;
  cursor: pointer;

  &:hover{
    background-color: #3f8341;
    color: white;
  }
`;

export const CancelButton = styled(ModalButton)`
  background-color: #962020;
  border-left: 1px solid var(--cor-shadow-min);
  &:hover{
    color: white;
    background-color: #861616;
  }
`;

export const ClientList = styled.ul`
  background-color: var(--cor-shadow-min);
  margin: 10px 0;
  overflow-y: auto;
  list-style: none;
  max-height: 50vh;

  .client{

    background-color: var(--cor-rose);
    color: var(--cor-light);
    padding: 3px;
    border: 0.2px solid var(--cor-shadow-min);
  }
`

export const InstallationsList = styled.li`
  list-style: none;
  .installation{
    text-align: start;
    padding: 3px 10px;
  }
`