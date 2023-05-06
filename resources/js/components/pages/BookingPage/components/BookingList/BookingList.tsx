import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {RouteNames} from '../../../../../helpers/routerHelper'
import {IBooking} from '../../../../../@types/IBooking'
import {IBusinessProcess} from '../../../../../@types/IBusinessProcess'
import {getBookingStatusText} from '../../../../../helpers/bookingHelper'
import {checkRules, Rules} from '../../../../../helpers/accessHelper'
import {getFormatDate} from '../../../../../helpers/dateHelper'
import BookingService from '../../../../../api/BookingService'
import ListHead from '../../../../ui/List/components/ListHead/ListHead'
import ListCell from '../../../../ui/List/components/ListCell/ListCell'
import ListBody from '../../../../ui/List/components/ListBody/ListBody'
import ListRow from '../../../../ui/List/components/ListRow/ListRow'
import List from '../../../../ui/List/List'
import Empty from '../../../../ui/Empty/Empty'
import openPopupAlert from '../../../../popup/PopupAlert/PopupAlert'
import openContextMenu from '../../../../ui/ContextMenu/ContextMenu'
import openPopupBookingInfo from '../../../../../components/popup/PopupBookingInfo/PopupBookingInfo'
import openPopupBookingCreate from '../../../../../components/popup/PopupBookingCreate/PopupBookingCreate'
import openPopupBusinessProcessCreate
    from '../../../../../components/popup/PopupBusinessProcessCreate/PopupBusinessProcessCreate'
import classes from './BookingList.module.scss'

interface Props {
    list: IBooking[]
    fetching: boolean

    onSave(): void
}

const defaultProps: Props = {
    list: [],
    fetching: false,
    onSave: () => {
        console.info('BusinessProcessList onSave')
    }
}

const BookingList: React.FC<Props> = (props): React.ReactElement => {
    const navigate = useNavigate()

    const [fetching, setFetching] = useState(props.fetching)

    // Отправка заявки в обработку
    const onProcessHandler = (booking: IBooking): void => {
        if (!booking.id) {
            return
        }

        const businessProcess: IBusinessProcess = {
            id: null,
            name: `Бронь #${booking.id}: ${booking.buildingName}`,
            description: `Бронь на аренду недвижимости ${booking.buildingName} с ${getFormatDate(booking.dateStart, 'date')} по ${getFormatDate(booking.dateFinish, 'date')}`,
            type: 'booking',
            step: 'default',
            relations: [
                {object_id: booking.id, object_type: 'booking'}
            ]
        }

        openPopupBusinessProcessCreate(document.body, {
            businessProcess: businessProcess,
            onSave: () => {
                navigate(RouteNames.P_BP)
            }
        })
    }

    const onEditHandler = (booking: IBooking): void => {
        openPopupBookingCreate(document.body, {
            booking: booking,
            onSave: () => props.onSave()
        })
    }

    const onRemoveHandler = (booking: IBooking): void => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить бронь для ${booking.buildingName} на ${getFormatDate(booking.dateStart)} - ${getFormatDate(booking.dateFinish)}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        booking.status = 'remove'

                        setFetching(true)

                        BookingService.saveBooking(booking)
                            .then(() => props.onSave())
                            .catch((error: any) => {
                                openPopupAlert(document.body, {
                                    title: 'Ошибка!',
                                    text: error.data.message
                                })
                            })
                            .finally(() => setFetching(false))
                    }
                },
                {text: 'Отмена'}
            ]
        })
    }

    const onContextMenuHandler = (booking: IBooking, e: React.MouseEvent): void => {
        e.preventDefault()

        const menuItems: any[] = []

        if (checkRules([Rules.RUN_BUSINESS_PROCESS])) {
            menuItems.push({text: 'Взять в обработку', onClick: () => onProcessHandler(booking)})
        }

        if (checkRules([Rules.EDIT_BOOKING])) {
            menuItems.push({text: 'Редактировать', onClick: () => onEditHandler(booking)})
        }

        if (checkRules([Rules.REMOVE_BOOKING])) {
            menuItems.push({text: 'Удалить', onClick: () => onRemoveHandler(booking)})
        }

        openContextMenu(e, menuItems)
    }

    return (
        <List className={classes.BookingList}>
            <ListHead>
                <ListCell className={classes.name}>Наименование объекта</ListCell>
                <ListCell className={classes.status}>Статус</ListCell>
                <ListCell className={classes.dateStart}>Дата заезда</ListCell>
                <ListCell className={classes.dateFinish}>Дата выезда</ListCell>
            </ListHead>

            <ListBody fetching={props.fetching || fetching}>
                {props.list && props.list.length ?
                    props.list.map((booking: IBooking) => {
                        return (
                            <ListRow key={booking.id}
                                     onContextMenu={(e: React.MouseEvent) => onContextMenuHandler(booking, e)}
                                     onClick={() => openPopupBookingInfo(document.body, {
                                         booking: booking
                                     })}
                            >
                                <ListCell className={classes.name}>{booking.buildingName}</ListCell>
                                <ListCell className={classes.status}>{getBookingStatusText(booking.status)}</ListCell>
                                <ListCell
                                    className={classes.dateStart}>{getFormatDate(booking.dateStart, 'date')}</ListCell>
                                <ListCell
                                    className={classes.dateFinish}>{getFormatDate(booking.dateFinish, 'date')}</ListCell>
                            </ListRow>
                        )
                    })
                    : <Empty message='Нет объектов бронирования'/>
                }
            </ListBody>
        </List>
    )
}

BookingList.defaultProps = defaultProps
BookingList.displayName = 'BookingList'

export default React.memo(BookingList)
