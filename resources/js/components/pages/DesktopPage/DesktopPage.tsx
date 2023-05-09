import React, {useEffect, useState} from 'react'
import classNames from 'classnames/bind'
import {useNavigate} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import {checkRules, Rules} from '../../../helpers/accessHelper'
import {RouteNames} from '../../../helpers/routerHelper'
import {IUser} from '../../../@types/IUser'
import {IFeed} from '../../../@types/IFeed'
import {IAgent} from '../../../@types/IAgent'
import {IDeveloper} from '../../../@types/IDeveloper'
import {IArticle} from '../../../@types/IArticle'
import UserService from '../../../api/UserService'
import FeedService from '../../../api/FeedService'
import DeveloperService from '../../../api/DeveloperService'
import AgentService from '../../../api/AgentService'
import BlockingElement from '../../../components/ui/BlockingElement/BlockingElement'
import Title from '../../ui/Title/Title'
import Wrapper from '../../ui/Wrapper/Wrapper'
import PanelView from '../../views/PanelView/PanelView'
import Avatar from '../../../components/ui/Avatar/Avatar'
import Empty from '../../../components/ui/Empty/Empty'
import FeedList from '../SupportPage/components/FeedList/FeedList'
import AgentList from '../AgentsPage/components/AgentList/AgentList'
import DeveloperList from '../DevelopersPage/components/DeveloperList/DeveloperList'
import openPopupAgentCreate from '../../../components/popup/PopupAgentCreate/PopupAgentCreate'
import openPopupAlert from '../../popup/PopupAlert/PopupAlert'
import openPopupDeveloperCreate from '../../../components/popup/PopupDeveloperCreate/PopupDeveloperCreate'
import openContextMenu from '../../ui/ContextMenu/ContextMenu'
import classes from './DesktopPage.module.scss'

const cx = classNames.bind(classes)

