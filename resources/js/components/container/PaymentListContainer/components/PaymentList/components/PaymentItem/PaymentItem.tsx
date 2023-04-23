import React from 'react'
import classNames from 'classnames/bind'
import {useTypedSelector} from '../../../../../../../hooks/useTypedSelector'
import {ITransaction} from '../../../../../../../@types/ITransaction'
import {getUserName} from '../../../../../../../helpers/userHelper'
import {getPaymentStatusText} from '../../../../../../../helpers/paymentHelper'
import {getFormatDate} from '../../../../../../../helpers/dateHelper'
import {numberWithSpaces, round} from '../../../../../../../helpers/numberHelper'
import classes from './PaymentItem.module.scss'

interface Props {
    payment: ITransaction

    onClick(payment: ITransaction): void

    onEdit(payment: ITransaction): void

    onContextMenu(e: React.MouseEvent, payment: ITransaction): void
}

const defaultProps: Props = {
    payment: {} as ITransaction,
    onClick: (payment: ITransaction) => {
        console.info('PaymentItem onClick', payment)
    },
    onEdit: (payment: ITransaction) => {
        console.info('PaymentItem onEdit', payment)
    },
    onContextMenu: (e: React.MouseEvent, payment: ITransaction) => {
        console.info('PaymentItem onContextMenu', e, payment)
    }
}

const cx = classNames.bind(classes)

const PaymentItem: React.FC<Props> = (props) => {
    const {users} = useTypedSelector(state => state.userReducer)

    return (
        <div className={cx({'PaymentItem': true, [props.payment.status]: true})}
             onClick={() => props.onClick(props.payment)}
             onContextMenu={(e: React.MouseEvent) => props.onContextMenu(e, props.payment)}
        >
            <div className={classes.id}>{props.payment.id}</div>
            <div className={classes.name}>{props.payment.name}</div>
            <div className={classes.userName}>{props.payment.userName || getUserName(users, props.payment.userId)}</div>
            <div className={classes.cost}>{numberWithSpaces(round(props.payment.cost || 0, 0))}</div>
            <div className={classes.status}>{getPaymentStatusText(props.payment.status)}</div>
            <div className={classes.dateCreated}>{props.payment.date_created}</div>
        </div>
    )
}

PaymentItem.defaultProps = defaultProps
PaymentItem.displayName = 'PaymentItem'

export default PaymentItem
