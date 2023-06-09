import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import {IUser} from '../../../@types/IUser'
import {IBuilding} from '../../../@types/IBuilding'
import {IArticle} from '../../../@types/IArticle'
import BuildingService from '../../../api/BuildingService'
import ArticleService from '../../../api/ArticleService'
import PanelView from '../../views/PanelView/PanelView'
import Wrapper from '../../ui/Wrapper/Wrapper'
import Title from '../../ui/Title/Title'
import InfoList from '../DesktopPage/components/InfoList/InfoList'
import BlockingElement from '../../../components/ui/BlockingElement/BlockingElement'
import Preloader from '../../../components/ui/Preloader/Preloader'
import Empty from '../../../components/ui/Empty/Empty'
import openPopupUserCreate from '../../../components/popup/PopupUserCreate/PopupUserCreate'
import classes from './UserPage.module.scss'

type UserItemPageParams = {
    id: string
}

const UserPage: React.FC = (): React.ReactElement => {
    const params = useParams<UserItemPageParams>()

    const [userData, setUserData] = useState<IUser>({} as IUser)
    const [buildings, setBuildings] = useState<IBuilding[]>([])
    const [articles, setArticles] = useState<IArticle[]>([])
    const [fetchingBuildings, setFetchingBuildings] = useState(false)
    const [fetchingArticles, setFetchingArticles] = useState(false)

    const {users, fetching} = useTypedSelector(state => state.userReducer)
    const {fetchUserList} = useActions()

    useEffect(() => {
        fetchUsersHandler()
    }, [])

    useEffect(() => {
        if (params.id) {
            const userId = parseInt(params.id)
            const userInfo = users.find((user: IUser) => user.id === userId)

            if (userInfo) {
                setUserData(userInfo)
            }
        }
    }, [users])

    useEffect(() => {
        fetchBuildingsHandler()
        fetchArticlesHandler()
    }, [userData.id])

    const fetchUsersHandler = (): void => {
        fetchUserList({active: [0, 1]})
    }

    const fetchBuildingsHandler = (): void => {
        if (!userData.id) {
            return
        }

        setFetchingBuildings(true)

        BuildingService.fetchBuildings({active: [1], author: [userData.id]})
            .then((response: any) => setBuildings(response.data.data))
            .catch((error: any) => console.error(error))
            .finally(() => setFetchingBuildings(false))
    }

    const fetchArticlesHandler = (): void => {
        if (!userData.id) {
            return
        }

        setFetchingArticles(true)

        ArticleService.fetchArticles({active: [1], author: [userData.id]})
            .then((response: any) => setArticles(response.data.data))
            .catch((error: any) => console.error(error))
            .finally(() => setFetchingArticles(false))
    }

    const onClickEditHandler = (): void => {
        openPopupUserCreate(document.body, {
            user: userData,
            onSave: () => fetchUsersHandler()
        })
    }

    const renderStatisticBuilding = (): React.ReactElement => {
        return (
            <div className={classes.data}>
                <Title type='h2'>Статистика по недвижимости</Title>

                <InfoList type='building'
                          buildings={buildings}
                          fetching={fetchingBuildings}
                          onSave={() => fetchBuildingsHandler()}
                />
            </div>
        )
    }

    const renderStatisticArticle = (): React.ReactElement => {
        return (
            <div className={classes.data}>
                <Title type='h2'>Статистика по статьям</Title>

                <InfoList type='article'
                          articles={articles}
                          fetching={fetchingArticles}
                          onSave={() => fetchArticlesHandler()}
                />
            </div>
        )
    }

    const renderUserInfo = (): React.ReactElement => {
        return (
            <div className={classes.data}>
                <BlockingElement fetching={fetching} className={classes.container}>
                    <Title type='h2'>Информация</Title>

                    <div className={classes.row}>
                        <div className={classes.label}>Имя:</div>
                        <div className={classes.param}>{userData.name}</div>
                    </div>
                    {userData.post ?
                        <div className={classes.row}>
                            <div className={classes.label}>Должность:</div>
                            <div className={classes.param}>{userData.post.name}</div>
                        </div>
                        : null}
                    <div className={classes.row}>
                        <div className={classes.label}>Email:</div>
                        <div className={classes.param}>{userData.email}</div>
                    </div>
                    <div className={classes.row}>
                        <div className={classes.label}>Телефон:</div>
                        <div className={classes.param}>{userData.phone}</div>
                    </div>
                    <div className={classes.row}>
                        <div className={classes.label}>Роль:</div>
                        <div className={classes.param}>{userData.role ? userData.role.name : ''}</div>
                    </div>
                    <div className={classes.row}>
                        <div className={classes.label}>Тариф:</div>
                        <div className={classes.param}>{''}</div>
                    </div>
                    <div className={classes.row}>
                        <div className={classes.label}>Дата окончания тарифа:</div>
                        <div className={classes.param}>
                            {userData.tariff_expired !== 'free' ? userData.tariff_expired : 'Бессрочно'}
                        </div>
                    </div>
                    <div className={classes.row}>
                        <div className={classes.label}>Заблокирован:</div>
                        <div className={classes.param}>{userData.is_block ? 'да' : 'нет'}</div>
                    </div>
                </BlockingElement>
            </div>
        )
    }

    return (
        <PanelView pageTitle={!userData ? 'Пользователи' : userData.name}>
            <Wrapper isFull>
                <Title type='h1'
                       addText='Редактировать'
                       onAdd={onClickEditHandler.bind(this)}
                       className={classes.title}
                >{!userData ? 'Пользователи' : userData.name}</Title>

                {fetching && <Preloader/>}

                {!userData || !userData.id ?
                    <Empty message='Пользователь не найден'/>
                    :
                    <div className={classes.information}>
                        {renderUserInfo()}
                        {renderStatisticBuilding()}
                        {renderStatisticArticle()}
                    </div>
                }
            </Wrapper>
        </PanelView>
    )
}

UserPage.displayName = 'UserPage'

export default React.memo(UserPage)
