import React from 'react'
import classNames from 'classnames/bind'
import {useTypedSelector} from '../../../../../hooks/useTypedSelector'
import {findUser, getUserAvatar, getUserName} from '../../../../../helpers/userHelper'
import {findMembersIds, isNewMessage} from '../../../../../helpers/messengerHelper'
import {IMessenger} from '../../../../../@types/IMessenger'
import {IUser} from '../../../../../@types/IUser'
import Avatar from '../../../../ui/Avatar/Avatar'
import classes from './MessengerItem.module.scss'

interface Props {
    messenger: IMessenger
    users: IUser[]
    user: IUser

    onClick(): void
}

const defaultProps: Props = {
    messenger: {} as IMessenger,
    users: [],
    user: {} as IUser,
    onClick: () => {
        console.info('MessengerItem onClick')
    }
}

const cx = classNames.bind(classes)

const MessengerItem: React.FC<Props> = (props) => {
    const memberId: number = findMembersIds(props.messenger.members).find((id: number) => id !== props.user.id) || 0
    const member = findUser(props.users, memberId)
    const avatarUrl = getUserAvatar(props.users, memberId)
    const memberName = getUserName(props.users, props.user.id === props.messenger.author_id ? memberId : props.messenger.author_id)
    const isNew = isNewMessage(props.user.id || 0, props.messenger.members, props.messenger.messages[0])

    const {onlineUsers} = useTypedSelector(state => state.messengerReducer)

    return (
        <div className={classes.MessengerItem}
             onClick={props.onClick}
             onContextMenu={() => {
                 // Todo: Доделать контекстное меню на мессенджер (передать другому, удалить, выйти (для группового))
             }}
        >
            <Avatar href={avatarUrl}
                    alt={memberName}
                    width={45}
                    height={45}
                    isRound
            />

            <div className={classes.info}>
                <div className={classes.name}>
                    <span>{memberName}</span>

                    <span className={cx({'indicator': true, 'online': onlineUsers.includes(memberId)})}
                          title={onlineUsers.includes(memberId) ? 'Online' : `Был в сети: ${member?.date_last_active}`}
                    />
                </div>

                <div className={classes.text}>{props.messenger.messages[0].text}</div>
            </div>

            <div className={classes.meta}>
                <span>{props.messenger.messages[0].date_created}</span>

                {isNew && <div className={classes.indicator}/>}
            </div>
        </div>
    )
}

MessengerItem.defaultProps = defaultProps
MessengerItem.displayName = 'MessengerItem'

export default MessengerItem
