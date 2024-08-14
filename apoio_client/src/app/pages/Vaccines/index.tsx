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
    useGetInstallations
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
    ViewPageContainer
} from '../../styles';

//Interfaces
import { ISimpleFilterPartition } from '../../interfaces/IFilters';

//Constants
import { DATABASES_DEFAULT, CITY } from '../../constants';

//Redux
import {
    TypedUseSelectorHook,
    useSelector
} from 'react-redux';
import { rootReducer } from '../../../redux/root-reducer';
import { useTratament } from '../../hooks/useTratament';
//#endregion

const useTypedSelector: TypedUseSelectorHook<rootReducer> = useSelector;

export const Vaccines = () => {
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
            <GroupFilterContainer>
                <GroupFilter>
                    <SimpleFilter name={"MUNICÍPIO"} filters={clientsFilter} changeFilter={setClientFilter} />
                    <DynamicFilter name={"INSTALAÇÕES"} filters={installationsFilter} changeFilter={setInstallationsFilter} />
                    <DynamicFilter name={"UNIDADE"} filters={unitsFilter} changeFilter={setUnitsFilter} />
                    <DynamicFilter name={"EQUIPES"} filters={teamsFilter} changeFilter={setTeamsFilter} />
                    <DynamicFilter name={"IMUNOBIOLÓGICO"} filters={vaccinesFilter} changeFilter={setVaccinesFilter} />
                    <AgeFilter name={"IDADE"} />
                    <DateFilter changeFilter={setDataFilters} />
                </GroupFilter>
            </GroupFilterContainer>
            <ViewPageContainer>
                <DataTable values={values} handleButton={handleSearchAction} handleProps={'download'} />
            </ViewPageContainer>
        </ReportContainer>
    )
}