//#region Imports
import { useEffect, useState } from 'react'
import axios from 'axios'

//Components
import { FiltroDinamico, FiltroData, FiltroSimples } from '../../components'

//Styles
import './ProdutividadeUBS.css'
import { DefaultProps } from '../../types';
import { Pages } from '../../constants';
//#endregion

interface ProdutividadeUBSProps {
    setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

const fetchData = async (url: string, params: object = {}) => {
    try {
        const response = await axios.get(url, { params });
        return response.data;
    } catch (error) {
        console.error('There was an error!', error);
        return null;
    }
};

export const ProdutividadeUBS: React.FC<DefaultProps> = ({ setCurrentPage }) => {

    const [MUNICIPIOFilters, setMUNICIPIOFilters] = useState<any[]>([]);
    const [INSTALACAOFilters, setINSTALACAOFilters] = useState<any[]>([]);
    const [UBSFilters, setUBSFilters] = useState<any[]>([]);
    const [INEFilters, setINEFilters] = useState<any[]>([]);
    const [PROFFilters, setPROFFilters] = useState<any[]>([]);
    const [CBOFilters, setCBOFilters] = useState<any[]>([]);
    const [DATAFilters, setDATAFilters] = useState<string>("");
    const [loading_state, setLoading] = useState(false);
    



    const Extract = () =>{

        let mun = MUNICIPIOFilters.map((mun) => {
            if (Object.values(mun)[0]) {
                setLoading(true)
                return Object.keys(mun)[0]
            }
        }).filter(Boolean);

        let inst = INSTALACAOFilters.map((inst)=>{
            
        })

        axios({
            method: 'get',
            url: 'http://localhost:9090/api/v1/reports/ProdutividadeUBST',
            params: {
                dbtype:'psql',
                municipios: MUNICIPIOFilters,
                instalacoes: INSTALACAOFilters,
                unidades: INSTALACAOFilters,
                equipes: INEFilters,
                download:true
            },
            transformRequest: [
                (data) => {
                    return JSON.stringify(data);
                }
            ]
        })
            .then(response => {
                setLoading(false)
                setINEFilters(response.data)
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    return (
        <div className="container_report">
            <div className="container_title">
                <div className='back_button_container'>
                    <div className='back_button'>
                        <button onClick={() => setCurrentPage(Pages.Relatorios)}></button>
                        <i className="fa-solid fa-circle-chevron-left"></i>
                    </div>
                    {loading_state ?
                        <div className='loading_container'>
                            <div className='loading_filter'></div>
                            <span>Carregando...</span>
                        </div> : ""}
                </div>
                <div className='municipio_container'>
                </div>
                <div className='title_container'>
                    <h4>PRODUTIVIDADE UBS</h4>
                </div>
            </div>
            <div className="container_filters">
                <div className='filters_organization'>
                    <FiltroSimples name={"MUNICÍPIO"} filters={MUNICIPIOFilters} changeFilter={setMUNICIPIOFilters} />
                    <FiltroDinamico name={"INSTALAÇÃO"} filter={INSTALACAOFilters} changeFilter={setINSTALACAOFilters} />
                    <FiltroDinamico name={"UBS"} filter={UBSFilters} changeFilter={setUBSFilters} />
                    <FiltroDinamico name={"INE"} filter={INEFilters} changeFilter={setINEFilters} />
                    <FiltroData changeFilter={setDATAFilters} />
                </div>
            </div>
            <div className="container_view">
                <div className='extract_btn'>
                    <button
                    onClick={()=>{Extract()}}
                    >EXTRAIR</button>
                </div>
            </div>
            <div className="container_buttons">

            </div>
        </div>
    )
}