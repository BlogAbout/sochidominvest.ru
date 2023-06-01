import React, {useEffect} from 'react'
import {useActions} from '../../../../../hooks/useActions'
import {useTypedSelector} from '../../../../../hooks/useTypedSelector'
import {IFilter} from '../../../../../@types/IFilter'
import {IMessage} from '../../../../../@types/IMessenger'
import Avatar from '../../../../ui/Avatar/Avatar'
import classes from './ToastMessage.module.scss'

interface Props {
    message: IMessage
}

const defaultProps: Props = {
    message: {} as IMessage
}

const ToastMessage: React.FC<Props> = (props) => {
    const {users} = useTypedSelector(state => state.userReducer)

    const {fetchUserList} = useActions()

    useEffect(() => {
        if (!users || !users.length) {
            fetchUserList({} as IFilter)
        }
    }, [])

    let text = props.message.text

    if (text.length > 53) {
        text = text.substring(0, 50) + '...'
    }

    const getMessageType = () => {
        switch (props.message.type) {
            case 'message':
                return 'Сообщение'
            case 'notification':
                return 'Уведомление'
            default:
                return ''
        }
    }

    return (
        <div className={classes.ToastMessage}>
            <Avatar
                href={props.message.author && props.message.author.avatar ? props.message.author.avatar.content : ''}
                alt={props.message.author ? props.message.author.name : ''}
                width={48}
                height={48}
                isRound
            />

            <div className={classes.content}>
                <div className={classes.meta}>{getMessageType()}</div>
                <div className={classes.name}>{props.message.author ? props.message.author.name : ''}</div>
                <div className={classes.text}>{text}</div>
            </div>
        </div>
    )
}

ToastMessage.defaultProps = defaultProps
ToastMessage.displayName = 'ToastMessage'

export default ToastMessage
