import React, {useState} from 'react'
import {IUserExternal} from '../../../../../@types/IUser'
import {checkRules, Rules} from '../../../../../helpers/accessHelper'
import UserService from '../../../../../api/UserService'
import ListHead from '../../../../ui/List/components/ListHead/ListHead'
import ListCell from '../../../../ui/List/components/ListCell/ListCell'
import ListBody from '../../../../ui/List/components/ListBody/ListBody'
import ListRow from '../../../../ui/List/components/ListRow/ListRow'
import List from '../../../../ui/List/List'
import Empty from '../../../../ui/Empty/Empty'
import openPopupAlert from '../../../../popup/PopupAlert/PopupAlert'
import openContextMenu from '../../../../ui/ContextMenu/ContextMenu'
import openPopupUserExternalCreate
    from '../../../../../components/popup/PopupUserExternalCreate/PopupUserExternalCreate'
import classes from './ExternalUserList.module.scss'

interface Props {
    list: IUserExternal[]
    fetching: boolean

    onSave(): void
}

const defaultProps: Props = {
    list: [],
    fetching: false,
    onSave: () => {
        console.info('ExternalUserList onSave')
    }
}

const ExternalUserList: React.FC<Props> = (props): React.ReactElement => {
    const [fetching, setFetching] = useState(props.fetching)

    const onEditHandler = (user: IUserExternal): void => {
        openPopupUserExternalCreate(document.body, {
            user: user,
            onSave: () => props.onSave()
        })
    }

    const onRemoveHandler = (user: IUserExternal): void => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить "${user.name}"?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (user.id) {
                            setFetching(true)

                            UserService.removeUserExternal(user.id)
                                .then(() => props.onSave())
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

    const onContextMenuHandler = (user: IUserExternal, e: React.MouseEvent): void => {
        e.preventDefault()

        if (checkRules([Rules.IS_MANAGER])) {
            const menuItems = [
                {
                    text: 'Редактировать',
                    onClick: () => onEditHandler(user)
                },
                {
                    text: 'Удалить',
                    onClick: () => onRemoveHandler(user)
                }
            ]

            openContextMenu(e, menuItems)
        }
    }

    return (
        <List className={classes.ExternalUserList}>
            <ListHead>
                <ListCell className={classes.name}>Имя</ListCell>
                <ListCell className={classes.email}>Email</ListCell>
                <ListCell className={classes.phone}>Телефон</ListCell>
            </ListHead>

            <ListBody fetching={props.fetching || fetching}>
                {props.list && props.list.length ?
                    props.list.map((user: IUserExternal) => {
                        return (
                            <ListRow key={user.id}
                                     onContextMenu={(e: React.MouseEvent) => onContextMenuHandler(user, e)}
                                     onClick={() => {
                                     }}
                                     isDisabled={!user.is_active}
                            >
                                <ListCell className={classes.name}>{user.name}</ListCell>
                                <ListCell className={classes.email}>{user.email}</ListCell>
                                <ListCell className={classes.phone}>{user.phone}</ListCell>
                            </ListRow>
                        )
                    })
                    : <Empty message='Нет внешних пользователей'/>
                }
            </ListBody>
        </List>
    )
}

ExternalUserList.defaultProps = defaultProps
ExternalUserList.displayName = 'UserExternalList'

export default React.memo(ExternalUserList)
