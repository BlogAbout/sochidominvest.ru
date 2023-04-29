import React, {useEffect, useMemo, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {rolesList} from '../../../helpers/userHelper'
import {useActions} from '../../../hooks/useActions'
import {compareText} from '../../../helpers/filterHelper'
import {changeLayout, getLayout} from '../../../helpers/utilHelper'
import {checkRules, Rules} from '../../../helpers/accessHelper'
import {RouteNames} from '../../../helpers/routerHelper'
import {IUser} from '../../../@types/IUser'
import {IFilterContent} from '../../../@types/IFilter'
import Title from '../../ui/Title/Title'
import Wrapper from '../../ui/Wrapper/Wrapper'
import PanelView from '../../views/PanelView/PanelView'
import UserService from '../../../api/UserService'
import SidebarLeft from '../../../components/ui/SidebarLeft/SidebarLeft'
import UserList from './components/UserList/UserList'
import UserTill from './components/UserTill/UserTill'
import openPopupUserCreate from '../../../components/popup/PopupUserCreate/PopupUserCreate'
import openPopupAlert from '../../popup/PopupAlert/PopupAlert'
import openContextMenu from '../../ui/ContextMenu/ContextMenu'
import classes from './UsersPage.module.scss'

const UsersPage: React.FC = (): React.ReactElement => {
    const navigate = useNavigate()

    const [fetching, setFetching] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterUser, setFilterUser] = useState<IUser[]>([])
    const [isShowFilter, setIsShowFilter] = useState(false)
    const [filters, setFilters] = useState({
        types: ['1', '2', '3', '4'],
        block: ['0', '1']
    })
    const [layout, setLayout] = useState<'list' | 'till'>(getLayout('users'))

    const {users, fetching: fetchingUser, user} = useTypedSelector(state => state.userReducer)
    const {fetchUserList} = useActions()

    useEffect(() => {
        fetchUsersHandler()
    }, [])

    useEffect(() => {
        search(searchText)
    }, [users, filters])

    const fetchUsersHandler = (): void => {
        fetchUserList({active: [0, 1]})
    }

    const onSaveHandler = (): void => {
        fetchUsersHandler()
    }

    const search = (value: string): void => {
        setSearchText(value)

        if (!users || !users.length) {
            setFilterUser([])
        }

        if (value !== '') {
            setFilterUser(filterItemsHandler(users.filter((user: IUser) => {
                return compareText(user.name, value) || compareText(user.phone, value) || compareText(user.email, value)
            })))
        } else {
            setFilterUser(filterItemsHandler(users))
        }
    }

    const onClickHandler = (user: IUser): void => {
        navigate(`${RouteNames.P_USER}/${user.id}`)
    }

    const onAddHandler = (): void => {
        openPopupUserCreate(document.body, {
            onSave: () => onSaveHandler()
        })
    }

    const onEditHandler = (userEdit: IUser): void => {
        openPopupUserCreate(document.body, {
            user: userEdit,
            onSave: () => onSaveHandler()
        })
    }

    const onRemoveHandler = (userRemove: IUser): void => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить "${userRemove.name}"?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (user.id) {
                            setFetching(true)

                            UserService.removeUser(user.id)
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

    const onBlockingHandler = (userBlock: IUser): void => {
        const userInfo: IUser = {...userBlock}
        userInfo.is_block = userBlock.is_block ? 0 : 1

        UserService.saveUser(userInfo)
            .then(() => onSaveHandler())
            .catch((error: any) => {
                openPopupAlert(document.body, {
                    title: 'Ошибка!',
                    text: error.data.data
                })
            })
            .finally(() => setFetching(false))
    }

    const onContextMenuHandler = (userItem: IUser, e: React.MouseEvent): void => {
        e.preventDefault()

        const menuItems: any[] = []

        if (checkRules([Rules.EDIT_USER])) {
            menuItems.push({
                text: 'Редактировать',
                onClick: () => onEditHandler(userItem)
            })
        }

        if (checkRules([Rules.BLOCK_USER])) {
            menuItems.push({
                text: userItem.is_block ? 'Разблокировать' : 'Заблокировать',
                onClick: () => onBlockingHandler(userItem)
            })
        }

        if (checkRules([Rules.REMOVE_USER])) {
            menuItems.push({
                text: 'Удалить',
                onClick: () => onRemoveHandler(userItem)
            })
        }

        openContextMenu(e, menuItems)
    }

    const onChangeLayoutHandler = (value: 'list' | 'till'): void => {
        setLayout(value)
        changeLayout('users', value)
    }

    const filterItemsHandler = (list: IUser[]): IUser[] => {
        if (!list || !list.length) {
            return []
        }

        return list.filter((item: IUser) => {
            return filters.block.includes(String(item.is_block))
        })
    }

    const filtersContent: IFilterContent[] = useMemo((): IFilterContent[] => {
        return [
            {
                title: 'Роль',
                type: 'checker',
                multi: true,
                items: rolesList,
                selected: filters.types,
                onSelect: (values: string[]) => {
                    setFilters({...filters, types: values})
                }
            },
            {
                title: 'Заблокированные',
                type: 'checker',
                multi: true,
                items: [
                    {key: '0', text: 'Не заблокированные'},
                    {key: '1', text: 'Заблокированные'}
                ],
                selected: filters.block,
                onSelect: (values: string[]) => {
                    setFilters({...filters, block: values})
                }
            }
        ]
    }, [filters])

    return (
        <PanelView pageTitle='Пользователи'>
            <SidebarLeft filters={filtersContent}
                         isShow={isShowFilter}
                         onChangeShow={(isShow: boolean) => setIsShowFilter(isShow)}
            />

            <Wrapper isFull>
                <Title type='h1'
                       onAdd={onAddHandler.bind(this)}
                       onFilter={() => setIsShowFilter(!isShowFilter)}
                       searchText={searchText}
                       onSearch={search.bind(this)}
                       className={classes.title}
                       layouts={['list', 'till']}
                       activeLayout={layout}
                       onChangeLayout={onChangeLayoutHandler.bind(this)}
                >Пользователи</Title>

                {layout === 'till'
                    ? <UserTill list={filterUser}
                                fetching={fetching || fetchingUser}
                                onClick={(user: IUser) => onClickHandler(user)}
                                onContextMenu={(user: IUser, e: React.MouseEvent) => onContextMenuHandler(user, e)}
                    />
                    : <UserList list={filterUser}
                                fetching={fetching || fetchingUser}
                                onClick={(user: IUser) => onClickHandler(user)}
                                onContextMenu={(user: IUser, e: React.MouseEvent) => onContextMenuHandler(user, e)}
                    />
                }
            </Wrapper>
        </PanelView>
    )
}

UsersPage.displayName = 'UsersPage'

export default React.memo(UsersPage)
