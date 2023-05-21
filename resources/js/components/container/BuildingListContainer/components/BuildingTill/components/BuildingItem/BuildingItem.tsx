import React from 'react'
import classNames from 'classnames/bind'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {declension} from '../../../../../../../helpers/stringHelper'
import {numberWithSpaces, round} from '../../../../../../../helpers/numberHelper'
import {
    formalizationList,
    getBuildingTypesText,
    getDistrictText,
    getPassedText,
    paymentsList
} from '../../../../../../../helpers/buildingHelper'
import {IBuilding} from '../../../../../../../@types/IBuilding'
import {ISelector} from '../../../../../../../@types/ISelector'
import {ITag} from '../../../../../../../@types/ITag'
import {IPrice} from '../../../../../../../@types/IPrice'
import Avatar from '../../../../../../ui/Avatar/Avatar'
import classes from './BuildingItem.module.scss'

interface Props {
    building: IBuilding
    isFavorite?: boolean
    compilationId?: number | null

    onClick(building: IBuilding): void

    onEdit(building: IBuilding): void

    onRemove(building: IBuilding): void

    onContextMenu(e: React.MouseEvent, building: IBuilding): void

    onRemoveFromFavorite(building: IBuilding): void

    onRemoveFromCompilation(building: IBuilding): void
}

const defaultProps: Props = {
    building: {} as IBuilding,
    isFavorite: false,
    compilationId: null,
    onClick: (building: IBuilding) => {
        console.info('BuildingItem onClick', building)
    },
    onEdit: (building: IBuilding) => {
        console.info('BuildingItem onEdit', building)
    },
    onRemove: (building: IBuilding) => {
        console.info('BuildingItem onRemove', building)
    },
    onContextMenu: (e: React.MouseEvent, building: IBuilding) => {
        console.info('BuildingItem onContextMenu', e, building)
    },
    onRemoveFromFavorite: (building: IBuilding) => {
        console.info('BuildingItem onRemoveFromFavorite', building)
    },
    onRemoveFromCompilation: (building: IBuilding, compilationId?: number) => {
        console.info('BuildingItem onRemoveFromCompilation', building, compilationId)
    }
}

const cx = classNames.bind(classes)

const BuildingItem: React.FC<Props> = (props) => {
    const buildingType = getBuildingTypesText(props.building.type)
    const passedInfo = getPassedText(props.building.info.passed)
    const districtText = getDistrictText(props.building.info.district, props.building.info.district_zone)

    const renderOldPrice = () => {
        if (!props.building.prices || !props.building.prices.length || !props.building.cost) {
            return null
        }

        const costOld: IPrice = props.building.prices[0]

        if (costOld.cost > props.building.cost) {
            return (
                <span className={classes.costDown}
                      title={`Старая цена: ${numberWithSpaces(round(costOld.cost, 0))} руб.`}
                >
                    <FontAwesomeIcon icon='arrow-down'/>
                </span>
            )
        } else {
            return (
                <span className={classes.costUp}
                      title={`Старая цена: ${numberWithSpaces(round(costOld.cost, 0))} руб.`}
                >
                    <FontAwesomeIcon icon='arrow-up'/>
                </span>
            )
        }
    }

    return (
        <div className={cx({'BuildingItem': true, 'disabled': props.building.is_active === 0})}
             onClick={() => props.onClick(props.building)}
             onContextMenu={(e: React.MouseEvent) => props.onContextMenu(e, props.building)}
        >
            <Avatar href={props.building.info.avatar ? props.building.info.avatar.content : ''}
                    alt={props.building.name}
                    width='100%'
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

            <div className={classes.itemContent}>
                <div className={classes.information}>
                    <div className={classes.icon} title={`Просмотры: ${props.building.views}`}>
                        <FontAwesomeIcon icon='eye'/>
                        <span>{props.building.views}</span>
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

                    {renderOldPrice()}
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
        </div>
    )
}

BuildingItem.defaultProps = defaultProps
BuildingItem.displayName = 'BuildingItem'

export default BuildingItem
