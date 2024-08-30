//#region Imports

//Components
import {
    DateFilter,
    SimpleFilter,
    AgeFilter,
    DynamicFilter,
    BackButton,
    DataTable
} from '../../components'

//Hooks
import {
    useGetClients,
    useStateController,
    useDownload,
    useMountOrder,
    useGetUnits,
    useGetTeams,
    useAlertMessageEvent,
    useGetData,
    useNotifyEvent,
    useGetVaccines,
    useGetInstallations,
    useTypedSelector
} from '../../hooks';
//
import {
    useEffect,
    useState
} from 'react'

//Styles
import {
    GroupFilter,
    GroupFilterContainer,
    ReportContainer,
    TitlePageContainer,
    ViewContainer,
    ViewPageContainer
} from '../../styles';

//Interfaces
import { ISimpleFilterPartition } from '../../interfaces/IFilters';

//Constants
import { DATABASES_DEFAULT, CITY, ModalActions } from '../../constants';

//Redux
import {
    useDispatch
} from 'react-redux';
import { useTratament } from '../../hooks/useTratament';
import { useCheckConnections } from '../../hooks/useCheckConnections';
import { Modal } from '../../components/Modal';
//#endregion



export const Vaccines = () => {
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
    const {
        vaccinesFilter,
        setVaccinesFilter
    } = useGetVaccines(toggleState)


    const [dataFilters, setDataFilters] = useState<Array<string>>([]);
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
                'imunos': vaccinesFilter
            },
            'driver': driverFilter
        }, [clientsFilter, vaccinesFilter, unitsFilter, teamsFilter])

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
        }
            , toggleAllFalse)

        if (verified) {

            const shouldOpenModal = driverFilter.eSUS.condition === true ? await useCheckConnections({
                clients: clientsFilter,
                installations: installationsFilter
            }, toggleState) : null;

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
                    <h4>IMUNIZAÇÃO</h4>
                </div>
            </TitlePageContainer>
            <ViewContainer>
                <GroupFilterContainer>
                    <GroupFilter>
                        <SimpleFilter name={"MUNICÍPIO"} filters={clientsFilter} changeFilter={setClientFilter} search={true} />
                        <DynamicFilter name={"INSTALAÇÕES"} filters={installationsFilter} changeFilter={setInstallationsFilter} />
                        <DynamicFilter name={"UNIDADE"} filters={unitsFilter} changeFilter={setUnitsFilter} />
                        <DynamicFilter name={"EQUIPES"} filters={teamsFilter} changeFilter={setTeamsFilter} />
                        <SimpleFilter name={"IMUNOBIOLÓGICO"} filters={vaccinesFilter} changeFilter={setVaccinesFilter} search={true} />
                        <AgeFilter name={"IDADE"} />
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