import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {getBuildingTypesText, getDistrictText, getPassedText} from '../../../../../helpers/buildingHelper'
import {RouteNames} from '../../../../../helpers/routerHelper'
import {IBuilding} from '../../../../../@types/IBuilding'
import BuildingService from '../../../../../api/BuildingService'
import Wrapper from '../../../../ui/Wrapper/Wrapper'
import Title from '../../../../ui/Title/Title'
import Button from '../../../../form/Button/Button'
import Empty from '../../../../ui/Empty/Empty'
import BlockingElement from '../../../../../components/ui/BlockingElement/BlockingElement'
import BlockItem from '../../../../ui/BlockItem/BlockItem'
import classes from './SectionBuildings.module.scss'

const SectionBuildings: React.FC = (): React.ReactElement => {
    const navigate = useNavigate()

    const [buildings, setBuildings] = useState<IBuilding[]>([])
    const [filteredBuildings, setFilteredBuildings] = useState<IBuilding[]>([])
    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        onFetchBuildingsHandler()
    }, [])

    useEffect(() => {
        const listBuildings: IBuilding[] = []
        let i = 1

        for (let building of buildings) {
            if (i > 9) {
                break
            }

            listBuildings.push(building)
            i++
        }

        setFilteredBuildings(listBuildings)
    }, [buildings])

    const onFetchBuildingsHandler = (): void => {
        setFetching(true)

        BuildingService.fetchBuildings({active: [1], publish: 1})
            .then((response: any) => setBuildings(response.data.data))
            .catch((error: any) => console.error('Произошла ошибка загрузки данных', error))
            .finally(() => setFetching(false))
    }

    return (
        <section className={classes.SectionBuildings}>
            <Wrapper>
                <div className={classes.inner}>
                    <Title type='h2' style='center' className={classes.title}>Недвижимость</Title>

                    <BlockingElement fetching={fetching} className={classes.list}>
                        {filteredBuildings.length ?
                            filteredBuildings.map((building: IBuilding) => {
                                return (
                                    <BlockItem key={building.id}
                                               title={building.name}
                                               avatar={building.info.avatar ? building.info.avatar.content : ''}
                                               address={building.address || ''}
                                               districtText={getDistrictText(building.info.district, building.info.district_zone)}
                                               date={building.date_created || undefined}
                                               type={getBuildingTypesText(building.type)}
                                               passed={getPassedText(building.info.passed)}
                                               isPassed={!!(building.info.passed && building.info.passed.is)}
                                               rentType={building.rentData ? building.rentData.type === 'short' ? '/в сутки' : '/в месяц' : undefined}
                                               rentCost={building.rentData && building.rentData.cost ? building.rentData.cost : undefined}
                                               countCheckers={building.checkers ? building.checkers.length : undefined}
                                               buildingType={building.type}
                                               cost={building.type === 'building' ? (building.cost_min || 0) : (building.cost || 0)}
                                               areaMin={building.type === 'building' ? (building.area_min || 0) : (building.area || 0)}
                                               areaMax={building.type === 'building' ? (building.area_max || 0) : undefined}
                                               cadastral_number={building.type === 'land' ? building.info.cadastral_number : null}
                                               isDisabled={!building.is_active}
                                               onContextMenu={() => {
                                               }}
                                               onClick={() => navigate(`${RouteNames.BUILDING}/${building.id}`)}
                                    />
                                )
                            })
                            : <Empty message='Нет объектов недвижимости'/>}
                    </BlockingElement>

                    <div className={classes.buttons}>
                        <Button type='apply' onClick={() => navigate(RouteNames.BUILDING)}>Покупка</Button>
                        <Button type='apply' onClick={() => navigate(RouteNames.RENT)}>Аренда</Button>
                    </div>
                </div>
            </Wrapper>
        </section>
    )
}

SectionBuildings.displayName = 'SectionBuildings'

export default SectionBuildings
