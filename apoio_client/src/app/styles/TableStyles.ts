import { styled } from 'styled-components'
import { DataGrid } from '@mui/x-data-grid';

export const TableContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    width: 95%;
    min-height: 180px;
    max-height: 75vh;
`


export const StyledDataGrid = styled(DataGrid)`
    width: 100%;
    max-height: 100%;

    & .MuiDataGrid-root {
    border: none;
  }

  & .MuiDataGrid-columnHeaders {
    background-color: #eeeeee;
    color: #333;
  }

  & .MuiDataGrid-footerContainer {
    background-color: var(--cor-light);
  }

  & .MuiDataGrid-virtualScroller::-webkit-scrollbar {
    width: 10px;
  }

  & .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb {
    background-color: blue;
    border-radius: 2px;
  }

  & .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }

  & .MuiDataGrid-virtualScroller::-webkit-scrollbar-track {
    background-color: #f1f1f1;
  }
`;