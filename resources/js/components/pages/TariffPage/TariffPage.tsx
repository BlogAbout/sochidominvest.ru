import React, {useEffect} from 'react'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import {numberWithSpaces} from '../../../helpers/numberHelper'
import {IUser} from '../../../@types/IUser'
import {ITariff} from '../../../@types/ITariff'
import Title from '../../ui/Title/Title'
import Wrapper from '../../ui/Wrapper/Wrapper'
import PanelView from '../../views/PanelView/PanelView'
import openPopupAlert from '../../popup/PopupAlert/PopupAlert'
import openPopupBuyTariff from '../../../components/popup/PopupBuyTariff/PopupBuyTariff'
import Button from '../../form/Button/Button'
import BlockingElement from '../../../components/ui/BlockingElement/BlockingElement'
import classes from './TariffPage.module.scss'

const TariffPage: React.FC = (): React.ReactElement => {
    const {user} = useTypedSelector(state => state.userReducer)
    const {tariffs, fetching} = useTypedSelector(state => state.tariffReducer)

    const {setUser, fetchTariffList} = useActions()

    useEffect(() => {
        if (!tariffs.length) {
            fetchTariffList()
        }
    })

    const onBuyTariffHandler = (tariff: ITariff): void => {
        if (!tariff.id || user.tariff_id === tariff.id) {
            return
        }

        if (user.tariff_id && user.tariff_id > tariff.id) {
            openPopupAlert(document.body, {
                text: `
                    Вы собираетесь понизить тариф. Все данные, не соответствующие тарифу будут отключены.
                    Вы можете самостоятельно, отключить ненужные, оставив только те, которые будут соответствовать новому тарифу.
                    Либо это произойдет автоматически, оставив только последние.
                `,
                buttons: [
                    {
                        text: 'Продолжить',
                        onClick: () => {
                            openPopupBuyTariff(document.body, {
                                user: user,
                                tariff: tariff,
                                onSave: (user: IUser) => {
                                    setUser(user)
                                }
                            })
                        }
                    },
                    {text: 'Отмена'}
                ]
            })
        }

        openPopupBuyTariff(document.body, {
            user: user,
            tariff: tariff,
            onSave: (user: IUser) => {
                setUser(user)
            }
        })
    }

    return (
        <PanelView pageTitle='Тарифы'>
            <Wrapper isFull>
                <Title type='h1'
                       className={classes.title}
                >Тарифы</Title>

                <BlockingElement fetching={fetching} className={classes.list}>
                    {tariffs && tariffs.length ?
                        tariffs.map((tariff: ITariff) => {
                            return (
                                <div key={tariff.id} className={classes.item}>
                                    <div className={classes.head}>
                                        <h3>{tariff.name}</h3>
                                        <div className={classes.cost}>{numberWithSpaces(tariff.cost)} руб.</div>
                                    </div>

                                    <div className={classes.advanced}>
                                        <ul>{tariff.privileges.map((privilege: string, index: number) => {
                                            return <li key={index}>{privilege}</li>
                                        })}</ul>
                                    </div>

                                    <div className={classes.buttons}>
                                        <Button type='save'
                                                onClick={() => onBuyTariffHandler(tariff)}
                                                title={user.tariff_id === tariff.id ? 'Продлить' : 'Выбрать'}
                                        >{user.tariff_id === tariff.id ? 'Продлить' : 'Выбрать'}</Button>
                                    </div>
                                </div>
                            )
                        })
                        : null
                    }
                </BlockingElement>
            </Wrapper>
        </PanelView>
    )
}

TariffPage.displayName = 'TariffPage'

export default React.memo(TariffPage)
