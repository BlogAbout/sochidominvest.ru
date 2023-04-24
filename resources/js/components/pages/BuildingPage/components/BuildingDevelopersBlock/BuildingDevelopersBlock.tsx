import React from 'react'
import {Link} from 'react-router-dom'
import {getDeveloperTypeText} from '../../../../../helpers/developerHelper'
import {RouteNames} from '../../../../../helpers/routerHelper'
import {IDeveloper} from '../../../../../@types/IDeveloper'
import {IBuilding} from '../../../../../@types/IBuilding'
import BlockingElement from '../../../../../components/ui/BlockingElement/BlockingElement'
import Empty from '../../../../../components/ui/Empty/Empty'
import Title from '../../../../ui/Title/Title'
import classes from './BuildingDevelopersBlock.module.scss'

interface Props {
    building: IBuilding
}

const defaultProps: Props = {
    building: {} as IBuilding
}

const BuildingDevelopersBlock: React.FC<Props> = (props): React.ReactElement => {
    return (
        <BlockingElement fetching={false} className={classes.BuildingDevelopersBlock}>
            <Title type='h2'>Застройщик</Title>

            {props.building.developers && props.building.developers.length ?
                <div className={classes.list}>
                    {props.building.developers.map((developer: IDeveloper) => {
                        return (
                            <div key={developer.id}>
                                <span>
                                    <Link to={`${RouteNames.P_DEVELOPER}/${developer.id}`}>
                                        {developer.name}
                                    </Link>
                                </span>
                                <span>{getDeveloperTypeText(developer.type)}</span>
                            </div>
                        )
                    })}
                </div>
                : <Empty message='Отсутствует информация о застройщике'/>
            }
        </BlockingElement>
    )
}

BuildingDevelopersBlock.defaultProps = defaultProps
BuildingDevelopersBlock.displayName = 'BuildingDevelopersBlock'

export default BuildingDevelopersBlock
