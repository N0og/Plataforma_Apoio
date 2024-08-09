import styled from 'styled-components';

export const SideBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position:fixed;
  z-index: 9998;
  width: 1%;
  gap: 1vh;
  left:0;
  height: 300px;
  border-top-right-radius: 10vw;
  border-bottom-right-radius: 10vw;
  opacity: 35%;
  transition: 0.4s;
  
  @media (max-width: 768px) {
      width: 2.5%;
      
  }

  &:hover {
    width: 18%;
    height: 100vh;
    border-radius: 0;
    background-color: var(--cor-light);
    /*box-shadow: 0px 15px 8px 0px rgb(116, 114, 114);*/
    opacity: 100%;
    .infoSystem {
      opacity: 100%;
    }
    
    .side_bar {
      margin-left: 0.5vw;
      opacity: 100%;
      background-color: transparent;
    }

    .side_bar_item {
      width: 90%;
      opacity: 100%;
    }

    .side_bar_item span {
      opacity: 100%;
      transform: translateX(1vw);
    }

    @media (max-width: 768px) {
      width: 100%;
    }
  }
`;

export const SideBarStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 1vh;
  opacity: 100%;
  border: none;
  overflow: hidden;
  transition: 0.2s;
  background-color: var(--cor-rose);
  border-top-right-radius: 25px;
  border-bottom-right-radius: 25px;

  .side_bar_item {
    opacity: 0%;
  }

  @media (max-width: 768px) {
      height: 100%;
  

  .side_bar_item {
      opacity: 0%;
      min-height: 55px;
      .item_icon {
        width: 100%;
        height: 100%;
      }
    &:hover{
      .item_icon {
        opacity: 0%;
      }
    }
    }
  }
`;

export const SideBarItem = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  min-height: 35px;
  width: 2.3vw;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  background-color: var(--cor-min_grey);
  transition: 0.5s;

  &:hover {
    .item_icon {
      width: 100%;
    }
  }

  &:active {
    .item_icon i {
      font-size: 1vw;
    }
  }
`;

export const ItemIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--cor-rose);
  height: 33px;
  width: 33px;
  border-radius: 50px;
  overflow: hidden;
  z-index: 999;
  transition: 0.2s;

  i {
    transition: 0.58ms;
    color: var(--cor-light);
    font-size: 15px;
  }

  
`;

export const Item = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  height: 100%;
  width: 100%;
  border-radius: 50px;
  transition: 0.5s;

  button {
    position: absolute;
    height: 100%;
    width: 100%;
    border-radius: 50px;
    z-index: 999;
    border: none;
    background-color: transparent;
    cursor: pointer;
  }

  span {
    transition: 0.3s;
    transform: translateX(1vw);
    opacity: 0%;
    font-size: 15px;
  }
`;

export const InfoSystem = styled.div`
  position: absolute;
  bottom: 2vw;
  overflow: hidden;
  opacity: 0%;
  transition: 0.2s;
  text-wrap: nowrap;
  font-size: 0.8vw;
  margin-bottom: 1vw;
`;
