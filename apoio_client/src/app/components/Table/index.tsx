import './style.css'

import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';

    

export const DataTable = () => {

    const headers = ['NOME', 'CPF', 'CARTAO SUS', 'DATA DE NASCIMENTO', 'FAIXA ETARIA NA EXTRACAO', 'IDADE NA EXTRACAO', 'IMUNOBIOLOGICO', 'DOSE', 'ESTRATEGIA', 'DATA DE APLICACAO', 'IDADE NA APLICACAO', 'FAIXA ETARIA POR DATA DE APLICACAO', 'TIPO DE REGISTRO', 'TIPO DE FICHA', 'LOCAL DE ATENDIMENTO', 'PROFISSIONAL', 'CNS PROFISSIONAL', 'UNIDADE', 'CNES', 'INE', 'NOME EQUIPE', 'CIDADE', 'UF']

    const rows: GridRowsProp = [
        { id: 1, col1: "Hello", col2: "World"},
        { id: 2, col1: "MUI X", col2: "is awesome" },
        { id: 3, col1: "Material UI", col2: "is amazing" },
        { id: 4, col1: "MUI", col2: "" },
        { id: 5, col1: "Joy UI", col2: "is awesome" },
        { id: 6, col1: "MUI Base", col2: "is amazing" },
        { id: 7, col1: "Hello", col2: "World" },
        { id: 8, col1: "ALo", col2:"Terezinha"},
        { id: 7, col1: "Hello", col2: "World" },
        { id: 8, col1: "ALo", col2:"Terezinha"},
        { id: 7, col1: "Hello", col2: "World" },
        { id: 8, col1: "ALo", col2:"Terezinha"},
        { id: 7, col1: "Hello", col2: "World" },
        { id: 8, col1: "ALo", col2:"Terezinha"}
       
      ];
      
      const columns = headers.map((header, index) => ({
        field: `col${index + 1}`,
        headerName: header,
        width: 150,
        headerAlign: "center",
        hideable: true,
        disableColumnMenu: true,
        display: 'text'
      } as GridColDef)) as GridColDef[];
   

    return (
        <div className='table-container'>
            
            <div className='table_view'>
                <DataGrid rows={rows} columns={columns} autoPageSize={true} className='test'/>
            </div>
            <div className='toolbar'>
                <div className='buttonbar'>
                <button className='export'><i className="fa-regular fa-file-excel"></i> EXPORT</button>
                </div>
            </div>
        </div>

    )

}