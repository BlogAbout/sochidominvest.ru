import React from 'react'
import PaymentItem from './components/PaymentItem/PaymentItem'
import BlockingElement from '../../../../ui/BlockingElement/BlockingElement'
import {ITransaction} from '../../../../../@types/ITransaction'
import classes from './PaymentList.module.scss'

interface Props {
    payments: ITransaction[]
    fetching: boolean

    onClick(payment: ITransaction): void

    onEdit(payment: ITransaction): void

    onContextMenu(e: React.MouseEvent, payment: ITransaction): void
}

const defaultProps: Props = {
    payments: [],
    fetching: false,
    onClick: (payment: ITransaction) => {
        console.info('DocumentList onClick', payment)
    },
    onEdit: (payment: ITransaction) => {
        console.info('DocumentList onEdit', payment)
    },
    onContextMenu: (e: React.MouseEvent, payment: ITransaction) => {
        console.info('DocumentList onContextMenu', e, payment)
    }
}

const PaymentList: React.FC<Props> = (props) => {
    return (
        <div className={classes.PaymentList}>
            <div className={classes.head}>
                <div className={classes.id}>#</div>
                <div className={classes.name}>Название</div>
                <div className={classes.userName}>Имя пользователя</div>
                <div className={classes.cost}>Сумма, руб.</div>
                <div className={classes.status}>Статус</div>
                <div className={classes.dateCreated}>Дата создания</div>
            </div>

            <BlockingElement fetching={props.fetching} className={classes.list}>
                {props.payments.map((payment: ITransaction) => {
                    return (
                        <PaymentItem key={payment.id}
                                     payment={payment}
                                     onClick={props.onClick}
                                     onEdit={props.onEdit}
                                     onContextMenu={props.onContextMenu}
                        />
                    )
                })}
            </BlockingElement>
        </div>
    )
}

PaymentList.defaultProps = defaultProps
PaymentList.displayName = 'PaymentList'

export default PaymentList
