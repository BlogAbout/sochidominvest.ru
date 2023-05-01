import React, {useEffect, useMemo, useRef, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import useInfiniteScroll from '../../../hooks/useInfiniteScroll'
import {
    buildingClasses,
    buildingElectricity,
    buildingEntrance,
    buildingFormat,
    buildingGas,
    buildingHeating,
    buildingMaterials,
    buildingParking,
    buildingSewerage,
    buildingTerritory,
    buildingTypes,
    buildingWaterSupply,
    checkBuildingByDistrict,
    checkBuildingByRangeArea,
    checkBuildingByRangeCost,
    checkVisibleBuildingByAuthor
} from '../../../helpers/buildingHelper'
import {compareText} from '../../../helpers/filterHelper'
import {changeLayout, getLayout, getSetting} from '../../../helpers/utilHelper'
import {checkRules, Rules} from '../../../helpers/accessHelper'
import {RouteNames} from '../../../helpers/routerHelper'
import {IBuilding} from '../../../@types/IBuilding'
import {IFilterContent} from '../../../@types/IFilter'
import {IUser} from '../../../@types/IUser'
import UserService from '../../../api/UserService'
import BuildingService from '../../../api/BuildingService'
import SidebarLeft from '../../../components/ui/SidebarLeft/SidebarLeft'
import Title from '../../ui/Title/Title'
import Wrapper from '../../ui/Wrapper/Wrapper'
import PanelView from '../../views/PanelView/PanelView'
import BuildingList from './components/BuildingList/BuildingList'
import BuildingTill from './components/BuildingTill/BuildingTill'
import openPopupBuildingCreate from '../../../components/popup/PopupBuildingCreate/PopupBuildingCreate'
import openPopupAlert from '../../popup/PopupAlert/PopupAlert'
import openContextMenu from '../../ui/ContextMenu/ContextMenu'
import CompilationService from '../../../api/CompilationService'
import BuildingMap from './components/BuildingMap/BuildingMap'
import classes from './BuildingsPanelPage.module.scss'

const BuildingsPanelPage: React.FC = (): React.ReactElement => {
    const navigate = useNavigate()

    const refScrollerContainer = useRef(null)

    const [fetching, setFetching] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterBuilding, setFilterBuilding] = useState<IBuilding[]>([])
    const [isShowFilter, setIsShowFilter] = useState(false)
    const [filters, setFilters] = useState<any>({
        buildingCost: {min: 0, max: 0},
        buildingArea: {min: 0, max: 0},
        buildingDistrictZone: [],
        rent: [],
        buildingType: [],
        houseClass: [],
        material: [],
        houseType: [],
        entranceHouse: [],
        parking: [],
        territory: [],
        gas: [],
        heating: [],
        electricity: [],
        sewerage: [],
        waterSupply: []
    })
    const [layout, setLayout] = useState<'list' | 'till' | 'map'>(getLayout('buildings'))
    const [currentPage, setCurrentPage] = useState(1)
    const [countPerPage, setCountPerPage] = useState(20)
    const [apiKey, setApiKey] = useState('3ed788dc-edd5-4bce-8720-6cd8464b45bd')
    const [presetIcon, setPresetIcon] = useState('islands#blueIcon')

    const {user} = useTypedSelector(state => state.userReducer)
    const {buildings, fetching: fetchingBuilding} = useTypedSelector(state => state.buildingReducer)
    const {settings} = useTypedSelector(state => state.settingReducer)
    const {fetchBuildingList, setUserAuth} = useActions()

    const [readMoreElementRef]: any = useInfiniteScroll(
        currentPage * countPerPage < buildings.length
            ? () => setCurrentPage(currentPage + 1)
            : () => {
            },
        fetching
    )

    useEffect(() => {
        fetchBuildingsHandler()
    }, [])

    useEffect(() => {
        search(searchText)
    }, [buildings, filters])

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

    const fetchBuildingsHandler = (): void => {
        fetchBuildingList({active: [0, 1]})
    }

    const onSaveHandler = (): void => {
        fetchBuildingsHandler()
    }

    const search = (value: string): void => {
        setSearchText(value)

        if (!buildings || !buildings.length) {
            setFilterBuilding([])
        }

        if (value !== '') {
            setFilterBuilding(filterItemsHandler(buildings.filter((building: IBuilding) => {
                return compareText(building.name, value) || (building.address && compareText(building.address, value))
            })))
        } else {
            setFilterBuilding(filterItemsHandler(buildings))
        }
    }

    const onClickHandler = (building: IBuilding): void => {
        navigate(`${RouteNames.BUILDING}/${building.id}`)
    }

    const onAddHandler = (type: 'building' | 'apartment' | 'house' | 'land' | 'commerce' | 'garage'): void => {
        openPopupBuildingCreate(document.body, {
            type: type,
            onSave: () => onSaveHandler()
        })
    }

    const onEditHandler = (building: IBuilding): void => {
        openPopupBuildingCreate(document.body, {
            building: building,
            onSave: () => onSaveHandler()
        })
    }

    const onRemoveHandler = (building: IBuilding): void => {
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

    // Удаление объекта из избранного
    const onRemoveBuildingFromFavoriteHandler = (building: IBuilding): void => {
        if (building.id) {
            const favoriteIds: number[] = user.favorite_ids ? user.favorite_ids.filter((id: number) => id !== building.id) : []
            const userUpdate: IUser = JSON.parse(JSON.stringify(user))
            userUpdate.favorite_ids = favoriteIds

            setFetching(true)

            UserService.saveUser(userUpdate)
                .then((response: any) => setUserAuth(response))
                .catch((error: any) => {
                    console.error('Ошибка удаления из избранного', error)

                    openPopupAlert(document.body, {
                        title: 'Ошибка!',
                        text: error.data.data
                    })
                })
                .finally(() => setFetching(false))
        }
    }

    // Удаление объекта из подборки
    const onRemoveBuildingFromCompilationHandler = (building: IBuilding, compilationId?: number): void => {
        if (compilationId && building.id) {
            setFetching(true)

            CompilationService.removeBuildingFromCompilation(compilationId, building.id)
                .then(() => onSaveHandler())
                .catch((error: any) => {
                    console.error('Ошибка удаления из подборки', error)

                    openPopupAlert(document.body, {
                        title: 'Ошибка!',
                        text: error.data.data
                    })
                })
                .finally(() => setFetching(false))
        }
    }

    const onContextMenuItemHandler = (building: IBuilding, e: React.MouseEvent): void => {
        e.preventDefault()

        const menuItems: any[] = []

        if (user.favorite_ids && user.favorite_ids.length && building.id && user.favorite_ids.includes(building.id)) {
            menuItems.push({
                text: 'Удалить из избранного',
                onClick: () => onRemoveBuildingFromFavoriteHandler(building)
            })
        }

        // if (props.compilationId && props.building.id) {
        //     menuItems.push({text: 'Удалить из подборки', onClick: () => removeBuildingFromCompilation()})
        // }

        if (checkRules([Rules.EDIT_BUILDING], building.author_id)) {
            menuItems.push({text: 'Редактировать', onClick: () => onEditHandler(building)})
        }

        if (checkRules([Rules.REMOVE_BUILDING], building.author_id)) {
            menuItems.push({text: 'Удалить', onClick: () => onRemoveHandler(building)})
        }

        if (menuItems.length) {
            openContextMenu(e, menuItems)
        }
    }

    const onContextMenuHandler = (e: React.MouseEvent): void => {
        e.preventDefault()

        const menuItems = [
            {text: 'Квартиру', onClick: () => onAddHandler('apartment')},
            {text: 'Дом', onClick: () => onAddHandler('house')},
            {text: 'Земельный участок', onClick: () => onAddHandler('land')},
            {text: 'Коммерцию', onClick: () => onAddHandler('commerce')},
            {text: 'Гараж, машиноместо', onClick: () => onAddHandler('garage')}
        ]

        if (checkRules([Rules.MORE_TARIFF_BASE])) {
            menuItems.unshift({text: 'Жилой комплекс', onClick: () => onAddHandler('building')})
        }

        openContextMenu(e.currentTarget, menuItems)
    }

    const onChangeLayoutHandler = (value: 'list' | 'till' | 'map'): void => {
        setLayout(value)
        changeLayout('buildings', value)
    }

    const filterItemsHandler = (list: IBuilding[]): IBuilding[] => {
        if (!list || !list.length) {
            return []
        }

        return list.filter((item: IBuilding) => {
            return checkVisibleBuildingByAuthor(item, user.id) &&
                checkBuildingByRangeCost(item, filters) &&
                checkBuildingByRangeArea(item, filters) &&
                checkBuildingByDistrict(item, filters) &&
                ((!filters.buildingType || !filters.buildingType.length) || (filters.buildingType && item.type && filters.buildingType.includes(item.type))) &&
                ((!filters.houseClass || !filters.houseClass.length) || (filters.houseClass && item.info.house_class && filters.houseClass.includes(item.info.house_class))) &&
                ((!filters.material || !filters.material.length) || (filters.material && item.info.material && filters.material.includes(item.info.material))) &&
                ((!filters.houseType || !filters.houseType.length) || (filters.houseType && item.info.house_type && filters.houseType.includes(item.info.house_type))) &&
                ((!filters.entranceHouse || !filters.entranceHouse.length) || (filters.entranceHouse && item.info.entrance_house && filters.entranceHouse.includes(item.info.entrance_house))) &&
                ((!filters.parking || !filters.parking.length) || (filters.parking && item.info.parking && filters.parking.includes(item.info.parking))) &&
                ((!filters.territory || !filters.territory.length) || (filters.territory && item.info.territory && filters.territory.includes(item.info.territory))) &&
                ((!filters.gas || !filters.gas.length) || (filters.gas && item.info.gas && filters.gas.includes(item.info.gas))) &&
                ((!filters.electricity || !filters.electricity.length) || (filters.electricity && item.info.electricity && filters.electricity.includes(item.info.electricity))) &&
                ((!filters.sewerage || !filters.sewerage.length) || (filters.sewerage && item.info.sewerage && filters.sewerage.includes(item.info.sewerage))) &&
                ((!filters.waterSupply || !filters.waterSupply.length) || (filters.waterSupply && item.info.water_supply && filters.waterSupply.includes(item.info.water_supply))) &&
                ((!filters.rent || !filters.rent.length) || (filters.rent && item.is_rent && filters.rent.map(Number).includes(item.is_rent)))
        })
    }

    const filtersContent: IFilterContent[] = useMemo((): IFilterContent[] => {
        return [
            {
                title: 'Стоимость',
                type: 'ranger',
                rangerParams: {
                    suffix: 'руб.',
                    step: 1,
                    max: 999999999,
                    afterComma: 0
                },
                multi: false,
                selected: filters.buildingCost,
                onSelect: (values: string[]) => {
                    setFilters({...filters, buildingCost: values})
                }
            },
            {
                title: 'Площадь',
                type: 'ranger',
                rangerParams: {
                    suffix: 'м2.',
                    step: 0.01,
                    max: 999,
                    afterComma: 2
                },
                multi: false,
                selected: filters.buildingArea,
                onSelect: (values: string[]) => {
                    setFilters({...filters, buildingArea: values})
                }
            },
            {
                title: 'Район',
                type: 'district',
                multi: true,
                selected: filters.buildingDistrictZone,
                onSelect: (values: string[]) => {
                    setFilters({...filters, buildingDistrictZone: values})
                }
            },
            {
                title: 'Аренда',
                type: 'checker',
                multi: false,
                items: [{key: '1', text: 'Да'}],
                selected: filters.rent,
                onSelect: (values: string[]) => {
                    setFilters({...filters, rent: values})
                }
            },
            {
                title: 'Тип недвижимости',
                type: 'checker',
                multi: true,
                items: buildingTypes,
                selected: filters.buildingType,
                onSelect: (values: string[]) => {
                    setFilters({...filters, buildingType: values})
                }
            },
            {
                title: 'Класс дома',
                type: 'checker',
                multi: true,
                items: buildingClasses,
                selected: filters.houseClass,
                onSelect: (values: string[]) => {
                    setFilters({...filters, houseClass: values})
                }
            },
            {
                title: 'Материал здания',
                type: 'checker',
                multi: true,
                items: buildingMaterials,
                selected: filters.material,
                onSelect: (values: string[]) => {
                    setFilters({...filters, material: values})
                }
            },
            {
                title: 'Тип дома',
                type: 'checker',
                multi: true,
                items: buildingFormat,
                selected: filters.houseType,
                onSelect: (values: string[]) => {
                    setFilters({...filters, houseType: values})
                }
            },
            {
                title: 'Территория',
                type: 'checker',
                multi: true,
                items: buildingEntrance,
                selected: filters.entranceHouse,
                onSelect: (values: string[]) => {
                    setFilters({...filters, entranceHouse: values})
                }
            },
            {
                title: 'Паркинг',
                type: 'checker',
                multi: true,
                items: buildingParking,
                selected: filters.parking,
                onSelect: (values: string[]) => {
                    setFilters({...filters, parking: values})
                }
            },
            {
                title: 'Подъезд к дому',
                type: 'checker',
                multi: true,
                items: buildingTerritory,
                selected: filters.territory,
                onSelect: (values: string[]) => {
                    setFilters({...filters, territory: values})
                }
            },
            {
                title: 'Газ',
                type: 'checker',
                multi: true,
                items: buildingGas,
                selected: filters.gas,
                onSelect: (values: string[]) => {
                    setFilters({...filters, gas: values})
                }
            },
            {
                title: 'Отопление',
                type: 'checker',
                multi: true,
                items: buildingHeating,
                selected: filters.heating,
                onSelect: (values: string[]) => {
                    setFilters({...filters, heating: values})
                }
            },
            {
                title: 'Электричество',
                type: 'checker',
                multi: true,
                items: buildingElectricity,
                selected: filters.electricity,
                onSelect: (values: string[]) => {
                    setFilters({...filters, electricity: values})
                }
            },
            {
                title: 'Канализация',
                type: 'checker',
                multi: true,
                items: buildingSewerage,
                selected: filters.sewerage,
                onSelect: (values: string[]) => {
                    setFilters({...filters, sewerage: values})
                }
            },
            {
                title: 'Водоснабжение',
                type: 'checker',
                multi: true,
                items: buildingWaterSupply,
                selected: filters.waterSupply,
                onSelect: (values: string[]) => {
                    setFilters({...filters, waterSupply: values})
                }
            }
        ]
    }, [filters])

    return (
        <PanelView pageTitle='Недвижимость'>
            <SidebarLeft filters={filtersContent}
                         isShow={isShowFilter}
                         onChangeShow={(isShow: boolean) => setIsShowFilter(isShow)}
            />

            <Wrapper isFull>
                <Title type='h1'
                       onAdd={checkRules([Rules.ADD_BUILDING]) ? onContextMenuHandler.bind(this) : undefined}
                       onFilter={() => setIsShowFilter(!isShowFilter)}
                       searchText={searchText}
                       onSearch={search.bind(this)}
                       className={classes.title}
                       layouts={['list', 'till', 'map']}
                       activeLayout={layout}
                       onChangeLayout={onChangeLayoutHandler.bind(this)}
                >Недвижимость</Title>

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

BuildingsPanelPage.displayName = 'BuildingsPanelPage'

export default React.memo(BuildingsPanelPage)
