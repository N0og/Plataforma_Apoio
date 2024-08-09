//#region Imports

//Components
import {
    DynamicFilter,
    SimpleFilter,
    BackButton,
    DataTable
} from '../../components';

//Hooks
import {
    useStateController,
    useDownload,
    useGetClients,
    useMountOrder,
    useGetInstallations,
    useGetUnits,
    useGetTeams,
    useAlertMessageEvent,
    useGetData,
    useNotifyEvent,
    useTratament
} from '../../hooks';
//
import {
    useEffect,
    useState
} from 'react';

//Interfaces
import { ISimpleFilterPartition } from '../../interfaces/IFilters';

//Styles
import {
    GroupFilter,
    GroupFilterContainer,
    ReportContainer,
    TitlePageContainer,
    ViewPageContainer
} from '../../styles';

//Redux
import {
    TypedUseSelectorHook,
    useSelector
} from 'react-redux';
//
import { rootReducer } from '../../../redux/root-reducer';

//Constants
import { Alerts, CITY, DATABASES_DEFAULT, DBFILTER } from '../../constants';
//#endregion

const useTypedSelector: TypedUseSelectorHook<rootReducer> = useSelector;

export const Completeness = () => {

    const { currentPage } = useTypedSelector(rootReducer => rootReducer.pageReducer);

    const {
        control_states,
        toggleState,
        toggleAllFalse
    } = useStateController();
    const {
        clientsFilter,
        setClientFilter
    } = useGetClients(toggleState);
    const {
        installationsFilter,
        setInstallationsFilter
    } = useGetInstallations(clientsFilter, toggleState)

    const {
        unitsFilter,
        setUnitsFilter
    } = useGetUnits(installationsFilter, toggleState)
    const {
        teamsFilter,
        setTeamsFilter
    } = useGetTeams(unitsFilter, toggleState)

    const [driverFilter, setDriverFilter] = useState<ISimpleFilterPartition>(DATABASES_DEFAULT)
    const [AlertMessage, setAlertMessage] = useState<JSX.Element | null>(null)

    const [values, setValues] = useState({})

    const { OrderURL } = useMountOrder(
        {
            'origin': currentPage,
            'orders': clientsFilter,
            'params': {
                'unit': unitsFilter,
                'installations': installationsFilter,
                'team': teamsFilter
            },
            'driver': driverFilter
        }, [clientsFilter, unitsFilter, teamsFilter])

    useEffect(() => {
        setAlertMessage(useAlertMessageEvent(control_states));
    }, [control_states])

    const handleSearchAction = (event: any) => {
        let useHook = (event === 'download') ? useDownload : useGetData
        const verified = useTratament({
            no_empty: [
                { filter: clientsFilter, enums: CITY }
            ],
            only_one: [
                { filter: driverFilter, enums: DBFILTER }
            ]
        }
            , toggleAllFalse)

        if (verified) {
            useHook(
                OrderURL,
                {
                    download: false
                },
                toggleState
            )
                .then(resp => {
                    setValues(resp as {})
                    useNotifyEvent(Alerts.SUCESS, 'success')
                })
                .catch(error => {
                    useNotifyEvent(error.msg, 'error')
                })
        }
    }
    return (
        <ReportContainer>
            <TitlePageContainer>
                <BackButton />
                {AlertMessage}
                <div className='title_container'>
                    <h4>COMPLETUDE DE CADASTROS</h4>
                </div>
            </TitlePageContainer>
            <GroupFilterContainer>
                <GroupFilter>
                    <SimpleFilter name={"FONTE"} filters={driverFilter} changeFilter={setDriverFilter} />
                    <SimpleFilter name={"MUNICÍPIO"} filters={clientsFilter} changeFilter={setClientFilter} />
                    {driverFilter.eSUS.condition === true && driverFilter.AtendSaúde.condition === false ? (
                        <>
                        <DynamicFilter name={"INSTALAÇÕES"} filters={installationsFilter} changeFilter={setInstallationsFilter} />
                        <DynamicFilter name={"UNIDADE"} filters={unitsFilter} changeFilter={setUnitsFilter} />
                        <DynamicFilter name={"EQUIPES"} filters={teamsFilter} changeFilter={setTeamsFilter} />
                        </>
                    ) : null}
                </GroupFilter>
            </GroupFilterContainer>
            <ViewPageContainer>
                <DataTable values={values} handleButton={handleSearchAction} handleProps={'download'} />
            </ViewPageContainer>
        </ReportContainer>
    )
}