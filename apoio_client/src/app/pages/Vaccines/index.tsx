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
    useGetInstallations,
    useGetTeams,
    useAlertMessageEvent
} from '../../hooks';
//
import {
    useEffect,
    useState
} from 'react'

//Styles
import {
    ExtractButton,
    GroupFilter,
    GroupFilterContainer,
    ReportContainer,
    TitlePageContainer,
    ViewPageContainer
} from '../../styles';
//
import './style.css'

//Interfaces
import { ISimpleFilterPartition } from '../../interfaces/IFilters';

//Constants
import { DATABASES_DEFAULT } from '../../constants';

//Redux
import {
    TypedUseSelectorHook,
    useSelector
} from 'react-redux';
import { rootReducer } from '../../../redux/root-reducer';
//#endregion

const useTypedSelector: TypedUseSelectorHook<rootReducer> = useSelector;

export const Vacinas = () => {
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
        setInstallationsFilter: _setInstallationsFilter
    } = useGetInstallations(clientsFilter, toggleState)
    const {
        UnitsFilter,
        setUnitsFilter
    } = useGetUnits(installationsFilter, toggleState)
    const {
        teamsFilter,
        setTeamsFilter
    } = useGetTeams(UnitsFilter, toggleState)

    const [dataFilters, setDataFilters] = useState<Array<string>>([]);
    const [AlertMessage, setAlertMessage] = useState<JSX.Element | null>(null)
    const [driverFilter, setDriverFilter] = useState<ISimpleFilterPartition>(DATABASES_DEFAULT)

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

        const mun = Object.entries(clientsFilter)
            .filter(([_key, value]) => value.condition == true)
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
                <BackButton />
                {AlertMessage}
                <div className='title_container'>
                    <h4>IMUNIZAÇÃO</h4>
                </div>
            </TitlePageContainer>
            <GroupFilterContainer>
                <GroupFilter>
                    <SimpleFilter name={"FONTE"} filters={driverFilter} changeFilter={setDriverFilter} deactivated={true} />
                    <SimpleFilter name={"MUNICÍPIO"} filters={clientsFilter} changeFilter={setClientFilter} />
                    <DynamicFilter name={"UNIDADE"} filters={UnitsFilter} changeFilter={setUnitsFilter} />
                    <DynamicFilter name={"EQUIPES"} filters={teamsFilter} changeFilter={setTeamsFilter} />
                    <SimpleFilter name={"IMUNOBIOLÓGICO"} filters={clientsFilter} changeFilter={setClientFilter} />
                    <AgeFilter name={"IDADE"} />
                    <DateFilter changeFilter={setDataFilters} />
                </GroupFilter>
                <ExtractButton>
                    <button
                        onClick={() => { extract() }}
                    >BUSCAR</button>
                </ExtractButton>
            </GroupFilterContainer>
            <ViewPageContainer>
                <DataTable />
            </ViewPageContainer>
        </ReportContainer>
    )
}