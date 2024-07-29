//#region Imports

//Components
import { DynamicFilter, SimpleFilter, BackButton, SearchButton } from '../../components';

//Hooks
import {
    useStateController,
    useDownload,
    useGetClients,
    useMountOrder,
    useAlertMessageEvent,
    useGetInstallations,
    useGetUnits,
    useGetTeams
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

//Constantes
import { DATABASES_DEFAULT } from '../../constants';
//#endregion

const useTypedSelector: TypedUseSelectorHook<rootReducer> = useSelector;

export const Duplicates = () => {
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

        if (mun.length == 0)
            toggleState('municipio_state', true)

        else useDownload(
            OrderURL,
            {},
            toggleState
        )
    }
    return (
        <ReportContainer>
            <TitlePageContainer>
                <BackButton />
                {AlertMessage}
                <div className='title_container'>
                    <h4>DUPLICADOS</h4>
                </div>
            </TitlePageContainer>
            <GroupFilterContainer>
                <GroupFilter>
                    <SimpleFilter name={"FONTE"} filters={driverFilter} changeFilter={setDriverFilter} deactivated={true} />
                    <SimpleFilter name={"MUNICÍPIO"} filters={clientsFilter} changeFilter={setClientFilter} />
                    <DynamicFilter name={"INSTALAÇÃO"} filters={installationsFilter} changeFilter={setInstallationsFilter} />
                    <DynamicFilter name={"UNIDADE"} filters={UnitsFilter} changeFilter={setUnitsFilter} />
                    <DynamicFilter name={"EQUIPES"} filters={teamsFilter} changeFilter={setTeamsFilter} />
                </GroupFilter>
                <SearchButton handleSearchAction={handleSearchAction} />
            </GroupFilterContainer>

            <ViewPageContainer>

            </ViewPageContainer>
        </ReportContainer>
    )
}