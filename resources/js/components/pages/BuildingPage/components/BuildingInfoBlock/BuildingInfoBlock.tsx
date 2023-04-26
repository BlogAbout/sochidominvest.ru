import React, {useEffect, useMemo, useState} from 'react'
import {PDFDownloadLink} from '@react-pdf/renderer'
import {useNavigate} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import classNames from 'classnames/bind'
import UserService from '../../../../../api/UserService'
import {useTypedSelector} from '../../../../../hooks/useTypedSelector'
import {RouteNames} from '../../../../../helpers/routerHelper'
import {IBuilding} from '../../../../../@types/IBuilding'
import {ITag} from '../../../../../@types/ITag'
import {IUser} from '../../../../../@types/IUser'
import {configuration} from '../../../../../helpers/utilHelper'
import {checkRules, Rules} from '../../../../../helpers/accessHelper'
import {declension} from '../../../../../helpers/stringHelper'
import {getDistrictText, getPassedText} from '../../../../../helpers/buildingHelper'
import {numberWithSpaces, round} from '../../../../../helpers/numberHelper'
import Title from '../../../../ui/Title/Title'
import Button from '../../../../form/Button/Button'
import PdfDocumentGenerator from '../../../../ui/PdfDocumentGenerator/PdfDocumentGenerator'
import openPopupPriceChart from '../../../../../components/popup/PopupPriceChart/PopupPriceChart'
import openPopupFeedCreate from '../../../../../components/popup/PopupFeedCreate/PopupFeedCreate'
import openPopupBookingCreate from '../../../../../components/popup/PopupBookingCreate/PopupBookingCreate'
import openPopupBuildingCreate from '../../../../../components/popup/PopupBuildingCreate/PopupBuildingCreate'
import openPopupSupportCreate from '../../../../../components/popup/PopupSupportCreate/PopupSupportCreate'
import openPopupAlert from '../../../../popup/PopupAlert/PopupAlert'
import openPopupCompilationSelector
    from '../../../../../components/popup/PopupCompilationSelector/PopupCompilationSelector'
import openPopupMap from '../../../../popup/PopupMap/PopupMap'
import classes from './BuildingInfoBlock.module.scss'

interface Props {
    building: IBuilding
    views: number
    isRent?: boolean

    onSave?(): void
}

const defaultProps: Props = {
    building: {} as IBuilding,
    views: 0,
    isRent: false
}

const cx = classNames.bind(classes)

