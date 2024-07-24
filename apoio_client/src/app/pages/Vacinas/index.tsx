//#region Imports
import { useEffect, useState } from 'react'

//Components
import { FiltroData, FiltroSimples, FiltroIdade, FiltroDinamico } from '../../components'

//Styles
import { DefaultProps } from '../../types';
import { DriverEnum } from '../../constants';
import { useGetClients, useStateController, useDownload, useMountOrder, useGetUnits, useGetInstallations, useGetTeams, useAlertMessageEvent } from '../../hooks';
import { ISimpleFilterPartition } from '../../interfaces/IFilters';
import { ExtractButton, GroupFilter, GroupFilterContainer, ReportContainer, TitlePageContainer, ViewPageContainer } from '../../styles';
import { BackButton } from '../../components/BackButton';
//#endregion


export const Vacinas: React.FC<DefaultProps> = ({ currentPage, setCurrentPage }) => {

    const { control_states, toggleState, toggleAllFalse } = useStateController()
    const { clientsFilter, setClientFilter } = useGetClients(toggleState);
    const { installationsFilter, setInstallationsFilter } = useGetInstallations(clientsFilter, toggleState)
    const { UnitsFilter, setUnitsFilter } = useGetUnits(installationsFilter, toggleState)
    const { teamsFilter, setTeamsFilter } = useGetTeams(UnitsFilter, toggleState)
    const [dataFilters, setDataFilters] = useState<Array<string>>([]);
    const [AlertMessage, setAlertMessage] = useState<JSX.Element | null>(null)
    const [driverFilter, setDriverFilter] = useState<ISimpleFilterPartition>({ 'eSUS': { 'dbtype': DriverEnum.PSQL, condition: true }, 'AtendSaúde': { 'dbtype': DriverEnum.MDB, condition: false } })
    const { OrderURL } = useMountOrder(
        {
            'origin': currentPage,
            'orders': clientsFilter,
            'download': true,
            'params': {
                'unit': UnitsFilter,
                'team': teamsFilter
            },
            'driver': driverFilter
        }, [clientsFilter, UnitsFilter, teamsFilter])

    useEffect(() => {
        setAlertMessage(useAlertMessageEvent(control_states));
    }, [control_states])

    const extract = () => {

        toggleAllFalse()

        const mun = Object.entries(clientsFilter).filter(([_key, value]) => value.condition == true)
        if (mun.length == 0) {
            toggleState('municipio_state', true)
        }

        else if (dataFilters.length > 0) {
            useDownload(
                OrderURL,
                {
                    data_inicial: dataFilters[0],
                    data_final: dataFilters[1]
                },
                toggleState
            )
        }
        else {
            toggleState('data_state', true)
        }
    }

    return (
        <ReportContainer>
            <TitlePageContainer>
                <BackButton currentPage={currentPage} setCurrentPage={setCurrentPage} />
                {AlertMessage}
                <div className='title_container'>
                    <h4>IMUNIZAÇÃO</h4>
                </div>
            </TitlePageContainer>
            <GroupFilterContainer>
                <GroupFilter>
                    <FiltroSimples name={"FONTE"} filters={driverFilter} changeFilter={setDriverFilter} deactivated={true} />
                    <FiltroSimples name={"MUNICÍPIO"} filters={clientsFilter} changeFilter={setClientFilter} />
                    <FiltroDinamico name={"INSTALAÇÃO"} filters={installationsFilter} changeFilter={setInstallationsFilter} />
                    <FiltroDinamico name={"UNIDADE"} filters={UnitsFilter} changeFilter={setUnitsFilter} />
                    <FiltroDinamico name={"EQUIPES"} filters={teamsFilter} changeFilter={setTeamsFilter} />
                    <FiltroSimples name={"IMUNOBIOLÓGICO"} filters={clientsFilter} changeFilter={setClientFilter} />
                    <FiltroIdade name={"IDADE"} />
                    <FiltroData changeFilter={setDataFilters} />
                </GroupFilter>
                <ExtractButton>
                    <button
                        onClick={() => { extract() }}
                    >EXTRAIR</button>
                </ExtractButton>
            </GroupFilterContainer>
            <ViewPageContainer>
                <div></div>
                <span>TESTE</span>

            </ViewPageContainer>
        </ReportContainer>
    )
}