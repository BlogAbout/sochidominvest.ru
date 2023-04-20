import React, {useEffect, useRef, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import useInfiniteScroll from '../../../hooks/useInfiniteScroll'
import {compareText} from '../../../helpers/filterHelper'
import {changeLayout, getLayout, getSetting} from '../../../helpers/utilHelper'
import {allowForRole, allowForTariff} from '../../../helpers/accessHelper'
import {RouteNames} from '../../../helpers/routerHelper'
import {IBuilding} from '../../../@types/IBuilding'
import {IAgent} from '../../../@types/IAgent'
import Title from '../../ui/Title/Title'
import Wrapper from '../../ui/Wrapper/Wrapper'
import PanelView from '../../views/PanelView/PanelView'
import BuildingService from '../../../api/BuildingService'
import AgentService from '../../../api/AgentService'
import BuildingList from '../BuildingsPanelPage/components/BuildingList/BuildingList'
import BuildingTill from '../BuildingsPanelPage/components/BuildingTill/BuildingTill'
import openPopupBuildingCreate from '../../../components/popup/PopupBuildingCreate/PopupBuildingCreate'
import openPopupAlert from '../../../components/popup/PopupAlert/PopupAlert'
import openContextMenu from '../../ui/ContextMenu/ContextMenu'
import CompilationService from '../../../api/CompilationService'
import BuildingMap from '../BuildingsPanelPage/components/BuildingMap/BuildingMap'
import classes from './AgentPage.module.scss'

type AgentPageProps = {
    id: string
}

const AgentPage: React.FC = (): React.ReactElement => {
    const params = useParams<AgentPageProps>()

    const navigate = useNavigate()

    const refScrollerContainer = useRef(null)

    const [fetching, setFetching] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterBuilding, setFilterBuilding] = useState<IBuilding[]>([])
    const [layout, setLayout] = useState<'list' | 'till' | 'map'>(getLayout('buildings'))
    const [currentPage, setCurrentPage] = useState(1)
    const [countPerPage, setCountPerPage] = useState(20)
    const [apiKey, setApiKey] = useState('3ed788dc-edd5-4bce-8720-6cd8464b45bd')
    const [presetIcon, setPresetIcon] = useState('islands#blueIcon')
    const [agent, setAgent] = useState<IAgent | null>(null)

    const {user} = useTypedSelector(state => state.userReducer)
    const {buildings, fetching: fetchingBuilding} = useTypedSelector(state => state.buildingReducer)
    const {settings} = useTypedSelector(state => state.settingReducer)
    const {fetchBuildingList} = useActions()

    const [readMoreElementRef]: any = useInfiniteScroll(
        currentPage * countPerPage < buildings.length
            ? () => setCurrentPage(currentPage + 1)
            : () => {
            },
        fetching
    )

    useEffect(() => {
        fetchAgentHandler()
        fetchBuildingsHandler()
    }, [params.id])

    useEffect(() => {
        search(searchText)
    }, [buildings])

    useEffect(() => {
        if (settings) {
            setCountPerPage(parseInt(getSetting('count_items_admin', settings)))
            setApiKey(getSetting('map_api_key', settings))
            setPresetIcon(getSetting('map_icon_color', settings))
        }
    }, [settings])

    useEffect(() => {
        onScrollContainerTopHandler(refScrollerContainer)
    }, [countPerPage, filterBuilding])

    const onScrollContainerTopHandler = (refElement: React.MutableRefObject<any>) => {
        if (refElement && currentPage > 1) {
            if (refElement.current && refElement.current.scrollTop) {
                refElement.current.scrollTop = 0
            }

            setCurrentPage(1)
        }
    }

    const fetchBuildingsHandler = () => {
        fetchBuildingList({active: [0, 1]})
    }

    const fetchAgentHandler = () => {
        if (params.id) {
            setFetching(true)

            AgentService.fetchAgentById(parseInt(params.id))
                .then((response: any) => {
                    setAgent(response.data)
                })
                .catch((error: any) => {
                    console.error('Ошибка загрузки данных агентства', error)
                })
                .finally(() => setFetching(false))
        }
    }

    // Обработчик изменений
    const onSaveHandler = () => {
        fetchBuildingsHandler()
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (!buildings || !buildings.length) {
            setFilterBuilding([])
        }

        if (params.id) {
            const agentId: number = parseInt(params.id)

            if (value !== '') {
                setFilterBuilding(buildings.filter((building: IBuilding) => {
                    return building.agents.includes(agentId) && (compareText(building.name, value) || (building.address && compareText(building.address, value)))
                }))
            } else {
                setFilterBuilding(buildings.filter((building: IBuilding) => building.agents.includes(agentId)))
            }
        } else {
            setFilterBuilding([])
        }
    }

    const onClickHandler = (building: IBuilding) => {
        navigate(`${RouteNames.BUILDING}/${building.id}`)
    }

    const onAddHandler = (type: 'building' | 'apartment' | 'house' | 'land' | 'commerce' | 'garage') => {
        openPopupBuildingCreate(document.body, {
            type: type,
            onSave: () => onSaveHandler()
        })
    }

    // Редактирование
    const onEditHandler = (building: IBuilding) => {
        openPopupBuildingCreate(document.body, {
            building: building,
            onSave: () => onSaveHandler()
        })
    }

    // Удаление
    const onRemoveHandler = (building: IBuilding) => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить "${building.name}"?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (building.id) {
                            setFetching(true)

                            BuildingService.removeBuilding(building.id)
                                .then(() => onSaveHandler())
                                .catch((error: any) => {
                                    openPopupAlert(document.body, {
                                        title: 'Ошибка!',
                                        text: error.data
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

    // Удаление объекта из избранного
    const onRemoveBuildingFromFavoriteHandler = (building: IBuilding) => {
        if (building.id) {
            // FavoriteService.removeFavorite(building.id)
            //     .then(() => onSaveHandler())
            //     .catch((error: any) => {
            //         console.error('Ошибка удаления из избранного', error)
            //
            //         openPopupAlert(document.body, {
            //             title: 'Ошибка!',
            //             text: error.data
            //         })
            //     })
        }
    }

    // Удаление объекта из подборки
    const onRemoveBuildingFromCompilationHandler = (building: IBuilding, compilationId?: number) => {
        if (compilationId && building.id) {
            // CompilationService.removeBuildingFromCompilation(compilationId, building.id)
            //     .then(() => onSaveHandler())
            //     .catch((error: any) => {
            //         console.error('Ошибка удаления из подборки', error)
            //
            //         openPopupAlert(document.body, {
            //             title: 'Ошибка!',
            //             text: error.data
            //         })
            //     })
        }
    }

    // Открытие контекстного меню на элементе
    const onContextMenuItemHandler = (building: IBuilding, e: React.MouseEvent) => {
        e.preventDefault()

        const menuItems: any = []

        // Todo
        // if (props.isFavorite) {
        //     menuItems.push({text: 'Удалить из избранного', onClick: () => removeBuildingFromFavorite()})
        // }
        //
        // if (props.compilationId && props.building.id) {
        //     menuItems.push({text: 'Удалить из подборки', onClick: () => removeBuildingFromCompilation()})
        // }

        // if (allowForRole(['director', 'administrator', 'manager'], user.role) || (user.role === 'subscriber' && building.author === user.id)) {
        //     menuItems.push({text: 'Редактировать', onClick: () => onEditHandler(building)})
        //
        //     if (allowForRole(['director', 'administrator'], user.role) || (user.role === 'subscriber' && building.author === user.id)) {
        //         menuItems.push({text: 'Удалить', onClick: () => onRemoveHandler(building)})
        //     }
        // }

        if (menuItems.length) {
            openContextMenu(e, menuItems)
        }
    }

    // Меню выбора создания объекта
    const onContextMenuHandler = (e: React.MouseEvent) => {
        e.preventDefault()

        const menuItems = [
            {text: 'Квартиру', onClick: () => onAddHandler('apartment')},
            {text: 'Дом', onClick: () => onAddHandler('house')},
            {text: 'Земельный участок', onClick: () => onAddHandler('land')},
            {text: 'Коммерцию', onClick: () => onAddHandler('commerce')},
            {text: 'Гараж, машиноместо', onClick: () => onAddHandler('garage')}
        ]

        // if (allowForRole(['director', 'administrator', 'manager']) || (user.role === 'subscriber' && user.tariff !== undefined && allowForTariff(['business', 'effectivePlus'], user.tariff))) {
        //     menuItems.unshift({text: 'Жилой комплекс', onClick: () => onAddHandler('building')})
        // }

        openContextMenu(e.currentTarget, menuItems)
    }

    const onChangeLayoutHandler = (value: 'list' | 'till' | 'map') => {
        setLayout(value)
        changeLayout('buildings', value)
    }

    return (
        <PanelView pageTitle={agent ? `Агентство "${agent.name}"` : 'Агентство'}
                   pageDescription={agent ? agent.description : ''}
        >
            <Wrapper isFull>
                <Title type='h1'
                       // onAdd={allowForRole(['director', 'administrator', 'manager'], user.role) || (allowForRole(['subscriber']) && allowForTariff(['base', 'business', 'effectivePlus'], user.tariff)) ? (e: React.MouseEvent) => onContextMenuHandler(e) : undefined}
                       searchText={searchText}
                       onSearch={search.bind(this)}
                       className={classes.title}
                       layouts={['list', 'till', 'map']}
                       activeLayout={layout}
                       onChangeLayout={onChangeLayoutHandler.bind(this)}
                >{agent ? `Агентство "${agent.name}"` : 'Агентство'}</Title>

                {layout === 'till'
                    ? <BuildingTill list={filterBuilding}
                                    fetching={fetching || fetchingBuilding}
                                    onClick={(building: IBuilding) => onClickHandler(building)}
                                    onContextMenu={(building: IBuilding, e: React.MouseEvent) => onContextMenuItemHandler(building, e)}
                                    refScrollerContainer={refScrollerContainer}
                                    refContainerMore={readMoreElementRef}
                                    currentPage={currentPage}
                                    countPerPage={countPerPage}
                    />
                    : layout === 'map'
                        ? <BuildingMap list={filterBuilding}
                                       fetching={fetching || fetchingBuilding}
                                       onClick={(building: IBuilding) => onClickHandler(building)}
                                       onContextMenu={(building: IBuilding, e: React.MouseEvent) => onContextMenuItemHandler(building, e)}
                                       mapApiKey={apiKey}
                                       mapPresetIcon={presetIcon}
                        />
                        : <BuildingList list={filterBuilding}
                                        fetching={fetching || fetchingBuilding}
                                        onClick={(building: IBuilding) => onClickHandler(building)}
                                        onContextMenu={(building: IBuilding, e: React.MouseEvent) => onContextMenuItemHandler(building, e)}
                                        refScrollerContainer={refScrollerContainer}
                                        refContainerMore={readMoreElementRef}
                                        currentPage={currentPage}
                                        countPerPage={countPerPage}
                        />
                }
            </Wrapper>
        </PanelView>
    )
}

AgentPage.displayName = 'AgentPage'

export default React.memo(AgentPage)
