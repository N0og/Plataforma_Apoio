//#region Imports
import { useEffect, useState } from 'react';

//Components
import { FiltroDinamico, FiltroSimples } from '../../components';

//Styles
import { DefaultProps } from '../../types';
import { DriverEnum } from '../../constants';
import { useStateController, useDownload, useGetClients, useMountOrder, useGetInstallations, useGetUnits, useGetTeams, useAlertMessageEvent } from '../../hooks';
import { ISimpleFilterPartition } from '../../interfaces/IFilters';
import { ExtractButton, GroupFilter, GroupFilterContainer, ReportContainer, TitlePageContainer, ViewPageContainer } from '../../styles';
import { BackButton } from '../../components/BackButton';
//#endregion

export const Completude: React.FC<DefaultProps> = ({ currentPage, setCurrentPage }) => {
    const { control_states, toggleState, toggleAllFalse } = useStateController();
    const { clientsFilter, setClientFilter } = useGetClients(toggleState);
    const { installationsFilter, setInstallationsFilter } = useGetInstallations(clientsFilter, toggleState)
    const { UnitsFilter, setUnitsFilter } = useGetUnits(installationsFilter, toggleState)
    const { teamsFilter, setTeamsFilter } = useGetTeams(UnitsFilter, toggleState)
    const [driverFilter, setDriverFilter] = useState<ISimpleFilterPartition>({ 'eSUS': { 'dbtype': DriverEnum.PSQL, condition: false }, 'AtendSaúde': { 'dbtype': DriverEnum.MDB, condition: false } })
    const [AlertMessage, setAlertMessage] = useState<JSX.Element | null>(null)

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

        const drivers = Object.entries(driverFilter)
            .filter(([_key, value]) => value.condition === true)
            .map(([_key, value]) => value.dbtype);

        if (drivers.length === 0) { toggleState('driver_state_less', true) }

        else if (drivers.length > 1) { toggleState('driver_state_more', true) }

        else if (mun.length == 0) { toggleState('municipio_state', true) }
        else useDownload(
            OrderURL,
            {},
            toggleState)
    }
    return (
        <ReportContainer>
            <TitlePageContainer>
                <BackButton currentPage={currentPage} setCurrentPage={setCurrentPage} />
                {AlertMessage}
                <div className='title_container'>
                    <h4>COMPLETUDE DE CADASTROS</h4>
                </div>
            </TitlePageContainer>
            <GroupFilterContainer>
                <GroupFilter>
                    <FiltroSimples name={"FONTE"} filters={driverFilter} changeFilter={setDriverFilter} />
                    <FiltroSimples name={"MUNICÍPIO"} filters={clientsFilter} changeFilter={setClientFilter} />
                    <FiltroDinamico name={"INSTALAÇÃO"} filters={installationsFilter} changeFilter={setInstallationsFilter} />
                    <FiltroDinamico name={"UNIDADE"} filters={UnitsFilter} changeFilter={setUnitsFilter} />
                    <FiltroDinamico name={"EQUIPES"} filters={teamsFilter} changeFilter={setTeamsFilter} />
                </GroupFilter>
                <ExtractButton>
                    <button
                        onClick={() => { extract() }}
                    >EXTRAIR</button>
                </ExtractButton>
            </GroupFilterContainer>
            <ViewPageContainer>

            </ViewPageContainer>
        </ReportContainer>
    )
}