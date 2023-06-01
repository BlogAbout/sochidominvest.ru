import React from 'react'
import {IUser} from '../../../../../@types/IUser'
import {useTypedSelector} from '../../../../../hooks/useTypedSelector'
import Empty from '../../../../ui/Empty/Empty'
import BlockingElement from '../../../../../components/ui/BlockingElement/BlockingElement'
import Card from '../../../../ui/Card/Card.'
import classes from './UserTill.module.scss'

interface Props {
    list: IUser[]
    fetching: boolean

    onClick(user: IUser): void

    onContextMenu(user: IUser, e: React.MouseEvent): void
}

const defaultProps: Props = {
    list: [],
    fetching: false,
    onClick: (user: IUser) => {
        console.info('UserTill onClick', user)
    },
    onContextMenu: (user: IUser, e: React.MouseEvent) => {
        console.info('UserTill onClick', user, e)
    }
}

const UserTill: React.FC<Props> = (props): React.ReactElement => {
    const {onlineUsers} = useTypedSelector(state => state.messengerReducer)

    return (
        <div className={classes.UserTill}>
            <BlockingElement fetching={props.fetching} className={classes.list}>
                {props.list && props.list.length ?
                    props.list.map((user: IUser) => {
                        return (
                            <Card key={user.id}
                                  title={user.name}
                                  avatar={user.avatar ? user.avatar.content : ''}
                                  role={user.role ? user.role.name : ''}
                                  phone={user.phone}
                                  email={user.email}
                                  indicatorColor={user.id && onlineUsers.includes(user.id) ? 'green' : 'red'}
                                  indicatorText={user.id && onlineUsers.includes(user.id) ? 'Online' : `Был в сети: ${user.date_last_active}`}
                                  isDisabled={!user.is_active}
                                  isBlock={!!user.is_block}
                                  onContextMenu={(e: React.MouseEvent) => props.onContextMenu(user, e)}
                                  onClick={() => props.onClick(user)}
                            />
                        )
                    })
                    : <Empty message='Нет пользователей'/>
                }
            </BlockingElement>
        </div>
    )
}

UserTill.defaultProps = defaultProps
UserTill.displayName = 'UserTill'

export default React.memo(UserTill)
