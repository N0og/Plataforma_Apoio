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
    useGetInstallations
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
    ViewPageContainer
} from '../../styles';

//Constants
import { Alerts, DATABASES_DEFAULT } from '../../constants';

//Redux
import {
    TypedUseSelectorHook,
    useSelector
} from 'react-redux';
//
import { rootReducer } from '../../../redux/root-reducer';
import { CITY } from '../../constants/alertsEnum';
import { useTratament } from '../../hooks/useTratament';
//#endregion

const useTypedSelector: TypedUseSelectorHook<rootReducer> = useSelector;

export const TeamProductivity = () => {
    const { currentPage } = useTypedSelector(rootReducer => rootReducer.pageReducer);

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
                'team': teamsFilter
            },
            'driver': driverFilter
        }, [clientsFilter, unitsFilter, teamsFilter])

    useEffect(() => {
        setAlertMessage(useAlertMessageEvent(control_states));
    }, [control_states])

    const handleSearchAction = (event: any) => {

        setValues({})

        let useHook = (event === 'download') ? useDownload : useGetData
        const verified = useTratament({
            no_empty: [
                { filter: clientsFilter, enums: CITY }
            ]
        }
            , toggleAllFalse)

        if (verified) {
            useHook(
                OrderURL,
                {
                    data_inicial: dataFilters[0],
                    data_final: dataFilters[1],    
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
                <div className='title_container'>
                    <h4>PRODUTIVIDADE - EQUIPES</h4>
                </div>
                {AlertMessage}
            </TitlePageContainer>
            <GroupFilterContainer>
                <GroupFilter>
                    <SimpleFilter name={"MUNICÍPIO"} filters={clientsFilter} changeFilter={setClientFilter} />
                    <DynamicFilter name={"INSTALAÇÕES"} filters={installationsFilter} changeFilter={setInstallationsFilter} />
                    <DynamicFilter name={"UNIDADE"} filters={unitsFilter} changeFilter={setUnitsFilter} />
                    <DynamicFilter name={"EQUIPES"} filters={teamsFilter} changeFilter={setTeamsFilter} />
                    <DateFilter changeFilter={setDataFilters} />
                </GroupFilter>
            </GroupFilterContainer>
            <ViewPageContainer>
                <DataTable values={values} handleButton={handleSearchAction} handleProps={'download'} />
            </ViewPageContainer>
        </ReportContainer>
    )
}