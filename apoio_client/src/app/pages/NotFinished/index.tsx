//#region Imports

//Components
import {
    DateFilter,
    DynamicFilter,
    SimpleFilter,
    BackButton,
    DataTable
} from '../../components'

//Hooks
import {
    useGetClients,
    useStateController,
    useDownload,
    useMountOrder,
    useGetTeams,
    useGetUnits,
    useAlertMessageEvent,
    useNotifyEvent,
    useGetData,
    useGetInstallations,
    useTypedSelector
} from '../../hooks';
//
import {
    useEffect,
    useState
} from 'react'

//Interfaces
import { ISimpleFilterPartition } from '../../interfaces/IFilters';

//Styles
import {
    GroupFilter,
    GroupFilterContainer,
    ReportContainer,
    TitlePageContainer,
    ViewContainer,
    ViewPageContainer
} from '../../styles';

//Constants
import { DATABASES_DEFAULT, GENERIC_BOOL_DEFAULT, ModalActions } from '../../constants';

//Redux

//
import { CITY, GENERIC_BOOL } from '../../constants/alertsEnum';
import { useTratament } from '../../hooks/useTratament';
import { Modal } from '../../components/Modal';
import { useDispatch } from 'react-redux';
import { useCheckConnections } from '../../hooks/useCheckConnections';
//#endregion


export const NotFinished = () => {

    const dispatch = useDispatch()

    const { currentPage } = useTypedSelector(rootReducer => rootReducer.pageReducer);

    const modalState = useTypedSelector(rootReducer => rootReducer.modalReducer);

    const {
        control_states,
        toggleState,
        toggleAllFalse
    } = useStateController()
    const {
        clientsFilter,
        setClientFilter
    } = useGetClients(toggleState)
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

    const [dataFilters, setDataFilters] = useState<Array<string>>([]);
    const [scheduleFilter, setScheduleFilter] = useState<ISimpleFilterPartition>(GENERIC_BOOL_DEFAULT)
    const [lateFilter, setLateFilter] = useState<ISimpleFilterPartition>(GENERIC_BOOL_DEFAULT)
    const [AlertMessage, setAlertMessage] = useState<JSX.Element | null>(null)
    const [driverFilter, _setDriverFilter] = useState<ISimpleFilterPartition>({ ...DATABASES_DEFAULT, 'eSUS': { ...DATABASES_DEFAULT.eSUS, condition: true } })

    const [values, setValues] = useState({})

    const { OrderURL } = useMountOrder(
        {
            'origin': currentPage,
            'orders': clientsFilter,
            'params': {
                'unit': unitsFilter,
                'installations': installationsFilter,
                'team': teamsFilter,
                'late': lateFilter,
                'schedule': scheduleFilter
            },
            'driver': driverFilter
        }, [clientsFilter, lateFilter, scheduleFilter, unitsFilter, teamsFilter])

    useEffect(() => {
        setAlertMessage(useAlertMessageEvent(control_states));
    }, [control_states])

    const handleSearchAction = async (event: any) => {

        setValues({})

        let useHook = (event === 'download') ? useDownload : useGetData

        const verified = useTratament({
            no_empty: [
                { filter: clientsFilter, enums: CITY }
            ]
            ,
            only_one: [
                { filter: scheduleFilter, enums: GENERIC_BOOL },
                { filter: lateFilter, enums: GENERIC_BOOL }
            ]
        }
            , toggleAllFalse)

        if (verified) {

            const shouldOpenModal = driverFilter.eSUS.condition === true ? await useCheckConnections(clientsFilter, toggleState) : null;

            if (shouldOpenModal && Object.keys(shouldOpenModal.result).length > 0) {
                dispatch({ type: ModalActions.VALUE, payload: shouldOpenModal.result })

                dispatch({ type: ModalActions.OPEN });

                const confirmed = await new Promise<boolean>((resolve) => {
                    const handleModalClose = (confirm: boolean) => {
                        dispatch({ type: ModalActions.CLOSE });
                        resolve(confirm);
                    };

                    dispatch({
                        type: ModalActions.CONFIRM,
                        payload: handleModalClose,
                    });
                });

                if (!confirmed) return;
            }

            useHook(
                OrderURL,
                {
                    data_inicial: dataFilters[0],
                    data_final: dataFilters[1],
                    download: false
                },
                toggleState
            )
                .then((resp: any) => {
                    setValues({ json: resp[Object.keys(resp)[0]].result })
                    console.log(resp)
                    useNotifyEvent(resp[Object.keys(resp)[0]].msg, 'info')
                })
                .catch(error => {
                    console.log(error)
                    useNotifyEvent(error.msg, 'error')
                })
        }
    }

    return (
        <ReportContainer>
            <TitlePageContainer>
                    <BackButton />
                    <div className='title_container'>
                        <h4>NÃO FINALIZADOS</h4>
                    </div>
                    {AlertMessage}
                </TitlePageContainer>
            <ViewContainer>
                <GroupFilterContainer>
                    <GroupFilter>
                        <SimpleFilter name={"DO TARDIO?"} filters={lateFilter} changeFilter={setLateFilter} />
                        <SimpleFilter name={"DA AGENDA?"} filters={scheduleFilter} changeFilter={setScheduleFilter} />
                        <SimpleFilter name={"MUNICÍPIO"} filters={clientsFilter} changeFilter={setClientFilter} search={true}/>
                        <DynamicFilter name={"INSTALAÇÕES"} filters={installationsFilter} changeFilter={setInstallationsFilter}/>
                        <DynamicFilter name={"UNIDADE"} filters={unitsFilter} changeFilter={setUnitsFilter} />
                        <DynamicFilter name={"EQUIPES"} filters={teamsFilter} changeFilter={setTeamsFilter} />
                        <DateFilter changeFilter={setDataFilters} />
                    </GroupFilter>
                </GroupFilterContainer>
                <ViewPageContainer>
                    <Modal isOpen={modalState.isOpen} confirmCallback={modalState.confirmCallback} />
                    <DataTable values={values} handleButton={handleSearchAction} handleProps={'download'} />
                </ViewPageContainer>
            </ViewContainer>
        </ReportContainer>
    )
}