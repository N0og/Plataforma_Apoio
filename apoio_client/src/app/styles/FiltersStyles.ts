import styled from 'styled-components'

export const FilterContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    position: relative;
    width: 180px;
    height: 25px;
    
    .FilterInput {
        width: 100%;
        height: 100%;
        border: none;
        border-radius: 15px;
        background-color: var(--cor-min_grey);
        box-shadow: 0 1px 0.1px 0px var(--cor-shadow-mid);
        outline: none;
        user-select: none;
        font-size: 12px;
        text-align: center;
    }

`

export const FilterSearch = styled.div`
    width: 100%;
    height: 100%;
    background-color: var(--cor-min_grey);
    input{
        max-width: 100%;
        height: 100%;
        border: none;
        outline: none;
        padding: 0 10px;
        background-color: var(--cor-min_grey);
        
    }

`

export const FilterIcon = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    background-color: transparent;
    color: var(--cor-rose-mid);
    left: 5%;
    font-size: 12px;
`

export const FilterCounter = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    z-index: 999;
    font-size: 09px;
    background-color: var(--cor-rose);
    color: var(--cor-light);
`

export const FilterButton = styled.button`
    display: flex;
    justify-content: end;
    align-items: center;
    position: absolute;
    width: 100%;
    height: 80%;
    border: none;
    background-color: transparent;
    cursor: pointer;
    i {
        font-size: 15px;
        padding: 10px;
    }
`


export const FilterSimpleList = styled.div`
    display: flex;
    flex-direction: column;
    min-width: 200px;
    max-width: 250px;
    min-height: 20px;
    max-height: 250px;
    top: 30px;
    border-radius: 7px;
    position: absolute;
    transition: 0.5s;
    overflow-y: auto;
    overflow-x: hidden ;
    gap: 2px;
    background-color: var(--cor-min_grey);
    box-shadow: 0px 0px 8px rgb(144, 143, 143);
    z-index:9997;
    span {
        text-align: start;
        padding: 5px;
        width: 80%;
        cursor: pointer;
        font-size: 12px;
        }

        .box-container {
            display: flex;
            flex-direction: column;
            width: 100%;
    }

    &::-webkit-scrollbar {
    width: 10px;
    /* Largura da scrollbar */
    border-top-right-radius: 6px;

    }
    
    &::-webkit-scrollbar-track {
    background: var(--cor-min_grey);
    /* Cor de fundo da track */
    border-top-right-radius: 7px;
    border-bottom-right-radius: 7px;
}

&::-webkit-scrollbar-thumb {
    background-color: var(--cor-rose);
    /* Cor do thumb */
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
    }
    
    /* Opções adicionais para hover */
    &::-webkit-scrollbar-thumb:hover {
        background-color: var(--cor-rose);
        /* Cor do thumb ao passar o mouse */
}

`

export const FilterSimpleListClosed = styled.div`
    display: flex;
    flex-direction: column;
    min-width: 0vw;
    max-width: 0vw;
    min-height: 0vh;
    max-height: 0vh;
    overflow-y: hidden;
    position: absolute;
    transition: 0.5s;
    opacity: 0%;
    
    span {
        text-align: start;
        padding: 0.5vw;
        cursor: pointer;
        font-size: 0.1vw;
        opacity: 0%;
        }

    input {
        width: 10%;
        height: 10%;
        left: 0;
        appearance: none;
        position: absolute;
        background-color: transparent;
        opacity: 0%;
        }
        `
export const FilterDynamicList = styled.div`
    display: flex;
    flex-direction: column;
    min-width: 200px;
    max-width: 250px;
    min-height: 20px;
    max-height: 250px;
    top: 30px;
    border-radius: 7px;
    position: absolute;
    transition: 0.5s;
    overflow-y: auto;
    overflow-x: hidden;
    gap: 2px;
    background-color: var(--cor-min_grey);
    box-shadow: 0px 0px 8px rgb(144, 143, 143);
    z-index: 9993;


    .box-container {
        display: flex;
        flex-direction: column;
        width: 100%;
    }
