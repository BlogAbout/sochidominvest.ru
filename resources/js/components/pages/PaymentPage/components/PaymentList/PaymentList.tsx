import React, {useEffect, useState} from 'react'
import {ITransaction} from '../../../../../@types/ITransaction'
import {useTypedSelector} from '../../../../../hooks/useTypedSelector'
import {useActions} from '../../../../../hooks/useActions'
import {getPaymentStatusText} from '../../../../../helpers/paymentHelper'
import {allowForRole} from '../../../../../helpers/accessHelper'
import {numberWithSpaces, round} from '../../../../../helpers/numberHelper'
import TransactionService from '../../../../../api/TransactionService'
import ListHead from '../../../../ui/List/components/ListHead/ListHead'
import ListCell from '../../../../ui/List/components/ListCell/ListCell'
import ListBody from '../../../../ui/List/components/ListBody/ListBody'
import ListRow from '../../../../ui/List/components/ListRow/ListRow'
import List from '../../../../ui/List/List'
import Empty from '../../../../ui/Empty/Empty'
import openPopupAlert from '../../../../popup/PopupAlert/PopupAlert'
import openContextMenu from '../../../../ui/ContextMenu/ContextMenu'
import openPopupPaymentCreate from '../../../../../components/popup/PopupPaymentCreate/PopupPaymentCreate'
import classes from './PaymentList.module.scss'

interface Props {
    list: ITransaction[]
    fetching: boolean

    onSave(): void
}

const defaultProps: Props = {
    list: [],
    fetching: false,
    onSave: () => {
        console.info('DocumentList onSave')
    }
}

const PaymentList: React.FC<Props> = (props): React.ReactElement => {
    const [fetching, setFetching] = useState(props.fetching)

    const {users} = useTypedSelector(state => state.userReducer)
    const {fetchUserList} = useActions()

    useEffect(() => {
        if (!users || !users.length) {
            fetchUserList({active: [0, 1]})
        }
    }, [])

    // Редактирование платежа
    const onEditHandler = (payment: ITransaction) => {
        openPopupPaymentCreate(document.body, {
            payment: payment,
            onSave: () => props.onSave()
        })
    }

    // Копирование платежа
    const onCopyHandler = (payment: ITransaction) => {
        const newPayment: ITransaction = {
            id: null,
            name: payment.name,
            status: 'new',
            user_id: payment.user_id,
            user: payment.user,
            email: payment.email,
            cost: payment.cost,
            duration: payment.duration,
            object_id: payment.object_id,
            object_type: payment.object_type
        }

        openPopupPaymentCreate(document.body, {
            payment: newPayment,
            onSave: () => props.onSave()
        })
    }

    // Переход по ссылке на платежную форму
    const onOpenLinkHandler = (payment: ITransaction) => {
        if (payment.id) {
            // setFetching(true)
            //
            // TransactionService.fetchLinkPayment(payment.id)
            //     .then((response: any) => {
            //         if (response.data.data.status) {
            //             window.location.href = response.data.data
            //         } else {
            //             openPopupAlert(document.body, {
            //                 title: 'Ошибка!',
            //                 text: response.data.data
            //             })
            //         }
            //     })
            //     .catch((error: any) => {
            //         openPopupAlert(document.body, {
            //             title: 'Ошибка!',
            //             text: error.data.data
            //         })
            //     })
            //     .finally(() => {
            //         setFetching(false)
            //     })
        }
    }

    // Отправка ссылки на платежную форму плательщику на почту
    const onSendLinkHandler = (payment: ITransaction) => {
        setFetching(true)

        TransactionService.savePayment(payment, true)
            .then(() => {
                openPopupAlert(document.body, {
                    title: 'Ссылка отправлена!',
                    text: 'Ссылка на форму оплаты успешно отправлена.'
                })
            })
            .catch((error: any) => {
                openPopupAlert(document.body, {
                    title: 'Ошибка!',
                    text: error.data.data
                })
            })
            .finally(() => setFetching(false))
    }

    // Контекстное меню на платеже
    const onContextMenuHandler = (payment: ITransaction, e: React.MouseEvent) => {
        e.preventDefault()

        if (allowForRole(['director', 'administrator', 'manager'])) {
            const menuItems = []

            if (!payment.paid_at) {
                menuItems.push({text: 'Перейти к оплате', onClick: () => onOpenLinkHandler(payment)})
                menuItems.push({text: 'Отправить ссылку', onClick: () => onSendLinkHandler(payment)})
            }

            menuItems.push({text: 'Копировать', onClick: () => onCopyHandler(payment)})
            menuItems.push({text: 'Редактировать', onClick: () => onEditHandler(payment)})

            openContextMenu(e, menuItems)
        }
    }

    return (
        <List className={classes.PaymentList}>
            <ListHead>
                <ListCell className={classes.id}>#</ListCell>
                <ListCell className={classes.name}>Название</ListCell>
                <ListCell className={classes.userName}>Имя пользователя</ListCell>
                <ListCell className={classes.cost}>Сумма, руб.</ListCell>
                <ListCell className={classes.status}>Статус</ListCell>
                <ListCell className={classes.dateCreated}>Дата создания</ListCell>
            </ListHead>

            <ListBody fetching={props.fetching || fetching}>
                {props.list && props.list.length ?
                    props.list.map((payment: ITransaction) => {
                        return (
                            <ListRow key={payment.id}
                                     onContextMenu={(e: React.MouseEvent) => onContextMenuHandler(payment, e)}
                                     onClick={() => {
                                     }}
                            >
                                <ListCell className={classes.id}>{payment.id}</ListCell>
                                <ListCell className={classes.name}>{payment.name}</ListCell>
                                <ListCell className={classes.userName}>
                                    {payment.user ? payment.user.name : ''}
                                </ListCell>
                                <ListCell className={classes.cost}>
                                    {numberWithSpaces(round(payment.cost || 0, 0))}
                                </ListCell>
                                <ListCell className={classes.status}>{getPaymentStatusText(payment.status)}</ListCell>
                                <ListCell className={classes.dateCreated}>{payment.date_created}</ListCell>
                            </ListRow>
                        )
                    })
                    : <Empty message='Нет платежей и транзакций'/>
                }
            </ListBody>
        </List>
    )
}

PaymentList.defaultProps = defaultProps
PaymentList.displayName = 'PaymentList'

export default React.memo(PaymentList)