const BuildingInfoBlock: React.FC<Props> = (props): React.ReactElement => {
    const navigate = useNavigate()

    const [userData, setUserData] = useState<IUser | null>(null)
    const [favorites, setFavorites] = useState<number[]>([])
    const [showCopyText, setShowCopyText] = useState(false)

    const {user} = useTypedSelector(state => state.userReducer)

    useEffect(() => {
        setUserData(user)
    }, [user])

    useEffect(() => {
        if (userData && userData.favorites && userData.favorites.length) {
            const ids: number[] = []

            userData.favorites.forEach((building: IBuilding) => {
                if (building.id) {
                    ids.push(building.id)
                }
            })

            setFavorites(ids)
        } else {
            setFavorites([])
        }
    }, [props.building, userData])

    // Вызов окна обратной связи
    const onFeedButtonHandler = (type: 'callback' | 'get-document' | 'get-presentation' | 'get-view'): void => {
        openPopupFeedCreate(document.body, {
            building: props.building,
            type: type
        })
    }

    // Редактирование объекта
    const onClickEditHandler = (): void => {
        openPopupBuildingCreate(document.body, {
            building: props.building,
            onSave: () => props.onSave ? props.onSave() : undefined
        })
    }

    // Добавление/удаление объекта в избранное
    const onChangeBuildingToFavorite = () => {
        if (props.building.id) {
            if (favorites.includes(props.building.id)) {
                setFavorites(favorites.filter((id: number) => id !== props.building.id))
            } else {
                setFavorites([...favorites, props.building.id])
            }

            const updateUser: IUser = JSON.parse(JSON.stringify(user))
            updateUser.favorite_ids = favorites

            UserService.saveUser(updateUser)
                .then((response: any) => setUserData(response.data.data))
                .catch((error: any) => {
                    console.error('Ошибка обновления избранного', error)

                    openPopupAlert(document.body, {
                        title: 'Ошибка!',
                        text: error.data.data
                    })
                })
        }
    }

    const passedInfo = useMemo(() => {
        return getPassedText(props.building.info.passed)
    }, [props.building])

    const districtText = useMemo(() => {
        return getDistrictText(props.building.info.district, props.building.info.district_zone)
    }, [props.building])

    // Вывод графика цен
    const renderDynamicChangePrices = (): React.ReactElement | null => {
        if (props.isRent || !props.building.cost || !props.building.prices || !props.building.prices.length) {
            return null
        }

        return (
            <div className={cx({'icon': true, 'link': true})}
                 title='График цен'
                 onClick={() => openPopupPriceChart(document.body, {prices: props.building.prices})}
            >
                <FontAwesomeIcon icon='chart-line'/>
            </div>
        )
    }

    // Вывод старой цены
    const renderOldPrice = (): React.ReactElement | null => {
        if (props.isRent || !props.building.prices || !props.building.prices.length || !props.building.cost) {
            return null
        }

        const costOld: number = props.building.prices[0]

        if (costOld > props.building.cost) {
            return (
                <span className={classes.costDown}
                      title={`Старая цена: ${numberWithSpaces(round(costOld, 0))} руб.`}
                >
                    <FontAwesomeIcon icon='arrow-down'/>
                </span>
            )
        } else {
            return (
                <span className={classes.costUp}
                      title={`Старая цена: ${numberWithSpaces(round(costOld, 0))} руб.`}
                >
                    <FontAwesomeIcon icon='arrow-up'/>
                </span>
            )
        }
    }

    const renderMetaInformation = (): React.ReactElement => {
        return (
            <div className={classes.information}>
                <div className={classes.icon} title={`Просмотры: ${props.views}`}>
                    <FontAwesomeIcon icon='eye'/>
                    <span>{props.views}</span>
                </div>

                <div className={classes.icon} title={`Дата публикации: ${props.building.date_created}`}>
                    <FontAwesomeIcon icon='calendar'/>
                    <span>{props.building.date_created}</span>
                </div>

                {props.building.author ?
                    <div className={classes.icon} title={`Автор: ${props.building.author.name}`}>
                        <FontAwesomeIcon icon='user'/>
                        <span>{props.building.author.name}</span>
                    </div>
                    : null}

                {renderDynamicChangePrices()}
            </div>
        )
    }

    const renderBuildingInfo = (): React.ReactElement => {
        return (
            <div className={classes.info}>
                {!props.isRent && props.building.type === 'building' ?
                    <div className={classes.row}>
                        <span>{props.building.checkers ? props.building.checkers.length : 0}</span>
                        <span>{declension(props.building.checkers ? props.building.checkers.length : 0, ['квартира', 'квартиры', 'квартир'], true)}</span>
                    </div>
                    : null
                }

                {!props.isRent ?
                    <div className={classes.row}>
                        {props.building.type === 'building' ?
                            <>
                                <span>{numberWithSpaces(round(props.building.cost_min_unit || 0, 0))} руб.</span>
                                <span>Мин. цена за м<sup>2</sup></span>
                            </>
                            : props.building.type === 'land' ?
                                <>
                                    <span>
                                        {numberWithSpaces(round(props.building.area && props.building.cost ? (props.building.cost / props.building.area) * 100 : 0, 0))} руб.
                                        {renderOldPrice()}
                                    </span>
                                    <span>Цена сотку</span>
                                </>
                                : <>
                                    <span>
                                        {numberWithSpaces(round(props.building.area && props.building.cost ? props.building.cost / props.building.area : 0, 0))} руб.
                                        {renderOldPrice()}
                                    </span>
                                    <span>Цена за м<sup>2</sup></span>
                                </>
                        }
                    </div>
                    : null
                }

                {!props.isRent ?
                    <div className={classes.row}>
                        {props.building.type === 'building' ?
                            <>
                                <span>{numberWithSpaces(round(props.building.cost_min || 0, 0))} руб.</span>
                                <span>Мин. цена</span>
                            </>
                            :
                            <>
                                <span>{numberWithSpaces(round(props.building.cost || 0, 0))} руб.</span>
                                <span>Цена</span>
                            </>
                        }
                    </div>
                    : null
                }

                {props.isRent && props.building.rentData ?
                    <div className={classes.row}>
                        <span>{numberWithSpaces(round(props.building.rentData.cost || 0, 0))} руб.{props.building.rentData.type === 'short' ? '/в сутки' : '/в месяц'}</span>
                        <span>Цена</span>
                    </div>
                    : null
                }

                <div className={classes.row}>
                    {props.building.type === 'building' ?
                        <>
                            <span>{props.building.area_min || 0} - {props.building.area_max || 0}</span>
                            <span>Площади, м<sup>2</sup></span>
                        </>
                        :
                        <>
                            <span>{props.building.area || 0}</span>
                            <span>Площадь, м<sup>2</sup></span>
                        </>
                    }
                </div>

                {props.building.type === 'land' && props.building.info.cadastral_cost ?
                    <div className={classes.row}>
                        <span>{numberWithSpaces(round(props.building.info.cadastral_cost || 0, 0))} руб.</span>
                        <span>Кадастровая стоимость</span>
                    </div>
                    : null
                }
            </div>
        )
    }

    const renderButtons = (): React.ReactElement => {
        return (
            <div className={classes.buttons}>
                {props.building.is_rent ?
                    <div className={classes.buttonRent}>
                        <Button type='apply'
                                icon='house-laptop'
                                onClick={() => {
                                    if (props.building.id) {
                                        openPopupBookingCreate(document.body, {
                                            buildingId: props.building.id,
                                            onSave: () => {
                                            }
                                        })
                                    }
                                }}
                                title='Арендовать'
                        >Арендовать</Button>
                    </div>
                    : null
                }

                <Button type='save'
                        onClick={() => onFeedButtonHandler('callback')}
                >Заказать обратный звонок</Button>

                <Button type='save'
                        onClick={() => onFeedButtonHandler('get-document')}
                >Запросить документы</Button>

                <Button type='save'
                        onClick={() => onFeedButtonHandler('get-presentation')}
                >Скачать презентацию</Button>

                <Button type='save'
                        onClick={() => onFeedButtonHandler('get-view')}
                >Записаться на просмотр</Button>
            </div>
        )
    }

    const renderButtonsAdmin = (): React.ReactElement | null => {
        if (!user.id) {
            return null
        }

        return (
            <div className={classes.buttonsAdmin}>
                {checkRules([Rules.EDIT_BUILDING], props.building.author_id) ?
                    <Button type='apply'
                            icon='pen-to-square'
                            onClick={onClickEditHandler.bind(this)}
                            className='marginRight'
                            title='Редактировать'
                    />
                    : null
                }

                <Button type='regular'
                        icon='question'
                        onClick={() => {
                            openPopupSupportCreate(document.body, {
                                objectId: props.building.id,
                                objectType: 'building',
                                onSave: () => {
                                    openPopupAlert(document.body, {
                                        title: 'Сообщение отправлено',
                                        text: 'Ваша заявка успешно принята, мы ответим Вам в ближайшее время.',
                                        buttons: [
                                            {
                                                text: 'Перейти к заявкам',
                                                onClick: () => navigate(RouteNames.P_SUPPORT)
                                            },
                                            {text: 'Закрыть'}
                                        ]
                                    })
                                }
                            })
                        }}
                        className='marginRight'
                        title='Задать вопрос'
                />

                {props.building.id && checkRules([Rules.EDIT_COMPILATION]) ?
                    <Button type='regular'
                            icon='plus'
                            onClick={() => {
                                if (props.building.id) {
                                    // Todo
                                    openPopupCompilationSelector(document.body, {
                                        onSelect: (value: number[]) => {
                                        }
                                    })
                                }
                            }}
                            className='marginRight'
                            title='Добавить в подборку'
                    />
                    : null
                }

                {props.building.id && favorites.length && favorites.includes(props.building.id) ?
                    <Button type='apply'
                            icon='heart'
                            onClick={onChangeBuildingToFavorite.bind(this)}
                            className='marginRight'
                            title='Удалить из избранного'
                    />
                    :
                    <Button type='regular'
                            icon='heart'
                            onClick={onChangeBuildingToFavorite.bind(this)}
                            className='marginRight'
                            title='Добавить в избранное'
                    />
                }

                <div>
                    <Button type='regular'
                            icon='arrow-up-from-bracket'
                            onClick={() => {
                                navigator.clipboard.writeText(`${configuration.siteUrl}building/${props.building.id}`)
                                    .then(() => {
                                        setShowCopyText(true)
                                        setTimeout(() => {
                                            setShowCopyText(false)
                                        }, 2000)
                                    })
                            }}
                            title='Поделиться ссылкой'
                    />

                    <div className={cx({'copyText': true, 'show': showCopyText})}>Ссылка скопирована</div>
                </div>

                <PDFDownloadLink document={<PdfDocumentGenerator type='building' building={props.building}/>}>
                    {({loading}) => {
                        return (
                            <Button type='regular'
                                    icon='print'
                                    onClick={() => {
                                    }}
                                    title='Печать информации'
                                    disabled={loading}
                            />
                        )
                    }}
                </PDFDownloadLink>
            </div>
        )
    }

    return (
        <div className={classes.BuildingInfoBlock}>
            {renderMetaInformation()}

            {props.building.type !== 'land' && passedInfo !== '' ?
                <div
                    className={cx({'passed': true, 'is': props.building.info.passed && props.building.info.passed.is})}>
                    <span>{passedInfo}</span>
                </div>
                : null
            }

            {props.building.type === 'land' && props.building.info.cadastral_number ?
                <div className={classes.passed} title='Кадастровый номер'>
                    <span>{props.building.info.cadastral_number}</span>
                </div>
                : null
            }

            {props.building.tags && props.building.tags.length ?
                <div className={classes.tags}>
                    {props.building.tags.map((tag: ITag) => <div key={tag.id}>{tag.name}</div>)}
                </div>
                : null
            }

            <Title type='h1'
                   className={classes.title}
            >{props.building.name}</Title>

            <div className={classes.address}>
                {districtText !== '' && <span>{districtText}</span>}

                {props.building.coordinates ?
                    <span className={classes.addressLink}
                          onClick={() => {
                              openPopupMap(document.body, {
                                  building: props.building
                              })
                          }}
                    >{props.building.address}</span>
                    : <span>{props.building.address}</span>
                }
            </div>

            {renderBuildingInfo()}

            {renderButtons()}

            {renderButtonsAdmin()}
        </div>
    )
}

BuildingInfoBlock.defaultProps = defaultProps
BuildingInfoBlock.displayName = 'BuildingInfoBlock'

export default BuildingInfoBlock
