//#region Imports
import { useEffect, useState } from 'react'
import axios from 'axios'

//Interfaces
import { IDynamicFilterPartition } from '../../../../../../interfaces/IFilters'

//Components
import { FiltroDinamico, FiltroData } from '../../../../../components/Components'


//Styles
import './ProdutividadeUBS.css'
//#endregion

export const ProdutividadeUBS = () => {
    const [UBSFilters, setUBSFilters] = useState<IDynamicFilterPartition>({});
    const [MUNICIPIOFilters, setMUNICIPIOFilters] = useState<IDynamicFilterPartition>({});
    const [INSTALACAOFilters, setINSTALACAOFilters] = useState<IDynamicFilterPartition>({});
    const [INEFilters, setINEFilters] = useState<IDynamicFilterPartition>({});
    const [PROFFilters, setPROFFilters] = useState<IDynamicFilterPartition>({});
    const [CBOFilters, setCBOFilters] = useState<IDynamicFilterPartition>({});
    const [DATAFilters, setDATAFilters] = useState<string>("");

    useEffect(() => {
        console.log(DATAFilters)
    }, [UBSFilters, DATAFilters])

    useEffect(() => {
        axios.get('http://localhost:9090/api/v1/filters/clients')
            .then(response => {
                console.log(response.data)
                setMUNICIPIOFilters(response.data)
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    return (
        <div className="container_report">
            <div className="container_title">
                <div className='back_button_container'>
                    <div className='back_button'>
                        <button></button>
                        <i className="fa-solid fa-circle-chevron-left"></i>
                    </div>
                </div>
                <div className='icon_container'>
                    <i className='fa-solid fa-hospital'></i>
                </div>
                <div className='title_container'>
                    Produtividade UBS
                </div>

                <div className='municipio_container'>
                    <FiltroDinamico name={"MUNICÍPIO"} filter={MUNICIPIOFilters} changeFilter={setMUNICIPIOFilters} />

                    <FiltroDinamico name={"INSTALAÇÃO"} filter={INSTALACAOFilters} changeFilter={setINSTALACAOFilters} />
                </div>

            </div>
            <div className="container_filters">
                <div className='filters_organization'>
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