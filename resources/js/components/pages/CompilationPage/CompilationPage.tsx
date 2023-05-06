import React, {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import {checkRules, Rules} from '../../../helpers/accessHelper'
import {RouteNames} from '../../../helpers/routerHelper'
import {ICompilation} from '../../../@types/ICompilation'
import {IBuilding} from '../../../@types/IBuilding'
import {IMailing} from '../../../@types/IMailing'
import {IUser} from '../../../@types/IUser'
import BuildingService from '../../../api/BuildingService'
import CompilationService from '../../../api/CompilationService'
import UserService from '../../../api/UserService'
import Title from '../../ui/Title/Title'
import PanelView from '../../views/PanelView/PanelView'
import Wrapper from '../../ui/Wrapper/Wrapper'
import BuildingTill from '../BuildingsPanelPage/components/BuildingTill/BuildingTill'
import openContextMenu from '../../ui/ContextMenu/ContextMenu'
import openPopupBuildingCreate from '../../../components/popup/PopupBuildingCreate/PopupBuildingCreate'
import openPopupAlert from '../../popup/PopupAlert/PopupAlert'
import openPopupMailingCreate from '../../../components/popup/PopupMailingCreate/PopupMailingCreate'
import classes from './CompilationPage.module.scss'

type CompilationItemPagePanelParams = {
    id: string
}

const CompilationPage: React.FC = (): React.ReactElement => {
    const navigate = useNavigate()

    const params = useParams<CompilationItemPagePanelParams>()

    const [compilation, setCompilation] = useState<ICompilation>({} as ICompilation)
    const [filterBuilding, setFilterBuilding] = useState<IBuilding[]>([])
    const [fetching, setFetching] = useState(false)

    const {user} = useTypedSelector(state => state.userReducer)

    const {setUserAuth} = useActions()

    useEffect(() => {
        fetchCompilationInfo()
    }, [])

    const fetchCompilationInfo = (): void => {
        if (params.id) {
            const compilationId = parseInt(params.id)

            setFetching(false)

            CompilationService.fetchCompilationById(compilationId)
                .then((response: any) => {
                    const compilationData: ICompilation = response.data.data

                    if (compilationData.buildings && compilationData.buildings.length) {
                        const building_ids: number[] = []

                        compilationData.buildings.forEach((building: IBuilding) => {
                            if (building.id) {
                                building_ids.push(building.id)
                            }
                        })

                        setFilterBuilding(compilationData.buildings)
                        setCompilation({
                            ...compilationData,
                            building_ids: building_ids
                        })
                    } else {
                        setFilterBuilding([])
                        setCompilation({
                            ...compilationData,
                            building_ids: []
                        })
                    }
                })
                .catch((error: any) => console.error(error.data.message))
                .finally(() => setFetching(false))
        }
    }

    const onSaveHandler = (): void => {
        fetchCompilationInfo()
    }

    const onClickHandler = (building: IBuilding): void => {
        navigate(`${RouteNames.BUILDING}/${building.id}`)
    }

    const onEditHandler = (building: IBuilding): void => {
        openPopupBuildingCreate(document.body, {
            building: building,
            onSave: () => {
                onSaveHandler()
            }
        })
    }

    const onRemoveHandler = (building: IBuilding): void => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить ${building.name}?`,
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
                                        text: error.data.message
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
                        text: error.data.message
                    })
                })
                .finally(() => setFetching(false))
        }
    }

    // Удаление объекта из подборки
    const onRemoveBuildingFromCompilationHandler = (building: IBuilding): void => {
        if (building.id) {
            setFetching(true)

            const compilationUpdate: ICompilation = JSON.parse(JSON.stringify(compilation))

            compilationUpdate.building_ids = compilationUpdate.building_ids
                ? compilationUpdate.building_ids.filter((id: number) => id !== building.id)
                : []

            CompilationService.saveCompilation(compilationUpdate)
                .then(() => onSaveHandler())
                .catch((error: any) => {
                    console.error('Ошибка удаления из подборки', error)

                    openPopupAlert(document.body, {
                        title: 'Ошибка!',
                        text: error.data.message
                    })
                })
                .finally(() => setFetching(false))
        }
    }

    const onContextMenuItem = (building: IBuilding, e: React.MouseEvent): void => {
        e.preventDefault()

        const menuItems = []

        if (checkRules([Rules.EDIT_COMPILATION])) {
            menuItems.push({
                text: 'Удалить из подборки',
                onClick: () => onRemoveBuildingFromCompilationHandler(building)
            })

            menuItems.push({text: 'Редактировать', onClick: () => onEditHandler(building)})
        }

        if (checkRules([Rules.REMOVE_COMPILATION])) {
            menuItems.push({text: 'Удалить', onClick: () => onRemoveHandler(building)})
        }

        openContextMenu(e, menuItems)
    }

    const onAddHandler = (): void => {
        if (!compilation.id) {
            return
        }

        const mailing: IMailing = {
            id: null,
            name: '',
            content: compilation.id.toString(),
            content_html: '',
            type: 'compilation',
            status: 0,
            author_id: user.id,
            is_active: 1
        }

        openPopupMailingCreate(document.body, {
            mailing: mailing,
            onSave: () => {
                navigate(RouteNames.P_MAILING)
            }
        })
    }

    return (
        <PanelView pageTitle={compilation.name}>
            <Wrapper isFull>
                <Title type='h1'
                       onAdd={checkRules([Rules.ADD_MAILING]) ? onAddHandler.bind(this) : undefined}
                       addText='Создать рассылку'
                       className={classes.title}
                >{compilation.name}</Title>

                <BuildingTill list={filterBuilding}
                              fetching={fetching}
                              onClick={(building: IBuilding) => onClickHandler(building)}
                              onContextMenu={(building: IBuilding, e: React.MouseEvent) => onContextMenuItem(building, e)}
                />
            </Wrapper>
        </PanelView>
    )
}

CompilationPage.displayName = 'CompilationPage'

export default React.memo(CompilationPage)
