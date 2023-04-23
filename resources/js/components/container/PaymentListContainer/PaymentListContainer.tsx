import React from 'react'
import {ITransaction} from '../../../@types/ITransaction'
import Empty from '../../ui/Empty/Empty'
import PaymentList from './components/PaymentList/PaymentList'
import classes from './PaymentListContainer.module.scss'

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
        console.info('PaymentListContainer onClick', payment)
    },
    onEdit: (payment: ITransaction) => {
        console.info('PaymentListContainer onEdit', payment)
    },
    onContextMenu: (e: React.MouseEvent, payment: ITransaction) => {
        console.info('PaymentListContainer onContextMenu', e, payment)
    }
}

const PaymentListContainer: React.FC<Props> = (props) => {
    return (
        <div className={classes.PaymentListContainer}>
            {props.payments.length ?
                <PaymentList payments={props.payments}
                             fetching={props.fetching}
                             onClick={props.onClick}
                             onEdit={props.onEdit}
                             onContextMenu={props.onContextMenu}
                />
                : <Empty message='Нет платежей и транзакций'/>
            }
        </div>
    )
}

PaymentListContainer.defaultProps = defaultProps
PaymentListContainer.displayName = 'PaymentListContainer'

export default PaymentListContainer
