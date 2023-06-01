import React from 'react'
import classNames from 'classnames/bind'
import {useTypedSelector} from '../../../../../hooks/useTypedSelector'
import {IUser} from '../../../../../@types/IUser'
import Avatar from '../../../../ui/Avatar/Avatar'
import classes from './UserItem.module.scss'

interface Props {
    user: IUser
    onClick: () => void
}

const defaultProps: Props = {
    user: {} as IUser,
    onClick: () => {
        console.info('UserItem onClick')
    }
}

const cx = classNames.bind(classes)

const UserItem: React.FC<Props> = (props) => {
    const {onlineUsers} = useTypedSelector(state => state.messengerReducer)

    return (
        <div className={classes.UserItem} onClick={props.onClick}>
            <Avatar href={props.user.avatar ? props.user.avatar.content : ''}
                    alt={props.user.name}
                    width={70}
                    height={70}
            />

            <div className={classes.name}>{props.user.name}</div>

            <div className={classes.post}>{props.user.post ? props.user.post.name : '-'}</div>

            <div className={cx({'status': true, 'online': props.user.id && onlineUsers.includes(props.user.id)})}
                 title={props.user.id && onlineUsers.includes(props.user.id)
                     ? 'Online'
                     : `Был в сети: ${props.user.date_last_active}`
                 }
            >
                {props.user.id && onlineUsers.includes(props.user.id)
                    ? 'Online'
                    : 'Offline'
                }
            </div>
        </div>
    )
}

UserItem.defaultProps = defaultProps
UserItem.displayName = 'UserItem'

export default UserItem
