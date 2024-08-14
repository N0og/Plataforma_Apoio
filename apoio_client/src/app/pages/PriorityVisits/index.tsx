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
    useAlertMessageEvent,
    useGetInstallations,
    useGetUnits,
    useGetTeams,
    useGetData,
    useNotifyEvent
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
import {
    PRIORITY_VISITS_DEFAULT,
    DATABASES_DEFAULT,
    CONDITION,
    CITY
} from '../../constants';

//Redux
import {
    TypedUseSelectorHook,
    useSelector
} from 'react-redux';
//
import { rootReducer } from '../../../redux/root-reducer';
import { useTratament } from '../../hooks/useTratament';
//#endregion

const useTypedSelector: TypedUseSelectorHook<rootReducer> = useSelector;

export const PriorityVisits = () => {
    const { currentPage } = useTypedSelector(rootReducer => rootReducer.pageReducer);

    const {
        control_states,
        toggleState,
        toggleAllFalse
    } = useStateController()
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

    const [dataFilters, setDataFilters] = useState<Array<string>>([]);
    const [condicoesFilter, setCondicoesFilter] = useState<ISimpleFilterPartition>(PRIORITY_VISITS_DEFAULT)
    const [AlertMessage, setAlertMessage] = useState<JSX.Element | null>(null)
    const [driverFilter, _setDriverFilter] = useState<ISimpleFilterPartition>({ ...DATABASES_DEFAULT, 'AtendSaúde': { ...DATABASES_DEFAULT.AtendSaúde, condition: true } })

    const [values, setValues] = useState({})

    const { OrderURL } = useMountOrder(
        {
            'origin': currentPage,
            'orders': clientsFilter,
            'params': {
                'unit': unitsFilter,
                'installations': installationsFilter,
                'team': teamsFilter,
                'conditions': condicoesFilter
            },
            'driver': driverFilter
        }, [clientsFilter, condicoesFilter, unitsFilter, teamsFilter])

    useEffect(() => {
        setAlertMessage(useAlertMessageEvent(control_states));
    }, [control_states])

    const handleSearchAction = (event: any) => {

        setValues({})

        let useHook = (event === 'download') ? useDownload : useGetData
        const verified = useTratament({
            no_empty: [
                { filter: clientsFilter, enums: CITY },
                { filter: condicoesFilter, enums: CONDITION }
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
                .then((resp: any) => {
                    setValues({ json: resp[Object.keys(resp)[0]].result })
                    console.log(resp)
                    useNotifyEvent(resp[Object.keys(resp)[0]].msg, 'info')
                })
                .catch((error: any) => {
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
                    <h4>VISITAS PRIORITÁRIAS</h4>
                </div>
            </TitlePageContainer>
            <GroupFilterContainer>
                <GroupFilter>
                    <SimpleFilter name={"CONDIÇÕES"} filters={condicoesFilter} changeFilter={setCondicoesFilter} />
                    <SimpleFilter name={"MUNICÍPIO"} filters={clientsFilter} changeFilter={setClientFilter} />
                    {driverFilter.eSUS.condition === true && driverFilter.AtendSaúde.condition === false ? (
                        <>
                            <DynamicFilter name={"INSTALAÇÕES"} filters={installationsFilter} changeFilter={setInstallationsFilter} />
                            <DynamicFilter name={"UNIDADE"} filters={unitsFilter} changeFilter={setUnitsFilter} />
                            <DynamicFilter name={"EQUIPES"} filters={teamsFilter} changeFilter={setTeamsFilter} />
                        </>
                    ) : null}
                    <DateFilter changeFilter={setDataFilters} />
                </GroupFilter>
            </GroupFilterContainer>
            <ViewPageContainer>
                <DataTable values={values} handleButton={handleSearchAction} handleProps={'download'} />
            </ViewPageContainer>
        </ReportContainer>
    )
}