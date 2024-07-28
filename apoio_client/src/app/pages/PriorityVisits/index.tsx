//#region Imports

//Components
import {
    DateFilter,
    DynamicFilter,
    SimpleFilter,
    BackButton
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
    useGetTeams
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
    ExtractButton,
    GroupFilter,
    GroupFilterContainer,
    ReportContainer,
    TitlePageContainer,
    ViewPageContainer
} from '../../styles';

//Constants
import {
    PRIORITY_VISITS_DEFAULT,
    DATABASES_DEFAULT
} from '../../constants';

//Redux
import {
    TypedUseSelectorHook,
    useSelector
} from 'react-redux';
//
import { rootReducer } from '../../../redux/root-reducer';
//#endregion

const useTypedSelector: TypedUseSelectorHook<rootReducer> = useSelector;

export const VisitasPrioritarias = () => {
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
    const [condicoesFilter, setCondicoesFilter] = useState<ISimpleFilterPartition>(PRIORITY_VISITS_DEFAULT)
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
        const cond = Object.entries(condicoesFilter)
            .filter(([_key, value]) => value.condition == true)
            .map(item => {
                return { [item[1].value]: item[1].condition }
            })
            .reduce((ob1, ob2) => { return ({ ...ob1, ...ob2 }) }, {})

        if (Object.keys(cond).length === 0) toggleState('condicoes_state', true)

        else if (mun.length == 0) {
            toggleState('municipio_state', true)
        }
        else if (dataFilters.length > 0) {
            useDownload(
                OrderURL,
                {
                    data_inicial: dataFilters[0],
                    data_final: dataFilters[1],
                    ...cond
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
                    <h4>VISITAS PRIORITÁRIAS</h4>
                </div>
            </TitlePageContainer>
            <GroupFilterContainer>
                <GroupFilter>
                    <SimpleFilter name={"FONTE"} filters={driverFilter} changeFilter={setDriverFilter} deactivated={true} />
                    <SimpleFilter name={"CONDIÇÕES"} filters={condicoesFilter} changeFilter={setCondicoesFilter} />
                    <SimpleFilter name={"MUNICÍPIO"} filters={clientsFilter} changeFilter={setClientFilter} />
                    <DynamicFilter name={"INSTALAÇÃO"} filters={installationsFilter} changeFilter={setInstallationsFilter} />
                    <DynamicFilter name={"UNIDADE"} filters={UnitsFilter} changeFilter={setUnitsFilter} />
                    <DynamicFilter name={"EQUIPES"} filters={teamsFilter} changeFilter={setTeamsFilter} />
                    <DateFilter changeFilter={setDataFilters} />
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