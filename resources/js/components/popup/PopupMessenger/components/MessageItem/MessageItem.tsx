import React from 'react'
import classNames from 'classnames/bind'
import {isNewMessage} from '../../../../../helpers/messengerHelper'
import {IMessage, IMessenger} from '../../../../../@types/IMessenger'
import Avatar from '../../../../ui/Avatar/Avatar'
import classes from './MessageItem.module.scss'

interface Props {
    message: IMessage
    messenger: IMessenger | null
    userId: number
    memberId: number
}

const defaultProps: Props = {
    message: {} as IMessage,
    messenger: null,
    userId: 0,
    memberId: 0,
}

const cx = classNames.bind(classes)

const MessageItem: React.FC<Props> = (props) => {
    const isNewCurrent = isNewMessage(props.userId, props.messenger ? props.messenger.members : [], props.message)
    const isNewMember = isNewMessage(props.userId, props.messenger ? props.messenger.members : [], props.message)
    const right = props.message.author_id === props.userId

    return (
        <div className={cx({'MessageItem': true, 'right': right})}
             onContextMenu={() => {
                 // Todo: Доделать контекстное меню на сообщения (удалить, удалить у всех, цитировать, переслать, копировать)
             }}
        >
            <Avatar
                href={props.message.author && props.message.author.avatar ? props.message.author.avatar.content : ''}
                alt={props.message.author ? props.message.author.name : ''}
                width={35}
                height={35}
                isRound
            />

            <div className={classes.text}>
                {props.message.text}

                <div className={classes.date}>{props.message.date_created}</div>

                {(right && isNewCurrent) || isNewMember ?
                    <div className={classes.indicator}/>
                    : null}
            </div>
        </div>
    )
}

MessageItem.defaultProps = defaultProps
MessageItem.displayName = 'MessageItem'

export default MessageItem
