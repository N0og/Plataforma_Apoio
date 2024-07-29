//#region Imports

//Components
import {
    DateFilter,
    DynamicFilter,
    SimpleFilter,
    BackButton,
    SearchButton
} from '../../components'

//Hooks
import {
    useGetClients,
    useStateController,
    useDownload,
    useMountOrder,
    useGetInstallations,
    useGetTeams,
    useGetUnits,
    useAlertMessageEvent
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
import { DATABASES_DEFAULT } from '../../constants';

//Redux
import {
    TypedUseSelectorHook,
    useSelector
} from 'react-redux';
//
import { rootReducer } from '../../../redux/root-reducer';
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
    } = useGetClients(toggleState);
    const {
        installationsFilter,
        setInstallationsFilter
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

    const handleSearchAction = () => {
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
                <div className='title_container'>
                    <h4>PRODUTIVIDADE - EQUIPES</h4>
                </div>
                {AlertMessage}
            </TitlePageContainer>
            <GroupFilterContainer>
                <GroupFilter>
                    <SimpleFilter name={"FONTE"} filters={driverFilter} changeFilter={setDriverFilter} deactivated={true} />
                    <SimpleFilter name={"MUNICÍPIO"} filters={clientsFilter} changeFilter={setClientFilter} />
                    <DynamicFilter name={"INSTALAÇÃO"} filters={installationsFilter} changeFilter={setInstallationsFilter} />
                    <DynamicFilter name={"UNIDADE"} filters={UnitsFilter} changeFilter={setUnitsFilter} />
                    <DynamicFilter name={"EQUIPES"} filters={teamsFilter} changeFilter={setTeamsFilter} />
                    <DateFilter changeFilter={setDataFilters} />
                </GroupFilter>
                    <SearchButton handleSearchAction = {handleSearchAction}/>
            </GroupFilterContainer>
            <ViewPageContainer>
            </ViewPageContainer>
        </ReportContainer>
    )
}