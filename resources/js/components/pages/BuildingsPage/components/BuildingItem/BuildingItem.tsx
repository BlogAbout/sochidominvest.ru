import React from 'react'
import classNames from 'classnames/bind'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {IBuilding} from '../../../../../@types/IBuilding'
import {declension} from '../../../../../helpers/stringHelper'
import {numberWithSpaces, round} from '../../../../../helpers/numberHelper'
import {getBuildingTypesText, getDistrictText, getPassedText} from '../../../../../helpers/buildingHelper'
import Avatar from '../../../../ui/Avatar/Avatar'
import Title from '../../../../ui/Title/Title'
import classes from './BuildingItem.module.scss'

interface Props {
    building: IBuilding
    isRent?: boolean

    onClick(): void
}

const defaultProps: Props = {
    building: {} as IBuilding,
    isRent: false,
    onClick: () => {
        console.info('BuildingItem onClick')
    }
}

const cx = classNames.bind(classes)

const BuildingItem: React.FC<Props> = (props): React.ReactElement => {
    const buildingType = getBuildingTypesText(props.building.type)
    const passedInfo = getPassedText(props.building.info.passed)
    const districtText = getDistrictText(props.building.info.district, props.building.info.district_zone)

    return (
        <div key={props.building.id} className={classes.BuildingItem} onClick={() => props.onClick()}>
            <Avatar href={props.building.info.avatar ? props.building.info.avatar.content : ''}
                    alt={props.building.name}
                    width='100%'
                    height='100%'
                    withWrap
            />

            <div className={classes.itemContainer}>
                <div className={classes.itemContent}>
                    <Title type='h3'
                           className={classes.head}
                           style='right'
                    >{props.building.name}</Title>

                    <div className={classes.address}>
                        {districtText !== '' && <span>{districtText}</span>}
                        <span>{props.building.address}</span>
                    </div>
                </div>

                <div className={classes.itemInfo}>
                    {passedInfo !== '' &&
                    <div className={cx({
                        'passed': true,
                        'is': props.building.info.passed && props.building.info.passed.is
                    })}>
                        <span>{passedInfo}</span>
                    </div>}

                    {props.isRent && props.building.rentData ?
                        <div className={classes.counter}>
                            {numberWithSpaces(round(props.building.rentData.cost || 0, 0))} руб.
                            {props.building.rentData.type === 'short' ? '/в сутки' : '/в месяц'}
                        </div>
                        : null
                    }

                    {!props.isRent ?
                        props.building.type === 'building' ?
                            <div className={classes.counter}>
                                {declension(props.building.checkers ? props.building.checkers.length : 0, ['квартира', 'квартиры', 'квартир'], false)} от {numberWithSpaces(round(props.building.cost_min || 0, 0))} руб.
                            </div>
                            :
                            <div className={classes.counter}>
                                {numberWithSpaces(round(props.building.cost || 0, 0))} руб.
                            </div>
                        : null
                    }

                    {props.building.type === 'building' ?
                        <div className={classes.area}>
                            <h3>Площади</h3>
                            <div>{props.building.area_min || 0} м<sup>2</sup> - {props.building.area_max || 0} м<sup>2</sup>
                            </div>
                        </div>
                        :
                        <div className={classes.area}>
                            <h3>Площадь</h3>
                            <div>{props.building.area || 0} м<sup>2</sup></div>
                        </div>
                    }
                </div>

                {buildingType !== '' && <div className={classes.type}>{buildingType}</div>}

                <div className={classes.information}>
                    <div className={classes.icon}
                         title={`Просмотры: ${props.building.views}`}
                    >
                        <FontAwesomeIcon icon='eye'/>
                        <span>{props.building.views}</span>
                    </div>

                    <div className={classes.icon}
                         title={`Дата публикации: ${props.building.date_created}`}
                    >
                        <FontAwesomeIcon icon='calendar'/>
                        <span>{props.building.date_created}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

BuildingItem.defaultProps = defaultProps
BuildingItem.displayName = 'BuildingItem'

export default React.memo(BuildingItem)
