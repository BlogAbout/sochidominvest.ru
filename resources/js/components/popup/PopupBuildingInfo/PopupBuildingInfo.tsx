import React, {useEffect} from 'react'
import classNames from 'classnames/bind'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import withStore from '../../hoc/withStore'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {IBuilding} from '../../../@types/IBuilding'
import {ITag} from '../../../@types/ITag'
import {ISelector} from '../../../@types/ISelector'
import {declension} from '../../../helpers/stringHelper'
import {numberWithSpaces, round} from '../../../helpers/numberHelper'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import Button from '../../form/Button/Button'
import {
    formalizationList,
    getBuildingTypesText,
    getDistrictText,
    getPassedText,
    paymentsList
} from '../../../helpers/buildingHelper'
import Avatar from '../../ui/Avatar/Avatar'
import classes from './PopupBuildingInfo.module.scss'

interface Props extends PopupProps {
    building: IBuilding

    onClick?(building: IBuilding): void

    onEdit?(building: IBuilding): void

    onRemove?(building: IBuilding): void

    onContextMenu?(e: React.MouseEvent, building: IBuilding): void

    onRemoveFromFavorite?(building: IBuilding): void

    onRemoveFromCompilation?(building: IBuilding): void
}

const defaultProps: Props = {
    building: {} as IBuilding
}

const cx = classNames.bind(classes)

const PopupBuildingInfo: React.FC<Props> = (props) => {
    const buildingType = getBuildingTypesText(props.building.type)
    const passedInfo = getPassedText(props.building.info.passed)
    const districtText = getDistrictText(props.building.info.district, props.building.info.district_zone)

    useEffect(() => {
        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [props.blockId])

    // Закрытие popup
    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    const showHandler = () => {
        if (props.onClick) {
            props.onClick(props.building)
        }

        close()
    }

    return (
        <Popup className={classes.PopupBuildingInfo}>
            <BlockingElement fetching={false} className={classes.content}>
                <div key='content' className={classes.blockContent}>
                    <div className={classes.avatarContent}>
                        <Avatar href={props.building.info.avatar ? props.building.info.avatar.content : ''}
                                alt={props.building.name}
                                width={350}
                                height={350}
                        />

                        {props.building.tags && props.building.tags.length ?
                            <div className={classes.tags}>
                                {props.building.tags.map((tag: ITag) => {
                                    return <div key={tag.id}>{tag.name}</div>
                                })}
                            </div>
                            : null
                        }

                        {passedInfo !== '' &&
                        <div className={cx({
                            'passed': true,
                            'is': props.building.info.passed && props.building.info.passed.is
                        })}>
                            {passedInfo}
                        </div>}
                    </div>

                    <div className={classes.itemInfo}>
                        {buildingType && <div className={classes.type}>{buildingType}</div>}

                        {props.building.type === 'building' ?
                            <div className={classes.counter}>
                                {declension(props.building.checkers ? props.building.checkers.length : 0, ['квартира', 'квартиры', 'квартир'], false)}
                            </div>
                            : null
                        }

                        <div className={classes.cost}>
                            {props.building.type === 'building'
                                ? `От ${numberWithSpaces(round(props.building.cost_min || 0, 0))} руб.`
                                : `${numberWithSpaces(round(props.building.cost || 0, 0))} руб.`
                            }
                        </div>

                        <div className={classes.costPer}>
                            {props.building.type === 'building'
                                ? numberWithSpaces(round(props.building.cost_min_unit || 0, 0))
                                : numberWithSpaces(round(props.building.cost && props.building.area ? props.building.cost / props.building.area : 0, 0))
                            } руб. за м<sup>2</sup>
                        </div>

                        <div className={classes.area}>
                            {props.building.type === 'building'
                                ? (props.building.area_min || 0) + ' - ' + (props.building.area_max || 0)
                                : props.building.area || 0
                            } м<sup>2</sup>
                        </div>
                    </div>


                    <div className={classes.itemContent}>
                        <div className={classes.information}>
                            <div className={classes.icon} title={`Просмотры: ${props.building.views}`}>
                                <FontAwesomeIcon icon='eye'/>
                                <span>{props.building.views}</span>
                            </div>

                            <div className={classes.icon}
                                 title={`Дата публикации: ${props.building.date_created}`}>
                                <FontAwesomeIcon icon='calendar'/>
                                <span>{props.building.date_created}</span>
                            </div>

                            {props.building.author ?
                                <div className={classes.icon} title={`Автор: ${props.building.author.name}`}>
                                    <FontAwesomeIcon icon='user'/>
                                    <span>{props.building.author.name}</span>
                                </div>
                                : null}
                        </div>

                        <h2>{props.building.name}</h2>

                        <div className={classes.address}>
                            {districtText !== '' && <span>{districtText}</span>}
                            <span>{props.building.address}</span>
                        </div>

                        {props.building.info.payments && props.building.info.payments.length ?
                            <div className={classes.payments}>
                                {props.building.info.payments.map((payment: string, index: number) => {
                                    const paymentInfo = paymentsList.find((item: ISelector) => item.key === payment)
                                    if (paymentInfo) {
                                        return (
                                            <div key={'payment-' + index}>{paymentInfo.text}</div>
                                        )
                                    }
                                })}
                            </div>
                            : null
                        }

                        {props.building.info.formalization && props.building.info.formalization.length ?
                            <div className={classes.payments}>
                                {props.building.info.formalization.map((formalization: string, index: number) => {
                                    const formalizationInfo = formalizationList.find((item: ISelector) => item.key === formalization)
                                    if (formalizationInfo) {
                                        return (
                                            <div key={'formalization-' + index}>{formalizationInfo.text}</div>
                                        )
                                    }
                                })}
                            </div>
                            : null
                        }
                    </div>
                </div>
            </BlockingElement>

            <Footer>
                <Button type='apply'
                        icon='eye'
                        onClick={() => showHandler()}
                        title='Подробнее'
                >Подробнее</Button>

                <Button type='regular'
                        icon='xmark'
                        onClick={close.bind(this)}
                        title='Закрыть'
                        className='marginLeft'
                >Закрыть</Button>
            </Footer>
        </Popup>
    )
}

PopupBuildingInfo.defaultProps = defaultProps
PopupBuildingInfo.displayName = 'PopupBuildingInfo'

export default function openPopupBuildingInfo(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupBuildingInfo), popupProps, undefined, block, displayOptions)
}