const DesktopPage: React.FC = (): React.ReactElement => {
    const navigate = useNavigate()

    const [userInfo, setUserInfo] = useState<IUser>({} as IUser)
    const [tickets, setTickets] = useState<IFeed[]>([])
    const [agents, setAgents] = useState<IAgent[]>([])
    const [developers, setDevelopers] = useState<IDeveloper[]>([])
    const [filterArticles, setFilterArticles] = useState<IArticle[]>([])

    const [fetchingUser, setFetchingUser] = useState(false)
    const [fetchingTickets, setFetchingTickets] = useState(false)
    const [fetchingAgents, setFetchingAgents] = useState(false)
    const [fetchingDevelopers, setFetchingDevelopers] = useState(false)

    const {user} = useTypedSelector(state => state.userReducer)
    const {articles, fetching: fetchingArticles} = useTypedSelector(state => state.articleReducer)
    const {fetchArticleList} = useActions()

    useEffect(() => {
        fetchArticlesHandler()
    }, [])

    useEffect(() => {
        fetchUserHandler()
    }, [user.id])

    useEffect(() => {
        fetchFeedsHandler()

        if (checkRules([Rules.SHOW_DEVELOPERS])) {
            fetchDevelopersHandler()
        }

        if (checkRules([Rules.SHOW_AGENTS])) {
            fetchAgentsHandler()
        }
    }, [userInfo.id])

    useEffect(() => {
        if (!articles || !articles.length) {
            setFilterArticles([])
        } else {
            setFilterArticles(articles.filter((article: IArticle) => article.is_active === 1))
        }
    }, [articles])

    const fetchArticlesHandler = (): void => {
        fetchArticleList({active: [0, 1]})
    }

    const fetchUserHandler = (): void => {
        let findUserId = user.id

        if (!user.id) {
            const localStorageUserId = localStorage.getItem('id') || ''

            if (localStorageUserId) {
                findUserId = parseInt(localStorageUserId)
            }
        }

        if (findUserId) {
            setFetchingUser(true)

            UserService.fetchUserById(findUserId)
                .then((response: any) => setUserInfo(response.data.data))
                .catch((error: any) => console.error('Ошибка загрузки данных пользователя', error))
                .finally(() => setFetchingUser(false))
        }
    }

    const fetchFeedsHandler = (): void => {
        if (!userInfo || !userInfo.id) {
            return
        }

        setFetchingTickets(true)

        FeedService.fetchFeeds({active: [1], author: [userInfo.id]})
            .then((response: any) => setTickets(response.data.data))
            .catch((error: any) => console.error('Ошибка загрузки тикетов пользователя', error))
            .finally(() => setFetchingTickets(false))
    }

    const fetchDevelopersHandler = (): void => {
        setFetchingDevelopers(true)

        DeveloperService.fetchDevelopers({active: [0, 1], author: [user.id || 0]})
            .then((response: any) => setDevelopers(response.data.data))
            .catch((error: any) => console.error('Ошибка загрузки застройщиков пользователя', error))
            .finally(() => setFetchingDevelopers(false))
    }

    const fetchAgentsHandler = (): void => {
        setFetchingAgents(true)

        AgentService.fetchAgents({active: [0, 1], author: [user.id || 0]})
            .then((response: any) => setAgents(response.data.data))
            .catch((error: any) => console.error('Ошибка загрузки агентств пользователя', error))
            .finally(() => setFetchingAgents(false))
    }

    const onContextMenuAgent = (agent: IAgent, e: React.MouseEvent): void => {
        e.preventDefault()

        const menuItems = [
            {
                text: 'Редактировать',
                onClick: () => {
                    openPopupAgentCreate(document.body, {
                        agent: agent,
                        onSave: () => fetchAgentsHandler()
                    })
                }
            },
            {
                text: 'Удалить',
                onClick: () => {
                    openPopupAlert(document.body, {
                        text: `Вы действительно хотите удалить ${agent.name}?`,
                        buttons: [
                            {
                                text: 'Удалить',
                                onClick: () => {
                                    if (agent.id) {
                                        setFetchingAgents(true)

                                        AgentService.removeAgent(agent.id)
                                            .then(() => fetchAgentsHandler())
                                            .catch((error: any) => {
                                                openPopupAlert(document.body, {
                                                    title: 'Ошибка!',
                                                    text: error.data.message
                                                })
                                            })
                                            .finally(() => setFetchingAgents(false))
                                    }
                                }
                            },
                            {text: 'Отмена'}
                        ]
                    })
                }
            }
        ]

        openContextMenu(e, menuItems)
    }

    const onContextMenuDeveloper = (developer: IDeveloper, e: React.MouseEvent): void => {
        e.preventDefault()

        const menuItems = [
            {
                text: 'Редактировать',
                onClick: () => {
                    openPopupDeveloperCreate(document.body, {
                        developer: developer,
                        onSave: () => fetchDevelopersHandler()
                    })
                }
            },
            {
                text: 'Удалить',
                onClick: () => {
                    openPopupAlert(document.body, {
                        text: `Вы действительно хотите удалить ${developer.name}?`,
                        buttons: [
                            {
                                text: 'Удалить',
                                onClick: () => {
                                    if (developer.id) {
                                        setFetchingDevelopers(true)

                                        AgentService.removeAgent(developer.id)
                                            .then(() => fetchDevelopersHandler())
                                            .catch((error: any) => {
                                                openPopupAlert(document.body, {
                                                    title: 'Ошибка!',
                                                    text: error.data.message
                                                })
                                            })
                                            .finally(() => setFetchingDevelopers(false))
                                    }
                                }
                            },
                            {text: 'Отмена'}
                        ]
                    })
                }
            }
        ]

        openContextMenu(e, menuItems)
    }

    const renderUserInfo = (): React.ReactElement => {
        return (
            <div className={cx({'col': true, 'col-3': true})}>
                <Title type='h2'>Личная информация</Title>

                <BlockingElement fetching={fetchingUser} className={classes.list}>
                    <div className={cx({'block': true, 'noClick': true})}>
                        <Avatar href={userInfo.avatar ? userInfo.avatar.content : ''}
                                alt={userInfo.name}
                                width={110}
                                height={110}
                        />

                        <div className={classes.meta}>
                            <div className={classes.row}>
                                <div className={classes.label}>Имя:</div>
                                <div className={classes.param}>{userInfo.name}</div>
                            </div>
                            {userInfo.post ?
                                <div className={classes.row}>
                                    <div className={classes.label}>Должность:</div>
                                    <div className={classes.param}>{userInfo.post.name}</div>
                                </div>
                                : null
                            }
                            <div className={classes.row}>
                                <div className={classes.label}>Email:</div>
                                <div className={classes.param}>{userInfo.email}</div>
                            </div>
                            <div className={classes.row}>
                                <div className={classes.label}>Телефон:</div>
                                <div className={classes.param}>{userInfo.phone}</div>
                            </div>
                        </div>
                    </div>
                </BlockingElement>
            </div>
        )
    }

    const renderTariffsInfo = (): React.ReactElement | null => {
        if (!userInfo || !checkRules([Rules.SHOW_TARIFFS])) {
            return null
        }

        return (
            <div className={cx({'col': true, 'col-3': true})}>
                <Title type='h2'>Тарифный план</Title>

                <BlockingElement fetching={fetchingUser} className={classes.list}>
                    <div className={classes.row}>
                        <div className={classes.label}>Текущий тариф:</div>
                        <div className={classes.param}>
                            {userInfo.tariff ? userInfo.tariff.name : 'Нет активного тарифа'}&nbsp;
                            (<span className={classes.link}
                                   onClick={() => navigate(RouteNames.P_TARIFF)}>изменить</span>)
                        </div>
                    </div>

                    <div className={classes.row}>
                        <div className={classes.label}>Дата окончания:</div>
                        <div className={classes.param}>
                            {userInfo.tariff ? userInfo.date_tariff_expired : 'Бессрочно'}
                        </div>
                    </div>
                </BlockingElement>
            </div>
        )
    }

    const renderArticlesInfo = (): React.ReactElement => {
        return (
            <div className={cx({'col': true, 'col-3': true})}>
                <Title type='h2'>Последние события</Title>

                <BlockingElement fetching={fetchingArticles} className={classes.list}>
                    {filterArticles && filterArticles.length ?
                        filterArticles.map((article: IArticle) => {
                            return (
                                <div key={article.id}
                                     className={classes.block}
                                     onClick={() => navigate(`${RouteNames.ARTICLE}/${article.id}`)}
                                >
                                    <Avatar href={article.avatar ? article.avatar.content : ''}
                                            alt={article.name}
                                            width={75}
                                            height={75}
                                    />

                                    <div className={classes.meta}>
                                        <div className={classes.title}>{article.name}</div>
                                        <div className={classes.date} title='Дата публикации'>
                                            <FontAwesomeIcon icon='calendar'/>
                                            <span>{article.date_created}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                        : <Empty message='Нет активных событий.'/>
                    }
                </BlockingElement>
            </div>
        )
    }

    const renderTicketsInfo = (): React.ReactElement => {
        return (
            <div className={cx({'col': true, 'col-2': true})}>
                <Title type='h2'>Активные тикеты</Title>

                <FeedList list={tickets} fetching={fetchingTickets} onSave={() => {
                }} isCompact/>
            </div>
        )
    }

    const renderAgentsInfo = (): React.ReactElement | null => {
        if (!checkRules([Rules.SHOW_AGENTS])) {
            return null
        }

        const showAdd = checkRules([Rules.ADD_AGENT])
        const isDisable = checkRules([Rules.MORE_TARIFF_BASE, Rules.ADD_AGENT])
        const emptyText = showAdd ? 'У Вас еще нет созданных агентств.' : 'На текущем тарифе не доступно.'

        return (
            <div className={cx({'col': true, 'col-2': true})}>
                <Title type='h2'
                       onAdd={() => showAdd ?
                           openPopupAgentCreate(document.body, {
                               isDisable: isDisable,
                               onSave: () => fetchAgentsHandler()
                           })
                           : undefined}
                >Мои агентства</Title>

                <AgentList list={agents}
                           fetching={fetchingAgents}
                           onClick={() => {
                           }}
                           onContextMenu={(agent: IAgent, e: React.MouseEvent) => onContextMenuAgent(agent, e)}
                           emptyText={emptyText}
                           isCompact
                />
            </div>
        )
    }

    const renderDevelopersInfo = (): React.ReactElement | null => {
        if (!checkRules([Rules.SHOW_DEVELOPERS])) {
            return null
        }

        const showAdd = checkRules([Rules.ADD_DEVELOPER])
        const isDisable = checkRules([Rules.MORE_TARIFF_BASE, Rules.ADD_DEVELOPER])
        const emptyText = showAdd ? 'У Вас еще нет созданных застройщиков.' : 'На текущем тарифе не доступно.'

        return (
            <div className={cx({'col': true, 'col-2': true})}>
                <Title type='h2'
                       onAdd={() => showAdd ?
                           openPopupDeveloperCreate(document.body, {
                               isDisable: isDisable,
                               onSave: () => fetchDevelopersHandler()
                           })
                           : undefined}
                >Мои застройщики</Title>

                <DeveloperList list={developers}
                               fetching={fetchingDevelopers}
                               onClick={() => {
                               }}
                               onContextMenu={(developer: IDeveloper, e: React.MouseEvent) => onContextMenuDeveloper(developer, e)}
                               emptyText={emptyText}
                               isCompact
                />
            </div>
        )
    }

    return (
        <PanelView pageTitle='Рабочий стол'>
            <Wrapper isFull>
                <Title type='h1'
                       className={classes.pageTitle}
                >Рабочий стол</Title>

                <BlockingElement fetching={false} className={classes.columns}>
                    {renderUserInfo()}
                    {renderTariffsInfo()}
                    {renderArticlesInfo()}
                    {renderAgentsInfo()}
                    {renderDevelopersInfo()}
                    {renderTicketsInfo()}
                </BlockingElement>
            </Wrapper>
        </PanelView>
    )
}

DesktopPage.displayName = 'DesktopPage'

export default React.memo(DesktopPage)
