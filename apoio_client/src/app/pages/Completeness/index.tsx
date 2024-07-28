//#region Imports

//Components
import {
    DynamicFilter,
    SimpleFilter,
    BackButton
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
    useAlertMessageEvent
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
    ExtractButton,
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
import { DATABASES_DEFAULT } from '../../constants';
//#endregion

const useTypedSelector: TypedUseSelectorHook<rootReducer> = useSelector;

export const Completude = () => {

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
        UnitsFilter,
        setUnitsFilter
    } = useGetUnits(installationsFilter, toggleState)
    const {
        teamsFilter,
        setTeamsFilter
    } = useGetTeams(UnitsFilter, toggleState)

    const [driverFilter, setDriverFilter] = useState<ISimpleFilterPartition>(DATABASES_DEFAULT)
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

        const mun = Object.entries(clientsFilter)
            .filter(([_key, value]) => value.condition == true)

        const drivers = Object.entries(driverFilter)
            .filter(([_key, value]) => value.condition === true)
            .map(([_key, value]) => value.dbtype);

        if (drivers.length === 0) { toggleState('driver_state_less', true) }

        else if (drivers.length > 1) { toggleState('driver_state_more', true) }

        else if (mun.length == 0) { toggleState('municipio_state', true) }

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
                    <h4>COMPLETUDE DE CADASTROS</h4>
                </div>
            </TitlePageContainer>
            <GroupFilterContainer>
                <GroupFilter>
                    <SimpleFilter name={"FONTE"} filters={driverFilter} changeFilter={setDriverFilter} />
                    <SimpleFilter name={"MUNICÍPIO"} filters={clientsFilter} changeFilter={setClientFilter} />
                    <DynamicFilter name={"INSTALAÇÃO"} filters={installationsFilter} changeFilter={setInstallationsFilter} />
                    <DynamicFilter name={"UNIDADE"} filters={UnitsFilter} changeFilter={setUnitsFilter} />
                    <DynamicFilter name={"EQUIPES"} filters={teamsFilter} changeFilter={setTeamsFilter} />
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