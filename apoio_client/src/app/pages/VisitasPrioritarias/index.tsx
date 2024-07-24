//#region Imports
import { useEffect, useState } from 'react'

//Components
import { FiltroData, FiltroDinamico, FiltroSimples } from '../../components'

//Styles
import { DefaultProps } from '../../types';
import { DriverEnum } from '../../constants';
import { useGetClients, useStateController, useDownload, useMountOrder, useAlertMessageEvent, useGetInstallations, useGetUnits, useGetTeams } from '../../hooks';
import { ISimpleFilterPartition } from '../../interfaces/IFilters';
import { ExtractButton, GroupFilter, GroupFilterContainer, ReportContainer, TitlePageContainer, ViewPageContainer } from '../../styles';
import { BackButton } from '../../components/BackButton';

//#endregion

const DEFAULT_VALUES = {
    "GESTANTES": { value: "gestantes", condition: false },
    "IDOSOS": { value: "idosos", condition: false },
    "CRIANÇAS": { value: "criancas", condition: false },
    "HIPERTENSOS": { value: "hipertensos", condition: false },
    "DIABÉTICOS": { value: "diabeticos", condition: false },
    "ACAMADOS": { value: "domiciliados_acamados", condition: false },
    "DPOC": { value: "dpoc", condition: false },
    "OUTRAS DOENÇAS": { value: "outras_doencas", condition: false },
    "SINTOMAS RESPIRATÓRIOS": { value: "sintomas_respiratorio", condition: false },
    "VULNERÁVEL": { value: "vulnerabilidade_social", condition: false },
    "ALCOÓLATRAS": { value: "alcoolatras", condition: false },
    "PUÉRPERAS": { value: "puerperas", condition: false },
    "DESNUTRIDOS": { value: "desnutridos", condition: false },
    "PORTADOR DE CÂNCER": { value: "cancer", condition: false },
    "COM HANSENÍASE": { value: "hanseniase", condition: false },
    "TABAGISTAS": { value: "tabagistas", condition: false },
    "BENEFICIÁRIO BOLSA": { value: "bolsa_familia", condition: false },
    "USA OUTRAS DROGAS": { value: "outras_drogas", condition: false },
    "RECEM NASCIDOS": { value: "recem_nascido", condition: false },
    "REABILITAÇÃO OU DEFICIENTE": { value: "reabilitacao_deficiencia", condition: false },
    "ASMÁTICOS": { value: "asmaticos", condition: false },
    "OUTRAS DOENÇAS CRÔNICAS": { value: "outras_doencas_cronicas", condition: false },
    "TUBERCULOSE": { value: "tuberculose", condition: false },
    "SAUDE MENTAL": { value: "saude_mental", condition: false },
    "DIARREIRA": { value: "diarreira", condition: false },
    "EGRESSO": { value: "egresso_internacao", condition: false }
}


export const VisitasPrioritarias: React.FC<DefaultProps> = ({ currentPage, setCurrentPage }) => {
    const { control_states, toggleState, toggleAllFalse } = useStateController()
    const { clientsFilter, setClientFilter } = useGetClients(toggleState);
    const { installationsFilter, setInstallationsFilter } = useGetInstallations(clientsFilter, toggleState)
    const { UnitsFilter, setUnitsFilter } = useGetUnits(installationsFilter, toggleState)
    const { teamsFilter, setTeamsFilter } = useGetTeams(UnitsFilter, toggleState)
    const [dataFilters, setDataFilters] = useState<Array<string>>([]);
    const [condicoesFilter, setCondicoesFilter] = useState<ISimpleFilterPartition>(DEFAULT_VALUES)
    const [AlertMessage, setAlertMessage] = useState<JSX.Element | null>(null)
    const [driverFilter, setDriverFilter] = useState<ISimpleFilterPartition>({ 'eSUS': { 'dbtype': DriverEnum.PSQL, condition: false }, 'AtendSaúde': { 'dbtype': DriverEnum.MDB, condition: true } })
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
        const mun = Object.entries(clientsFilter).filter(([_key, value]) => value.condition == true)
        const cond = Object.entries(condicoesFilter).filter(([_key, value]) => value.condition == true)
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
                <BackButton currentPage={currentPage} setCurrentPage={setCurrentPage} />
                {AlertMessage}
                <div className='title_container'>
                    <h4>VISITAS PRIORITÁRIAS</h4>
                </div>
            </TitlePageContainer>
            <GroupFilterContainer>
                <GroupFilter>
                    <FiltroSimples name={"FONTE"} filters={driverFilter} changeFilter={setDriverFilter} deactivated={true} />
                    <FiltroSimples name={"CONDIÇÕES"} filters={condicoesFilter} changeFilter={setCondicoesFilter} />
                    <FiltroSimples name={"MUNICÍPIO"} filters={clientsFilter} changeFilter={setClientFilter} />
                    <FiltroDinamico name={"INSTALAÇÃO"} filters={installationsFilter} changeFilter={setInstallationsFilter} />
                    <FiltroDinamico name={"UNIDADE"} filters={UnitsFilter} changeFilter={setUnitsFilter} />
                    <FiltroDinamico name={"EQUIPES"} filters={teamsFilter} changeFilter={setTeamsFilter} />
                    <FiltroData changeFilter={setDataFilters} />
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