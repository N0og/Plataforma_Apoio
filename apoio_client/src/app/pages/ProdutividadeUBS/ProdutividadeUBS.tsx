//#region Imports
import { useEffect, useState } from 'react'

//Components
import { FiltroData, FiltroSimples, renderAlertMessage } from '../../components'

//Styles
import './ProdutividadeUBS.css'
import { DefaultProps } from '../../types';
import { PagesEnum } from '../../constants';
import { useGetData, useStateController, useDownload } from '../../hooks';
//#endregion


export const ProdutividadeUBS: React.FC<DefaultProps> = ({ setCurrentPage }) => {

    const [MUNICIPIOFilters, setMUNICIPIOFilters] = useState<any[]>([]);
    const [OrderURL, setOrderParam] = useState<string>("");
    const [DATAFilters, setDATAFilters] = useState<Array<string>>([]);
    const { control_states, toggleState } = useStateController()
    const [AlertMessage, setAlertMessage] = useState<JSX.Element| null>(null) 

    useEffect(() => {
        useGetData(
            "http://26.197.116.207:9090/api/v1/filters/clients",
            {},
            toggleState
        ).then((response => {
            if (response) setMUNICIPIOFilters(response)
        }))

    }, [])

    useEffect(() => {
        setOrderParam(`http://26.197.116.207:9090/api/v1/reports/ProdutividadeUBS?dbtype=psql&download=true${MUNICIPIOFilters.filter(item => {
            return Object.values(item)[0] == true
        })
            .map(item => {
                return `&order=${Object.keys(item)[0].replace(/ /g, "%20")}`
            })
            .join('')}`)

    }, [MUNICIPIOFilters])


    const extract = () => {

        toggleState('municipio_state', false)
        toggleState('data_state', false)

        const mun = MUNICIPIOFilters.filter(item => {
            return Object.values(item)[0] == true
        })

        if (mun.length == 0) {
            toggleState('municipio_state', true)
        }

        else if (DATAFilters.length > 0) {
            useDownload(
                OrderURL,
                {
                    data_inicial: DATAFilters[0],
                    data_final: DATAFilters[1]
                },
                toggleState
            )
        }
        else {
            toggleState('data_state', true)
        }

    }

    useEffect(()=>{
        setAlertMessage(renderAlertMessage(control_states));
    },[control_states])

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
                    <h4>PRODUTIVIDADE UBS</h4>
                </div>
            </div>
            <div className="container_filters">
                <div className='filters_organization'>
                    <FiltroSimples name={"Fonte: eSUS"} filters={MUNICIPIOFilters} changeFilter={setMUNICIPIOFilters} deactivated={true} />
                    <FiltroSimples name={"MUNICÍPIO"} filters={MUNICIPIOFilters} changeFilter={setMUNICIPIOFilters} />
                    <FiltroData changeFilter={setDATAFilters} />
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