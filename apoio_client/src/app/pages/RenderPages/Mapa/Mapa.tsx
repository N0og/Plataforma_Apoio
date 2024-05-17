//#region Imports
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import axios from 'axios';

//Components
import { FiltroSimples, FiltroDinamico } from '../../../components/Components';
import { Icon } from 'leaflet';


//Interfaces
import { IDynamicFilterPartition, ISimpleFilterPartition } from '../../../../interfaces/IFilters';
import { IIEDResponse } from '../../../../interfaces/IResponses';

//Styles
import './Mapa.css'
import 'leaflet/dist/leaflet.css';
//#endregion

export const Mapa = () => {

    const [MUNICIPIOFilters, setMUNICIPIOFilters] = useState<ISimpleFilterPartition[]>([]);
    const [UNIDADESFilters, setUNIDADESFilters] = useState<IDynamicFilterPartition>({});
    const [IEDFilters, setIEDFilters] = useState<IIEDResponse[]>([]);

    const greenIcon = new Icon({
        iconUrl:"marker_green.png",
        iconSize: [52, 52]
    })

    const redIcon = new Icon({
        iconUrl:"marker_red.png",
        iconSize: [52, 52]
    })

    const yellowIcon = new Icon({
        iconUrl:"marker_yellow.png",
        iconSize: [52, 52]
    })

    const getIcon = (municipio:any) => {
        if (municipio.qtd_indi >= municipio.max) {
            return {
                icon: redIcon,
                message:<span><br/><span style={{fontWeight: "bold"}}>ATENÇÃO!</span><br/>Esta equipe está acima do limite máximo estipulado.</span>,
                qtd_ind: <span style={{fontWeight: "bold", color:"red"}}>{municipio.qtd_indi}</span>
            };
        } else if (municipio.qtd_indi > municipio.param) {
            return {
                icon: greenIcon,
                message:<span><br/><span style={{fontWeight: "bold"}}>ÓTIMO!</span><br/>Esta equipe está dentro dos parâmetros.</span>,
                qtd_ind: <span style={{fontWeight: "bold", color:"black"}}>{municipio.qtd_indi}</span>
            };
        } else {
            return {
                icon: yellowIcon,
                message: <span><br/><span style={{fontWeight: "bold"}}>OBSERVAÇÃO!</span><br/>Recomendada a alocação mais individuos nesta equipe, caso seja possível.</span>,
                qtd_ind: <span style={{fontWeight: "bold", color:"#54440f"}}>{municipio.qtd_indi}</span>
            };
        }
    };

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
        let clients = MUNICIPIOFilters.map((client) => {
            if (client[Object.keys(client)[0]] == true) {
                return `&dbname=${Object.keys(client)[0].replace(/ /g, '%20')}`
            }
        })

        let url = `http://localhost:9090/api/v1/maps/ied?dbtype=mdb${clients.join('')}`

        if (clients) {
            axios.get(url)
                .then(response => {
                    setIEDFilters(response.data)
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        }

    }, [MUNICIPIOFilters]);


    return (
        <div className='container_map'>
            
            <div className='page-title'>
                <div className='back_button_container'>
                    <div className='back_button'>
                        <button></button>
                        <i className="fa-solid fa-circle-chevron-left"></i>
                    </div>
                </div>
                <h2>MAPA</h2>
                <span>EQUIPES</span> <h2>-</h2> <span>RETERRITORIALIZAÇÃO</span>
            </div>
            <div className="container_filters">
                <div className='subcontainer_filters'>
                    <div className='municipio_filter'>
                        <FiltroSimples name={"MUNICÍPIO"} filters={MUNICIPIOFilters} changeFilter={setMUNICIPIOFilters} />
                    </div>
                </div>
            </div>
            
            <div className='LayerContainer'>
                <MapContainer center={[-7.11532, -34.861]} zoom={13} >
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {IEDFilters.map((key) =>
                        key[Object.keys(key)[0]].map((municipio, indx) => (
                            <Marker 
                            key={indx} 
                            position={[parseFloat(municipio.latitude), parseFloat(municipio.longitude)]} 
                            icon={getIcon(municipio).icon}
                            title={municipio.ubs}>
                                <Popup
                                keepInView={true}
                                >
                                    <span style={{fontWeight: "bold"}}>MUNICIPIO: {municipio.municipio}</span><br/><br/>
                                    UBS: {municipio.ubs}<br/><br/>
                                    CNES + INE: {municipio.cnes} | {municipio.ine} | {municipio.tp_equipe}<br />
                                    PARÂMETRO: {municipio.param} pessoas<br />
                                    CADASTROS ATEND: {getIcon(municipio).qtd_ind} pessoas<br />
                                    MÁXIMO: {municipio.max} pessoas<br />
                                    {getIcon(municipio).message}
                                </Popup>
                            </Marker>
                        ))
                    )}
                </MapContainer>
                <div className='container_legenda'>
                    <div className='item_legenda'>
                        <img src='/marker_green.png' className='green'/>
                        <span>Dentro dos parâmetros.</span>
                    </div>

                    <div className='item_legenda'>
                        <img src='/marker_yellow.png' className='yellow'/>
                        <span>Disponível para alocação de indivíduos.</span>
                    </div>

                    <div className='item_legenda'>
                        <img src='/marker_red.png' className='red'/>
                        <span>Exceço de indivíduos.</span>
                    </div>
                </div>
            </div>
        </div>

    )
}