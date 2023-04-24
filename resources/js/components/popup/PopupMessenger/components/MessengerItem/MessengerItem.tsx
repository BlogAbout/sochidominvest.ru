import React from 'react'
import classNames from 'classnames/bind'
import {useTypedSelector} from '../../../../../hooks/useTypedSelector'
import {getFormatDate} from '../../../../../helpers/dateHelper'
import {findUser, getUserAvatar, getUserName} from '../../../../../helpers/userHelper'
import {findMembersIds, isNewMessage} from '../../../../../helpers/messengerHelper'
import {IMessenger} from '../../../../../@types/IMessenger'
import {IUser} from '../../../../../@types/IUser'
import Avatar from '../../../../ui/Avatar/Avatar'
import classes from './MessengerItem.module.scss'

interface Props {
    messenger: IMessenger
    users: IUser[]
    userId: number

    onClick(): void
}

const defaultProps: Props = {
    messenger: {} as IMessenger,
    users: [],
    userId: 0,
    onClick: () => {
        console.info('MessengerItem onClick')
    }
}

const cx = classNames.bind(classes)

const MessengerItem: React.FC<Props> = (props) => {
    const memberId: number = findMembersIds(props.messenger.members).find((id: number) => id !== props.userId) || 0
    const member = findUser(props.users, memberId)
    const avatarUrl = getUserAvatar(props.users, memberId)
    const memberName = getUserName(props.users, props.userId === props.messenger.author_id ? memberId : props.messenger.author_id)
    const isNew = isNewMessage(props.userId, props.messenger.members, props.messenger.messages[0])

    const {usersOnline} = useTypedSelector(state => state.userReducer)

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

                    <span className={cx({'indicator': true, 'online': usersOnline.includes(memberId)})}
                          title={usersOnline.includes(memberId) ? 'Online' : `Был в сети: ${member?.date_last_active}`}
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
