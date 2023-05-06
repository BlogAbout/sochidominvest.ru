import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import {checkRules, Rules} from '../../../helpers/accessHelper'
import {RouteNames} from '../../../helpers/routerHelper'
import {IBuilding} from '../../../@types/IBuilding'
import {IUser} from '../../../@types/IUser'
import UserService from '../../../api/UserService'
import BuildingService from '../../../api/BuildingService'
import CompilationService from '../../../api/CompilationService'
import Title from '../../ui/Title/Title'
import Wrapper from '../../ui/Wrapper/Wrapper'
import PanelView from '../../views/PanelView/PanelView'
import BuildingTill from '../BuildingsPanelPage/components/BuildingTill/BuildingTill'
import openPopupBuildingCreate from '../../../components/popup/PopupBuildingCreate/PopupBuildingCreate'
import openPopupAlert from '../../popup/PopupAlert/PopupAlert'
import openContextMenu from '../../ui/ContextMenu/ContextMenu'
import classes from './FavoritePage.module.scss'

const FavoritePage: React.FC = (): React.ReactElement => {
    const navigate = useNavigate()

    const [favorites, setFavorites] = useState<IBuilding[]>([])
    const [fetching, setFetching] = useState(false)

    const {user} = useTypedSelector(state => state.userReducer)
    const {setUserAuth} = useActions()

    useEffect(() => {
        onSaveHandler()
    }, [user.favorites])

    const onSaveHandler = (): void => {
        setFavorites(user.favorites || [])
    }

    const onClickHandler = (building: IBuilding): void => {
        navigate(`${RouteNames.BUILDING}/${building.id}`)
    }

    const onEditHandler = (building: IBuilding): void => {
        openPopupBuildingCreate(document.body, {
            building: building,
            onSave: () => onSaveHandler()
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

    const onContextMenuItemHandler = (building: IBuilding, e: React.MouseEvent): void => {
        e.preventDefault()

        const menuItems: any[] = []

        if (user.favorite_ids && user.favorite_ids.length && building.id && user.favorite_ids.includes(building.id)) {
            menuItems.push({
                text: 'Удалить из избранного',
                onClick: () => onRemoveBuildingFromFavoriteHandler(building)
            })
        }

        if (checkRules([Rules.EDIT_BUILDING])) {
            menuItems.push({text: 'Редактировать', onClick: () => onEditHandler(building)})
        }

        if (checkRules([Rules.REMOVE_BUILDING])) {
            menuItems.push({text: 'Удалить', onClick: () => onRemoveHandler(building)})
        }

        openContextMenu(e, menuItems)
    }

    return (
        <PanelView pageTitle='Избранное'>
            <Wrapper isFull>
                <Title type='h1'
                       className={classes.title}
                >Избранное</Title>

                <BuildingTill list={favorites}
                              fetching={fetching}
                              onClick={(building: IBuilding) => onClickHandler(building)}
                              onContextMenu={(building: IBuilding, e: React.MouseEvent) => onContextMenuItemHandler(building, e)}
                />
            </Wrapper>
        </PanelView>
    )
}

FavoritePage.displayName = 'FavoritePage'

export default React.memo(FavoritePage)
