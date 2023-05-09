import React from 'react'
import {IBuilding, IBuildingChecker, IBuildingHousing} from '../../../../../@types/IBuilding'
import {declension} from '../../../../../helpers/stringHelper'
import {numberWithSpaces, round} from '../../../../../helpers/numberHelper'
import BlockingElement from '../../../../../components/ui/BlockingElement/BlockingElement'
import openPopupCheckerInfo from '../../../../popup/PopupCheckerInfo/PopupCheckerInfo'
import classes from './BuildingCheckersBlock.module.scss'

interface Props {
    building: IBuilding
}

const defaultProps: Props = {
    building: {} as IBuilding
}

const BuildingCheckersBlock: React.FC<Props> = (props): React.ReactElement | null => {
    const renderHousing = () => {
        if (!props.building.checkers || !props.building.checkers.length) {
            return null
        }

        const housingIds: number[] = Array.from(new Set(props.building.checkers.map((checker: IBuildingChecker) => checker.housing)))
        const housingList: IBuildingHousing = {} as IBuildingHousing

        housingIds.forEach((housingId: number) => {
            housingList[housingId] = props.building.checkers
                ? props.building.checkers.filter((checker: IBuildingChecker) => checker.housing === housingId)
                : []
        })

        return (
            <div className={classes.BuildingCheckersBlock}>
                <BlockingElement fetching={false}>
                    <h2>Корпуса ({housingIds.length})</h2>

                    {Object.keys(housingList).map((key: string) => {
                        const housingId: number = parseInt(key)
                        let minCost = 0
                        let minCostUnit = 0

                        housingList[housingId].forEach((checker: IBuildingChecker) => {
                            const cost = checker.cost && checker.cost ? checker.cost : 0
                            const costUnit = checker.cost && checker.area ? checker.cost / checker.area : 0

                            if (minCost === 0 || (checker.cost && cost < minCost)) {
                                minCost = cost
                            }

                            if (minCostUnit === 0 || costUnit < minCostUnit) {
                                minCostUnit = costUnit
                            }
                        })

                        return (
                            <div key={key}
                                 className={classes.housing}
                                 onClick={() => openPopupCheckerInfo(document.body, {
                                     buildingName: props.building.name,
                                     list: housingList,
                                     housing: housingId,
                                     housingList: housingIds
                                 })}
                            >
                                <div className={classes.title}>Корпус #{key}</div>
                                <div>
                                    {declension(housingList[housingId].length, ['квартира', 'квартиры', 'квартир'], false)},
                                    от {numberWithSpaces(round(minCost, 0))} рублей,
                                    от {numberWithSpaces(round(minCostUnit, 0))} рублей за м<sup>2</sup>
                                </div>
                            </div>
                        )
                    })}
                </BlockingElement>
            </div>
        )
    }

    return props.building.type === 'building' ? renderHousing() : null
}

BuildingCheckersBlock.defaultProps = defaultProps
BuildingCheckersBlock.displayName = 'BuildingCheckersBlock'

export default React.memo(BuildingCheckersBlock)
