//#region Imports

//Components
import { DynamicFilter, SimpleFilter, BackButton, DataTable } from '../../components';

//Hooks
import {
    useStateController,
    useDownload,
    useGetClients,
    useMountOrder,
    useAlertMessageEvent,
    useGetInstallations,
    useNotifyEvent,
    useGetData,
    useTypedSelector
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
    ViewContainer,
    ViewPageContainer
} from '../../styles';

//Redux
import {
    useDispatch
} from 'react-redux';
//

//Constantes
import { CITY, DATABASES_DEFAULT, ModalActions } from '../../constants';
import { useTratament } from '../../hooks/useTratament';
import { Modal } from '../../components/Modal';
import { useCheckConnections } from '../../hooks/useCheckConnections';
//#endregion


export const VersionPEC = () => {
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
    } = useGetClients(toggleState);
    const {
        installationsFilter,
        setInstallationsFilter
    } = useGetInstallations(clientsFilter, toggleState)

    const [AlertMessage, setAlertMessage] = useState<JSX.Element | null>(null)
    const [driverFilter, _setDriverFilter] = useState<ISimpleFilterPartition>({ ...DATABASES_DEFAULT, 'eSUS': { ...DATABASES_DEFAULT.eSUS, condition: true } })

    const [values, setValues] = useState({})

    const { OrderURL } = useMountOrder(
        {
            'origin': currentPage,
            'orders': clientsFilter,
            'params': {
                'installations': installationsFilter,
            },
            'driver': driverFilter
        }, [clientsFilter, installationsFilter])

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
                    <h4>VERSIONAMENTO PEC</h4>
                </div>
            </TitlePageContainer>
            <ViewContainer>
                <GroupFilterContainer>
                    <GroupFilter>
                        <SimpleFilter name={"MUNICÍPIO"} filters={clientsFilter} changeFilter={setClientFilter} search={true}/>
                        <DynamicFilter name={"INSTALAÇÃO"} filters={installationsFilter} changeFilter={setInstallationsFilter} />
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