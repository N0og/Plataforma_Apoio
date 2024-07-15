//#region Imports
import { useEffect, useState } from 'react';

//Components
import { FiltroSimples, renderAlertMessage } from '../../components';

//Styles
import './Duplicados.css';
import { DefaultProps } from '../../types';
import { PagesEnum } from '../../constants';
import { useStateController, useDownload, useGetClients } from '../../hooks';
//#endregion

export const Duplicados: React.FC<DefaultProps> = ({ setCurrentPage }) => {
    const { control_states, toggleState, toggleAllFalse } = useStateController();
    const { clientsFilter, setClientFilter } = useGetClients(toggleState);
    const [OrderURL, setOrderParam] = useState<string>("");
    const [AlertMessage, setAlertMessage] = useState<JSX.Element | null>(null)

    useEffect(() => {
        setOrderParam(`http://26.197.116.207:9090/api/v1/reports/DuplicadosPEC?dbtype=psql&download=true${clientsFilter.filter(item => {
            return Object.values(item)[0] == true
        }).map(item => { return `&order=${Object.keys(item)[0].replace(/ /g, "%20")}` }).join('')}`)
    }, [clientsFilter])

    useEffect(() => {
        setAlertMessage(renderAlertMessage(control_states));
    }, [control_states])

    const extract = () => {
        toggleAllFalse()
        const mun = clientsFilter.filter(item => {
            return Object.values(item)[0] == true
        })
        if (mun.length == 0) toggleState('municipio_state', true)
        else useDownload(
            OrderURL,
            {},
            toggleState)
    }
    return (
        <div className="container_report">
            <div className="container_title">
                <div className='back_button_container'>
                    <div className='back_button'>
                        <button onClick={() => setCurrentPage(PagesEnum.Relatorios)}></button>
                        <i className="fa-solid fa-circle-chevron-left"></i>
                    </div>
                    {AlertMessage}
                </div>
                <div className='title_container'>
                    <h4>DUPLICADOS</h4>
                </div>
            </div>
            <div className="container_filters">
                <div className='filters_organization'>
                    <FiltroSimples name={"Fonte: eSUS"} filters={clientsFilter} changeFilter={setClientFilter} deactivated={true} />
                    <FiltroSimples name={"MUNICÍPIO"} filters={clientsFilter} changeFilter={setClientFilter} />
                </div>
            </div>
            <div className="container_view">
                <div className='extract_btn'>
                    <button
                        onClick={() => { extract(); }}
                    >EXTRAIR</button>
                </div>
            </div>
            <div className="container_buttons">

            </div>
        </div>
    )
}