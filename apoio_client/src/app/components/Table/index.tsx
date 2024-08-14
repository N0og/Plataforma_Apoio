import { useEffect, useState } from 'react';
import './style.css'

import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';

import { ptBR } from '@mui/x-data-grid/locales'
import { ptBR as CorePtBR } from '@mui/material/locale';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { SearchButton } from '../SearchButton';
import { TableContainer } from '../../styles/TableStyles';



const theme = createTheme(
    {},
    ptBR,
    CorePtBR
)

export const DataTable: React.FC<{
    values: { [key: string]: {}[] }
    handleButton: any,
    handleProps: string
}> = ({ values, handleButton, handleProps }) => {

    const [rows, setRows] = useState<GridRowsProp>([])
    const [columns, setCol] = useState<GridColDef[]>([])

    const [_labelText, setText] = useState<string>('Aplique os Filtros Desejados Acima.')

    useEffect(() => {



        if (values && Object.keys(values).length > 0) {
            if (Object.values(values)[0].length > 0) {

                setCol(
                    Object.entries(Object.values(Object.values(values)[0])[0]).map(([key, value]) => {

                        let type, width;

                        if (typeof value === 'string') {
                            type = 'string'
                            width = (key.length > value.length) ? (key.length * 15) : (value.length * 15)

                            if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) type = 'date'
                            if (typeof value === 'string' && !isNaN(Number(value))) type = 'number'
                        }

                        return {
                            field: key,
                            headerName: key,
                            width,
                            headerAlign: "center",
                            hideable: true,
                            disableColumnMenu: false,
                            display: 'text',
                            align: 'center',
                            type,
                            editable: true,
                            headerClassName: 'DataGridHeader'
                        } as GridColDef
                    }) as GridColDef[]
                )


                setRows(
                    Object.values(Object.values(values)[0])
                        .map((value, index) => {
                            let newValue: { [key: string]: any } = { ...value };
                            for (const key in newValue) {
                                if (typeof newValue[key] === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(newValue[key])) {
                                    newValue[key] = new Date(newValue[key]);
                                }
                            }
                            return { id: index, ...newValue };
                        })
                );
            }
            else {
                setCol([])
                setRows([])
                setText("Sem Dados Para Estes Filtros...")
            }
        }

        else {
            setCol([])
            setRows([])
            setText("Sem Dados Para Estes Filtros...")
        }

    }, [values])



    return (
        <TableContainer>
            <div className='buttonbar'>
                <SearchButton color={'#659867'} title={'EXTRAIR'} handleSearchAction={() => handleButton(handleProps)} />
                <SearchButton title={'BUSCAR'} handleSearchAction={handleButton} />
            </div>
            <ThemeProvider theme={theme}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    showCellVerticalBorder={true}
                    showColumnVerticalBorder={true}
                    sx={{
                        width: '100%',
                        maxHeight: '100%',
                        '& .MuiDataGrid-root': {
                            '& . MuiDataGrid-scrollbar--vertical': {backgroundColor:'red', color:'red'}
                    
                    },
                    }}
                />
            </ThemeProvider>
        </TableContainer>
    )

}