`

export const FilterSelectAllOption = styled.div`
    padding-left: 0.5vw;
    background-color: var(--cor-rose);
    color: var(--cor-light);
    label {
        display: flex;
        justify-content: start;
        align-items: center;
        flex-direction: row;
        font-size: 12px;
        
        input {
            width: 10%;
            height: 10%;
            left: 0;
            appearance: none;
            position: absolute;
            background-color: transparent;
        }
        }
        
        input[type="checkbox"]:checked+.custom-checkbox::after {
                opacity: 1;
                }

    &:hover + .custom-checkbox {
        background-color: var(--cor-rose-light);
        cursor: pointer;

        &::after {
            opacity: 1;
        }
        }
        
        `

export const SelectAllCheckBox = styled.label`
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: var(--cor-shadow-mid);
    position: relative;

    &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 1vw;
        background-color: var(--cor-light);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0;
        transition: opacity 0.3s;
    }
`

export const OptionCheckBox = styled.label`
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: var(--cor-min_grey);
    position: relative;
    transition: 0.2s;

    &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: var(--cor-rose);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0;
        transition: opacity 0.3s;
    }
`

export const FilterListOption = styled.div`
    padding-left: 5px;
    box-shadow: 0px 1px 0px 0px rgb(212, 212, 212);

    label {
        display: flex;
        justify-content: start;
        align-items: center;
        flex-direction: row;
        font-size: 12px;
        

        input {
            width: 10%;
            height: 10%;
            left: 0;
            appearance: none;
            position: absolute;
            background-color: transparent;
            
        }

        input[type="checkbox"]:checked+.custom-checkbox::after {
            opacity: 1;
        }
    }

    &:hover{
        .custom-checkbox {
            background-color: var(--cor-rose-light);
            cursor: pointer;
        }
    }
`

export const FilterAge = styled.div`
    display: flex ;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    width: 100%;
    top: 30px;
    border-radius: 7px;
    background-color: rgb(238, 238, 238);
    box-shadow: 0px 0px 8px rgb(144, 143, 143);
    overflow-y: hidden;
    overflow-x: hidden;
    transition: 0.5s;
    z-index: 9999;
    .title_input{
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        font-size: 12px;
        width: 100%;
        padding: 3px;
        background-color: var(--cor-rose);
        color: var(--cor-light);
    }
`

export const FilterAgeClosed = styled.div`
    display: flex;
    flex-direction: column;
    min-width: 0vw;
    max-width: 0vw;
    min-height: 0vh;
    max-height: 0vh;
    overflow-y: hidden;
    position: absolute;
    transition: 0.5s;
    opacity: 0%;

    div{
        display:flex;
        justify-content: start;
        align-items: start;
    }

    span{
        text-align: start;
        padding: 5px;
        cursor: pointer;
        font-size: 0.1vw;
        padding-left: 10px ;
        border-radius: 12px;
        border: none;
        width: 0;
        background-color: transparent;
        position: absolute;
        opacity: 0%;
    }
`

export const FilterAgeOption = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    padding: 11px;
    input{
        border: none;
        width: 45%;
        padding: 3px 0;
        text-align: center;
        font-size: 12px;
        border-radius: 12px;
        outline: none;
        user-select: none;
        background-color: var(--cor-min_grey);
        box-shadow: 0 2px 0.6px 0.5px var(--cor-shadow-mid);
        transition: 0.5s;
    }
`

export const FilterDataContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: relative;
    border-radius: 25px;
    background-color: var(--cor-min_grey);
    box-shadow: 0 1px 0.1px 0px var(--cor-shadow-mid);
    outline: none;
    user-select: none;
    width: 200px;
    height: 25px;
    font-family: Arial, sans-serif;
`

export const FilterDataCalendar = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 150px;
    height: 15px;
    background-color: transparent;
    z-index: 9996;

    /* Estilo dos campos de data */
    .inicioSelect,
    .fimSelect {
        border: none;
        outline: none;
        box-shadow: none;
        width: 100%;
        height: 100%;
        background-color: transparent;
        text-align: center;
        font-size: 12px;
    }

    .react-datepicker__input-container{
        display:flex;
    }

    .react-datepicker__day--selected,
    .react-datepicker__day--keyboard-selected,
    .react-datepicker__day--in-selecting-range,
    .react-datepicker__day:hover {
    background-color: var(--cor-rose) !important;
    color: white !important;
    }

    .react-datepicker__day--in-range {
    background-color: var(--cor-rose-light) !important;
    color: white !important;
    }
`