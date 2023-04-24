import React, {useEffect, useState} from 'react'
import moment from 'moment'
import withStore from '../../hoc/withStore'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {IUser} from '../../../@types/IUser'
import {ISelector} from '../../../@types/ISelector'
import {getTariffText, tariffs} from '../../../helpers/tariffHelper'
import {ITariff} from '../../../@types/ITariff'
import UserService from '../../../api/UserService'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import {numberWithSpaces} from '../../../helpers/numberHelper'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import Button from '../../form/Button/Button'
import Title from '../../ui/Title/Title'
import Label from '../../form/Label/Label'
import ComboBox from '../../form/ComboBox/ComboBox'
import NumberBox from '../../form/NumberBox/NumberBox'
import openPopupAlert from '../PopupAlert/PopupAlert'
import classes from './PopupBuyTariff.module.scss'
import {ITransaction} from "../../../@types/ITransaction";
import TransactionService from "../../../api/TransactionService";

interface Props extends PopupProps {
    user: IUser
    tariff: ITariff

    onSave(user: IUser): void
}

const defaultProps: Props = {
    user: {} as IUser,
    tariff: {} as ITariff,
    onSave: (user: IUser) => {
        console.info('PopupBuyTariff onSave', user)
    }
}

const PopupBuyTariff: React.FC<Props> = (props) => {
    const [user, setUser] = useState<IUser>(props.user || {
        id: null,
        name: '',
        email: '',
        phone: '',
        password: '',
        is_active: 1
    })
    const [currentTariff, setCurrentTariff] = useState(props.tariff.id || 'base')
    const [months, setMonths] = useState(1)
    const [total, setTotal] = useState(0)

    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [props.blockId])

    useEffect(() => {
        const findTariff = tariffs.find((tariff: ITariff) => tariff.id === currentTariff)

        if (findTariff) {
            setTotal(findTariff.cost * months)
        }
    }, [currentTariff, months])

    // Закрытие popup
    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    // Сохранение изменений
    const saveHandler = () => {
        if (!user.id) {
            return
        }

        setFetching(true)

        const findTariff = tariffs.find((tariff: ITariff) => tariff.id === currentTariff)

        if (!findTariff) {
            return
        }

        const payment: ITransaction = {
            id: null,
            name: `Оплата тарифа ${findTariff.name}. Месяцев: ${months}`,
            status: 'new',
            user_id: user.id,
            cost: total,
            duration: `P${months}M`,
            object_id: 0, //Todo: findTariff.object_id,
            object_type: 'tariff'
        }

        TransactionService.savePayment(payment, false)
            .then((response: any) => {
                // TransactionService.fetchLinkPayment(response.data.data.id)
                //     .then((response: any) => {
                //         if (response.data.data.status) {
                //             window.location.href = response.data.data
                //         } else {
                //             openPopupAlert(document.body, {
                //                 title: 'Ошибка!',
                //                 text: response.data.data
                //             })
                //         }
                //
                //         setFetching(false)
                //     })
                //     .catch((error: any) => {
                //         openPopupAlert(document.body, {
                //             title: 'Ошибка!',
                //             text: error.data.data
                //         })
                //
                //         setFetching(false)
                //     })
            })
            .catch((error: any) => {
                openPopupAlert(document.body, {
                    title: 'Ошибка!',
                    text: error.data.data
                })

                setFetching(false)
            })
    }

    const getTariffsList = () => {
        // const tariffsList: ISelector[] = tariffs.map((tariff: ITariff) => {
        //     return {
        //         key: tariff.id,
        //         text: tariff.name + ' (' + numberWithSpaces(tariff.cost) + ' руб.'
        //     }
        // })

        return []
    }

    return (
        <Popup className={classes.PopupBuyTariff}>
            <BlockingElement fetching={fetching} className={classes.content}>
                <div key='content' className={classes.blockContent}>
                    <Title type='h2'>Оплата тарифа</Title>

                    <div className={classes.field}>
                        <Label text='Тариф'/>

                        <ComboBox selected={currentTariff}
                                  items={Object.values(getTariffsList())}
                                  onSelect={(value: string) => setCurrentTariff(value)}
                                  placeHolder='Выберите тариф'
                                  styleType='minimal'
                        />
                    </div>

                    <div className={classes.field}>
                        <Label text='Количество месяцев'/>

                        <NumberBox value={months || ''}
                                   min={1}
                                   step={1}
                                   max={99}
                                   onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setMonths(value)}
                                   placeHolder='Укажите количество месяцев'
                                   styleType='minimal'
                        />
                    </div>

                    <div className={classes.field}>
                        <Label text='Итого'/>

                        <NumberBox value={total || ''}
                                   min={0}
                                   step={1}
                                   max={99999999999}
                                   onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setTotal(value)}
                                   placeHolder='Итоговая сумма к оплате'
                                   styleType='minimal'
                                   readOnly
                        />
                    </div>
                </div>
            </BlockingElement>

            <Footer>
                <Button type='save'
                        icon='check-double'
                        onClick={() => saveHandler()}
                        // disabled={fetching || currentTariff.trim() === '' || months < 1 || months > 99}
                        title='Оплатить'
                >Оплатить</Button>

                <Button type='regular'
                        icon='arrow-rotate-left'
                        onClick={close.bind(this)}
                        className='marginLeft'
                        title='Отменить'
                >Отменить</Button>
            </Footer>
        </Popup>
    )
}

PopupBuyTariff.defaultProps = defaultProps
PopupBuyTariff.displayName = 'PopupBuyTariff'

export default function openPopupBuyTariff(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupBuyTariff), popupProps, undefined, block, displayOptions)
}
