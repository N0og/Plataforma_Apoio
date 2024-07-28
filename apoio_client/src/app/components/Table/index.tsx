import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export const DataTable = () => {

    const headers = ['NOME', 'CPF', 'CARTAO SUS', 'DATA DE NASCIMENTO', 'FAIXA ETARIA NA EXTRACAO', 'IDADE NA EXTRACAO', 'IMUNOBIOLOGICO', 'DOSE', 'ESTRATEGIA', 'DATA DE APLICACAO', 'IDADE NA APLICACAO', 'FAIXA ETARIA POR DATA DE APLICACAO', 'TIPO DE REGISTRO', 'TIPO DE FICHA', 'LOCAL DE ATENDIMENTO', 'PROFISSIONAL', 'CNS PROFISSIONAL', 'UNIDADE', 'CNES', 'INE', 'NOME EQUIPE', 'CIDADE', 'UF']

    const data = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
        { id: 3, name: 'Jim Smith', email: 'jim@example.com' },
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
        { id: 3, name: 'Jim Smith', email: 'jim@example.com' },
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com' },

    ];

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, 'table-data.xlsx');
    };

    return (
        <div className='table-container'>
            <div className='toolbar'>
                <div className='buttonbar'>
                <button className='export' onClick={exportToExcel}><i className="fa-regular fa-file-excel"></i> EXPORT</button>
                </div>
            </div>
            <div className='table_view'>
                <table>
                    <thead>
                        <tr>
                            {headers.map(header => (
                                <th key={header}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(row => (
                            <tr key={row.id}>
                                <td>{row.id}</td>
                                <td>{row.name}</td>
                                <td>{row.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>

    )

}