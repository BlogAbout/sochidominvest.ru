import React, {useEffect, useMemo, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {compareText} from '../../../helpers/filterHelper'
import {changeLayout, getLayout} from '../../../helpers/utilHelper'
import {checkRules, Rules} from '../../../helpers/accessHelper'
import {agentTypes} from '../../../helpers/agentHelper'
import {RouteNames} from '../../../helpers/routerHelper'
import {IAgent} from '../../../@types/IAgent'
import {IFilter, IFilterContent} from '../../../@types/IFilter'
import Title from '../../ui/Title/Title'
import Wrapper from '../../ui/Wrapper/Wrapper'
import PanelView from '../../views/PanelView/PanelView'
import AgentService from '../../../api/AgentService'
import SidebarLeft from '../../../components/ui/SidebarLeft/SidebarLeft'
import AgentList from './components/AgentList/AgentList'
import AgentTill from './components/AgentTill/AgentTill'
import openPopupAgentCreate from '../../../components/popup/PopupAgentCreate/PopupAgentCreate'
import openPopupAlert from '../../../components/popup/PopupAlert/PopupAlert'
import openContextMenu from '../../ui/ContextMenu/ContextMenu'
import classes from './AgentsPage.module.scss'

const AgentsPage: React.FC = (): React.ReactElement => {
    const navigate = useNavigate()

    const [fetching, setFetching] = useState(false)
    const [agents, setAgents] = useState<IAgent[]>([])
    const [searchText, setSearchText] = useState('')
    const [filterAgent, setFilterAgent] = useState<IAgent[]>([])
    const [isShowFilter, setIsShowFilter] = useState(false)
    const [filters, setFilters] = useState({
        types: ['agent']
    })
    const [layout, setLayout] = useState<'list' | 'till'>(getLayout('agents'))

    const {user} = useTypedSelector(state => state.userReducer)

    useEffect(() => {
        fetchAgentsHandler()
    }, [])

    useEffect(() => {
        search(searchText)
    }, [agents, filters])

    const fetchAgentsHandler = (): void => {
        setFetching(true)

        const filter: IFilter = {active: [0, 1]}

        if (!checkRules([Rules.IS_MANAGER]) && user.id) {
            filter.author = [user.id]
        }

        AgentService.fetchAgents(filter)
            .then((response: any) => setAgents(response.data.data))
            .catch((error: any) => console.error('Произошла ошибка загрузки данных', error))
            .finally(() => setFetching(false))
    }

    const onSaveHandler = (): void => {
        fetchAgentsHandler()
    }

    const search = (value: string): void => {
        setSearchText(value)

        if (!agents || !agents.length) {
            setFilterAgent([])
        }

        if (value !== '') {
            setFilterAgent(filterItemsHandler(agents.filter((agent: IAgent) => {
                return compareText(agent.name, value) || compareText(agent.address, value) || compareText(agent.phone, value.toLocaleLowerCase())
            })))
        } else {
            setFilterAgent(filterItemsHandler(agents))
        }
    }

    const onClickHandler = (agent: IAgent): void => {
        navigate(`${RouteNames.P_AGENT}/${agent.id}`)
    }

    const onAddHandler = (): void => {
        openPopupAgentCreate(document.body, {
            onSave: () => onSaveHandler()
        })
    }

    const onEditHandler = (agent: IAgent): void => {
        openPopupAgentCreate(document.body, {
            agent: agent,
            onSave: () => onSaveHandler()
        })
    }

    const onRemoveHandler = (agent: IAgent): void => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить ${agent.name}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (agent.id) {
                            setFetching(true)

                            AgentService.removeAgent(agent.id)
                                .then(() => onSaveHandler())
                                .catch((error: any) => {
                                    openPopupAlert(document.body, {
                                        title: 'Ошибка!',
                                        text: error.data.data
                                    })
                                })
                                .finally(() => setFetching(false))
                        }
                    }
                },
                {text: 'Отмена'}
            ]
        })
    }

    const onContextMenuHandler = (agent: IAgent, e: React.MouseEvent): void => {
        e.preventDefault()

        const menuItems = [{text: 'Открыть', onClick: () => navigate(`${RouteNames.P_AGENT}/${agent.id}`)}]

        if (checkRules([Rules.EDIT_AGENT], agent.author_id)) {
            menuItems.push({text: 'Редактировать', onClick: () => onEditHandler(agent)})
        }

        if (checkRules([Rules.REMOVE_AGENT], agent.author_id)) {
            menuItems.push({text: 'Удалить', onClick: () => onRemoveHandler(agent)})
        }

        openContextMenu(e, menuItems)
    }

    const onChangeLayoutHandler = (value: 'list' | 'till'): void => {
        setLayout(value)
        changeLayout('agents', value)
    }

    const filterItemsHandler = (list: IAgent[]): IAgent[] => {
        if (!list || !list.length) {
            return []
        }

        return list.filter((item: IAgent) => {
            return filters.types.includes(item.type)
        })
    }

    const filtersContent: IFilterContent[] = useMemo((): IFilterContent[] => {
        return [
            {
                title: 'Тип',
                type: 'checker',
                multi: true,
                items: agentTypes,
                selected: filters.types,
                onSelect: (values: string[]) => {
                    setFilters({...filters, types: values})
                }
            }
        ]
    }, [filters])

    return (
        <PanelView pageTitle='Агентства'>
            <SidebarLeft filters={filtersContent}
                         isShow={isShowFilter}
                         onChangeShow={(isShow: boolean) => setIsShowFilter(isShow)}
            />

            <Wrapper isFull>
                <Title type='h1'
                       onAdd={checkRules([Rules.ADD_AGENT]) ? onAddHandler.bind(this) : undefined}
                       onFilter={() => setIsShowFilter(!isShowFilter)}
                       searchText={searchText}
                       onSearch={search.bind(this)}
                       className={classes.title}
                       layouts={['list', 'till']}
                       activeLayout={layout}
                       onChangeLayout={onChangeLayoutHandler.bind(this)}
                >Агентства</Title>

                {layout === 'till'
                    ? <AgentTill list={filterAgent}
                                 fetching={fetching}
                                 onClick={(agent: IAgent) => onClickHandler(agent)}
                                 onContextMenu={(agent: IAgent, e: React.MouseEvent) => onContextMenuHandler(agent, e)}
                    />
                    : <AgentList list={filterAgent}
                                 fetching={fetching}
                                 onClick={(agent: IAgent) => onClickHandler(agent)}
                                 onContextMenu={(agent: IAgent, e: React.MouseEvent) => onContextMenuHandler(agent, e)}
                    />
                }
            </Wrapper>
        </PanelView>
    )
}

AgentsPage.displayName = 'AgentsPage'

export default React.memo(AgentsPage)
