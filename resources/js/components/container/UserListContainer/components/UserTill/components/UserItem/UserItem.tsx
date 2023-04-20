import React from 'react'
import classNames from 'classnames/bind'
import {useTypedSelector} from '../../../../../../../hooks/useTypedSelector'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {IUser} from '../../../../../../../@types/IUser'
import Indicator from '../../../../../../ui/Indicator/Indicator'
import Avatar from '../../../../../../ui/Avatar/Avatar'
import classes from './UserItem.module.scss'

interface Props {
    user: IUser

    onClick(user: IUser): void

    onEdit(user: IUser): void

    onRemove(user: IUser): void

    onBlocking(user: IUser): void

    onContextMenu(e: React.MouseEvent, user: IUser): void
}

const defaultProps: Props = {
    user: {} as IUser,
    onClick: (user: IUser) => {
        console.info('UserItem onClick', user)
    },
    onEdit: (user: IUser) => {
        console.info('UserItem onEdit', user)
    },
    onRemove: (user: IUser) => {
        console.info('UserItem onRemove', user)
    },
    onBlocking: (user: IUser) => {
        console.info('UserItem onBlocking', user)
    },
    onContextMenu: (e: React.MouseEvent, user: IUser) => {
        console.info('UserItem onContextMenu', e, user)
    }
}

const cx = classNames.bind(classes)

const UserItem: React.FC<Props> = (props) => {
    const {usersOnline} = useTypedSelector(state => state.userReducer)

    return (
        <div className={cx({'UserItem': true, 'block': props.user.is_block})}
             onClick={() => props.onClick(props.user)}
             onContextMenu={(e: React.MouseEvent) => props.onContextMenu(e, props.user)}
        >
            <Avatar href={props.user.avatar ? props.user.avatar.content : null} alt={props.user.name} width={150}
                    height={150}/>

            <div className={classes.itemContent}>
                <h2>
                    <Indicator color={props.user.id && usersOnline.includes(props.user.id) ? 'green' : 'red'}
                               text={props.user.id && usersOnline.includes(props.user.id) ? 'Online' : `Был в сети: ${props.user.date_last_active}`}
                    />
                    <span>{props.user.name}</span>
                </h2>

                <div className={classes.row} title='Роль'>
                    <FontAwesomeIcon icon='user-check'/>
                    <span>{props.user.role ? props.user.role.name : ''}</span>
                </div>

                <div className={classes.row} title='Должность'>
                    <FontAwesomeIcon icon='id-card'/>
                    <span>{props.user.post ? props.user.post.name : '-'}</span>
                </div>

                <div className={classes.row} title='E-mail'>
                    <FontAwesomeIcon icon='message'/>
                    <span>{props.user.email}</span>
                </div>

                <div className={classes.row} title='Телефон'>
                    <FontAwesomeIcon icon='phone'/>
                    <span>{props.user.phone}</span>
                </div>
            </div>
        </div>
    )
}

UserItem.defaultProps = defaultProps
UserItem.displayName = 'UserItem'

export default UserItem
