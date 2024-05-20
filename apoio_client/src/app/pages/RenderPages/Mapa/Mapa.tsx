//#region Imports
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, Tooltip } from 'react-leaflet'
import axios from 'axios';

//Components
import { FiltroSimples } from '../../../components/Components';


//Interfaces
import { ISimpleFilterPartition } from '../../../../interfaces/IFilters';
import { IIEDResponse } from '../../../../interfaces/IResponses';

//Styles
import './Mapa.css'
import 'leaflet/dist/leaflet.css';
import { getIcon } from './Utils/getIcon';
//#endregion

export const Mapa = () => {

    const [MUNICIPIOFilters, setMUNICIPIOFilters] = useState<ISimpleFilterPartition[]>([]);
    const [IEDFilters, setIEDFilters] = useState<IIEDResponse[]>([]);
    const [Equipes, setEquipes] = useState<{ red: number, green: number, yellow: number }>();


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
        let clients = MUNICIPIOFilters.map((client) => {
            if (client[Object.keys(client)[0]] === true) {
                return `&dbname=${Object.keys(client)[0].replace(/ /g, '%20')}`
            }
        }).filter(Boolean);

        let url = `http://localhost:9090/api/v1/maps/ied?dbtype=mdb${clients.join('')}`

        if (clients.length > 0) {
            console.log(url)
            axios.get(url)
                .then(response => {
                    setIEDFilters(response.data)
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        }
        else{
            setIEDFilters([])
        }

    }, [MUNICIPIOFilters]);

    useEffect(() => {

        let equipes = { red: 0, yellow: 0, green: 0 }
        IEDFilters.map((key) => {
            key[Object.keys(key)[0]].map((municipio) => {
                switch (getIcon(municipio).status) {
                    case 'red': equipes.red += 1; break
                    case 'green': equipes.green += 1; break
                    case 'yellow': equipes.yellow += 1; break
                }
            })
        })

        setEquipes(equipes)
    }, [IEDFilters]);


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
                <span>EQUIPES</span> <h2>-</h2> <span>TERRITORIALIZAÇÃO</span>
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

                    {IEDFilters.length > 0 && IEDFilters.map((key) =>
                        key[Object.keys(key)[0]].map((municipio, indx) => (
                            <Marker
                                key={indx}
                                position={[parseFloat(municipio.latitude), parseFloat(municipio.longitude)]}
                                icon={getIcon(municipio).icon}
                                title={municipio.ubs}>
                                <Tooltip><span style={{ fontWeight: "bold" }}>UBS: {municipio.ubs}</span><br /><span>CADASTROS ATEND: {getIcon(municipio).qtd_ind}</span></Tooltip>
                                <Popup
                                    keepInView={true}
                                >
                                    <span style={{ fontWeight: "bold" }}>MUNICIPIO: {municipio.municipio}</span><br /><br />
                                    UBS: {municipio.ubs}<br /><br />
                                    CNES + INE: {municipio.cnes} | {municipio.ine} | {municipio.tp_equipe}<br />
                                    PARÂMETRO: {municipio.param} pessoas<br />
                                    CADASTROS ATEND: {getIcon(municipio).qtd_ind} pessoas<br />
                                    MÁXIMO: {municipio.max} pessoas<br />
                                    {getIcon(municipio).message}
                                </Popup>
                                <div className="map-legend">
                                    <h3>QUANTIDADE DE EQUIPES</h3>
                                    <br />
                                    <ul>
                                        <li>
                                            <img src='/marker_red.png' style={{width:'1vw', height:'1vw'}}/> <span>Excedente : {Equipes?.red}</span>
                                        </li>
                                        <li>
                                            <img src='/marker_yellow.png' style={{width:'1vw', height:'1vw'}}/> <span>Disponível : {Equipes?.yellow}</span>
                                        </li>
                                        <li>
                                            <img src='/marker_green.png' style={{width:'1vw', height:'1vw'}}/> <span>Regular : {Equipes?.green}</span>
                                        </li>
                                        {/* Adicione os itens da sua legenda aqui */}
                                    </ul>
                                </div>
                            </Marker>
                        ))
                    )}
                </MapContainer>
                <div className='container_legenda'>
                    <div className='item_legenda'>
                        <img src='/marker_green.png' className='green' />
                        <span>Dentro dos parâmetros.</span>
                    </div>

                    <div className='item_legenda'>
                        <img src='/marker_yellow.png' className='yellow' />
                        <span>Disponível para alocação de indivíduos.</span>
                    </div>

                    <div className='item_legenda'>
                        <img src='/marker_red.png' className='red' />
                        <span>Exceço de indivíduos.</span>
                    </div>
                </div>
            </div>
        </div>

    )
}