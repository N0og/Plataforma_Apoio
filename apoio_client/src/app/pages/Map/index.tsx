//#region Imports

//Components
import {
    SimpleFilter,
    BackButton
} from '../../components';

//Hooks
import {
    useEffect,
    useState
} from 'react';
//
import {
    MapContainer,
    Marker,
    Popup,
    TileLayer,
    Tooltip
} from 'react-leaflet'
//
import {
    useAlertMessageEvent,
    useGetClients,
    useGetData,
    useStateController
} from '../../hooks';

//Interfaces
import { IIEDResponse } from '../../interfaces/IResponses';

//Styles
import {
    GroupFilter,
    GroupFilterContainer,
    TitlePageContainer
} from '../../styles';
import './Map.css'
import 'leaflet/dist/leaflet.css';
import { getIcon } from './Utils/getIcon';
//#endregion



export const Mapa = () => {

    const {
        control_states,
        toggleState
    } = useStateController()
    const {
        clientsFilter,
        setClientFilter
    } = useGetClients(toggleState)

    const [IEDFilters, setIEDFilters] = useState<IIEDResponse[]>([]);
    const [Equipes, setEquipes] = useState<{ red: number, green: number, yellow: number }>();
    const [AlertMessage, setAlertMessage] = useState<JSX.Element | null>(null)

    useEffect(() => {
        let clients = Object.entries(clientsFilter)
            .filter(([_key, value]) => value.condition == true)
            .map((client) => {
                return `&order=${Object.values(client)[0].replace(/ /g, '%20')}`
            });

        if (clients.length > 0) {
            toggleState('loading_state', true)
            useGetData(
                `${process.env.VITE_API_URL}/api/v1/maps/ied?dbtype=mdb${clients.join('')}`,
                {},
                toggleState
            ).then((response) => {
                if (response) setIEDFilters(response as IIEDResponse[])
            })
        }
        else {
            setIEDFilters([])
        }

    }, [clientsFilter]);

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

    useEffect(() => {
        setAlertMessage(useAlertMessageEvent(control_states));
    }, [control_states])

    return (
        <div className='container_map'>
            <TitlePageContainer>
                <BackButton />
                <h2>MAPA - EQUIPES - TERRITORIALIZAÇÃO</h2>
                {AlertMessage}
            </TitlePageContainer>
            <GroupFilterContainer>
                <GroupFilter>
                    <SimpleFilter name={"MUNICÍPIO"} filters={clientsFilter} changeFilter={setClientFilter} />
                </GroupFilter>
            </GroupFilterContainer>

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
                            </Marker>
                        ))
                    )}
                </MapContainer>
                <div className='container_legenda'>
                    <div className='item_legenda'>
                        <img src='/marker_green.png' className='green' />
                        <span>Dentro dos parâmetros: {Equipes?.green}</span>
                    </div>

                    <div className='item_legenda'>
                        <img src='/marker_yellow.png' className='yellow' />
                        <span>Disponível para alocação de indivíduos: {Equipes?.yellow}</span>
                    </div>

                    <div className='item_legenda'>
                        <img src='/marker_red.png' className='red' />
                        <span>Parâmetro excedido: {Equipes?.red}</span>
                    </div>
                </div>
            </div>
        </div>

    )
}