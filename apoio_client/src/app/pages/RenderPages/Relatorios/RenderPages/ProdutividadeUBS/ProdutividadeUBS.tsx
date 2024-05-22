//#region Imports
import { useEffect, useState } from 'react'
import axios from 'axios'

//Components
import { FiltroDinamico, FiltroData, FiltroSimples } from '../../../../../components/Components'

//Styles
import './ProdutividadeUBS.css'
//#endregion

export const ProdutividadeUBS: React.FC<{ setCurrentPage: React.Dispatch<React.SetStateAction<string>> }> = ({ setCurrentPage }) => {
    const [UBSFilters, setUBSFilters] = useState<any[]>([]);
    const [MUNICIPIOFilters, setMUNICIPIOFilters] = useState<any[]>([]);
    const [INSTALACAOFilters, setINSTALACAOFilters] = useState<any[]>([]);
    const [INEFilters, setINEFilters] = useState<any[]>([]);
    const [PROFFilters, setPROFFilters] = useState<any[]>([]);
    const [CBOFilters, setCBOFilters] = useState<any[]>([]);
    const [DATAFilters, setDATAFilters] = useState<string>("");
    const [loading_state, setLoading] = useState(false);

    useEffect(() => {
    }, [UBSFilters, DATAFilters])

    useEffect(() => {
        axios.get('http://localhost:9090/api/v1/filters/clients')
            .then(response => {
                setMUNICIPIOFilters(response.data)
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    useEffect(() => {

        let mun = MUNICIPIOFilters.map((mun) => {
            if (Object.values(mun)[0]) {
                setLoading(true)
                return Object.keys(mun)[0]
            }
        }).filter(Boolean);

        if (mun.length > 0){
            axios({
                method: 'get',
                url: 'http://localhost:9090/api/v1/filters/unidades',
                params: {
                    municipios: mun
                },
                transformRequest: [
                    (data) => {
                        return JSON.stringify(data);
                    }
                ]
            })
                .then(response => {
                    setLoading(false)
                    setINSTALACAOFilters(response.data)
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        }
        
        setINSTALACAOFilters([])

    }, [MUNICIPIOFilters]);

    return (
        <div className="container_report">
            <div className="container_title">
                <div className='back_button_container'>
                    <div className='back_button'>
                        <button onClick={() => setCurrentPage('relatorios')}></button>
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
                    <FiltroDinamico name={"PROFISSIONAL"} filter={PROFFilters} changeFilter={setPROFFilters} />
                    <FiltroDinamico name={"CBO"} filter={CBOFilters} changeFilter={setCBOFilters} />
                    <FiltroData changeFilter={setDATAFilters} />
                </div>
            </div>
            <div className="container_view">

            </div>
            <div className="container_buttons"></div>
        </div>
    )
}