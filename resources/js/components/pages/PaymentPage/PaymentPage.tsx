import React, {useEffect, useMemo, useState} from 'react'
import {IFilter, IFilterContent} from '../../../@types/IFilter'
import {ITransaction} from '../../../@types/ITransaction'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {compareText} from '../../../helpers/filterHelper'
import {allowForTariff} from '../../../helpers/accessHelper'
import {paymentStatuses} from '../../../helpers/paymentHelper'
import TransactionService from '../../../api/TransactionService'
import Title from '../../ui/Title/Title'
import Wrapper from '../../ui/Wrapper/Wrapper'
import PanelView from '../../views/PanelView/PanelView'
import SidebarLeft from '../../../components/ui/SidebarLeft/SidebarLeft'
import PaymentList from './components/PaymentList/PaymentList'
import openPopupPaymentCreate from '../../../components/popup/PopupPaymentCreate/PopupPaymentCreate'
import openContextMenu from '../../ui/ContextMenu/ContextMenu'
import classes from './PaymentPage.module.scss'

const PaymentPage: React.FC = (): React.ReactElement => {
    const [fetching, setFetching] = useState(false)
    const [payments, setPayments] = useState<ITransaction[]>([])
    const [searchText, setSearchText] = useState('')
    const [filterPayment, setFilterPayment] = useState<ITransaction[]>([])
    const [isShowFilter, setIsShowFilter] = useState(false)
    const [filters, setFilters] = useState({
        status: ['new', 'pending', 'paid', 'cancel', 'complete']
    })

    const {user} = useTypedSelector(state => state.userReducer)

    useEffect(() => {
        fetchPaymentsHandler()
    }, [])

    useEffect(() => {
        search(searchText)
    }, [payments, filters])

    const fetchPaymentsHandler = () => {
        setFetching(true)

        const filter: IFilter = {} as IFilter

        // if (user && user.id && user.role === 'subscriber' && allowForTariff(['base', 'business', 'effectivePlus'], user.tariff)) {
        //     filter.userId = [user.id]
        // }

        TransactionService.fetchPayments(filter)
            .then((response: any) => setPayments(response.data.data))
            .catch((error: any) => {
                console.error('Произошла ошибка загрузки данных', error)
            })
            .finally(() => setFetching(false))
    }

    // Обработчик изменений
    const onSaveHandler = () => {
        fetchPaymentsHandler()
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (!payments || !payments.length) {
            setFilterPayment([])
        }

        if (value !== '') {
            setFilterPayment(filterItemsHandler(payments.filter((payment: ITransaction) => {
                return compareText(payment.name, value)
            })))
        } else {
            setFilterPayment(filterItemsHandler(payments))
        }
    }

    const onAddHandler = (type: 'createOrder') => {
        openPopupPaymentCreate(document.body, {
            onSave: () => onSaveHandler()
        })
    }

    // Фильтрация элементов на основе установленных фильтров
    const filterItemsHandler = (list: ITransaction[]) => {
        if (!list || !list.length) {
            return []
        }

        return list.filter((item: ITransaction) => {
            return filters.status.includes(item.status)
        })
    }

    // Меню выбора создания платежа
    const onContextMenu = (e: React.MouseEvent) => {
        e.preventDefault()

        const menuItems = [
            {text: 'Выставить счёт', onClick: () => onAddHandler('createOrder')}
        ]

        openContextMenu(e.currentTarget, menuItems)
    }

    const filtersContent: IFilterContent[] = []
    // const filtersContent: IFilterContent[] = useMemo(() => {
    //     return [
    //         {
    //             title: 'Статус',
    //             type: 'checker',
    //             multi: true,
    //             items: paymentStatuses,
    //             selected: filters.status,
    //             onSelect: (values: string[]) => {
    //                 setFilters({...filters, status: values})
    //             }
    //         }
    //     ]
    // }, [filters])

    return (
        <PanelView pageTitle='Платежи и транзакции'>
            <SidebarLeft filters={filtersContent}
                         isShow={isShowFilter}
                         onChangeShow={(isShow: boolean) => setIsShowFilter(isShow)}
            />

            <Wrapper isFull>
                <Title type='h1'
                       onAdd={onContextMenu.bind(this)}
                       onFilter={() => setIsShowFilter(!isShowFilter)}
                       searchText={searchText}
                       onSearch={search.bind(this)}
                       className={classes.title}
                >Платежи и транзакции</Title>

                <PaymentList list={filterPayment} fetching={fetching} onSave={() => fetchPaymentsHandler()}/>
            </Wrapper>
        </PanelView>
    )
}

PaymentPage.displayName = 'PaymentPage'

export default React.memo(PaymentPage)
