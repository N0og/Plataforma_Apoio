//#region Imports
import { useEffect, useState } from 'react'
import axios from 'axios'

//Interfaces
import { IDynamicFilterPartition, ISimpleFilterPartition } from '../../../../../../interfaces/IFilters'

//Components
import { FiltroDinamico, FiltroData, FiltroSimples } from '../../../../../components/Components'


//Styles
import './ProdutividadeUBS.css'
//#endregion

export const ProdutividadeUBS = () => {
    const [UBSFilters, setUBSFilters] = useState<IDynamicFilterPartition>({});
    const [MUNICIPIOFilters, setMUNICIPIOFilters] = useState<ISimpleFilterPartition[]>([]);
    const [INSTALACAOFilters, setINSTALACAOFilters] = useState<any>([]);
    const [INEFilters, setINEFilters] = useState<IDynamicFilterPartition>({});
    const [PROFFilters, setPROFFilters] = useState<IDynamicFilterPartition>({});
    const [CBOFilters, setCBOFilters] = useState<IDynamicFilterPartition>({});
    const [DATAFilters, setDATAFilters] = useState<string>("");

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
        console.log(MUNICIPIOFilters)
        axios({
            method: 'get',
            url: 'http://localhost:9090/api/v1/filters/unidades',
            params: {
                municipios: MUNICIPIOFilters.map((mun) => {
                    if (Object.values(mun)[0]) {
                        return Object.keys(mun)[0]
                    }
                })
            },
            transformRequest: [
                (data) => {
                    return JSON.stringify(data);
                }
            ]
        })
            .then(response => {
                setINSTALACAOFilters(response.data)
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, [MUNICIPIOFilters]);

    return (
        <div className="container_report">
            <div className="container_title">
                <div className='back_button_container'>
                    <div className='back_button'>
                        <button></button>
                        <i className="fa-solid fa-circle-chevron-left"></i>
                    </div>
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