import React, {useState} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {INotification} from '../../../../../@types/INotification'
import openPopupSupportInfo from '../../../../popup/PopupSupportInfo/PopupSupportInfo'
import openPopupBookingInfo from '../../../../popup/PopupBookingInfo/PopupBookingInfo'
import classes from './NotificationItem.module.scss'

interface Props {
    notification: INotification

    readMessage(notification: INotification): void

    removeMessage(notification: INotification): void
}

const defaultProps: Props = {
    notification: {} as INotification,
    readMessage: (notification: INotification) => {
        console.info('NotificationItem readMessage', notification)
    },
    removeMessage: (notification: INotification) => {
        console.info('NotificationItem removeMessage', notification)
    }
}

const NotificationItem: React.FC<Props> = (props) => {
    const [showFull, setShowFull] = useState(false)

    const getTitle = () => {
        let onClick = undefined

        switch (props.notification.objectType) {
            case 'feed':
                onClick = () => {
                    openPopupSupportInfo(document.body, {
                        feedId: props.notification.objectId || 0,
                        onSave: () => {
                        }
                    })
                }
                break
            case 'booking':
                onClick = () => {
                    openPopupBookingInfo(document.body, {
                        bookingId: props.notification.objectId || 0
                    })
                }
                break
        }

        if (onClick) {
            return <span onClick={onClick}>{props.notification.name}</span>
        } else {
            return props.notification.name
        }
    }

    return (
        <div>
            <div key={props.notification.id} className={classes.item}>
                <div className={classes.row}>
                    <div className={classes.date}>{props.notification.dateCreated}</div>

                    {props.notification.status === 'new' ?
                        <div className={classes.btn}
                             onClick={() => props.readMessage(props.notification)}
                             title='Отметить как прочитанное'
                        >
                            <FontAwesomeIcon icon='envelope'/>
                        </div>
                        : null
                    }

                    <div className={classes.btn}
                         onClick={() => props.removeMessage(props.notification)}
                         title='Удалить'
                    >
                        <FontAwesomeIcon icon='trash'/>
                    </div>
                </div>

                <div className={classes.title}>{getTitle()}</div>

                {props.notification.description ?
                    <div className={classes.description}>
                        {showFull
                            ? props.notification.description
                            : props.notification.description.substring(0, 30)
                        }

                        {!showFull && props.notification.description.length > 30 ?
                            <span className={classes.showMore}
                                  onClick={() => setShowFull(true)}
                            >[...]</span>
                            : null
                        }
                    </div>
                    : null
                }
            </div>
        </div>
    )
}

NotificationItem.defaultProps = defaultProps
NotificationItem.displayName = 'NotificationItem'

export default NotificationItem
