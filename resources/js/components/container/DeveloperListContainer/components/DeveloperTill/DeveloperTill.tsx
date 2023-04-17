import React from 'react'
import DeveloperItem from './components/DeveloperItem/DeveloperItem'
import BlockingElement from '../../../../ui/BlockingElement/BlockingElement'
import {IDeveloper} from '../../../../../@types/IDeveloper'
import classes from './DeveloperTill.module.scss'

interface Props {
    developers: IDeveloper[]
    fetching: boolean

    onClick(developer: IDeveloper): void

    onEdit(developer: IDeveloper): void

    onRemove(developer: IDeveloper): void

    onContextMenu(e: React.MouseEvent, developer: IDeveloper): void
}

const defaultProps: Props = {
    developers: [],
    fetching: false,
    onClick: (developer: IDeveloper) => {
        console.info('BuildingTill onClick', developer)
    },
    onEdit: (developer: IDeveloper) => {
        console.info('BuildingTill onEdit', developer)
    },
    onRemove: (developer: IDeveloper) => {
        console.info('BuildingTill onRemove', developer)
    },
    onContextMenu: (e: React.MouseEvent, developer: IDeveloper) => {
        console.info('BuildingTill onContextMenu', e, developer)
    }
}

const DeveloperTill: React.FC<Props> = (props) => {
    return (
        <div className={classes.developerTill}>
            <BlockingElement fetching={props.fetching} className={classes.list}>
                {props.developers.map((developer: IDeveloper) => {
                    return (
                        <DeveloperItem key={developer.id}
                                       developer={developer}
                                       onClick={props.onClick}
                                       onEdit={props.onEdit}
                                       onRemove={props.onRemove}
                                       onContextMenu={props.onContextMenu}
                        />
                    )
                })}
            </BlockingElement>
        </div>
    )
}

DeveloperTill.defaultProps = defaultProps
DeveloperTill.displayName = 'DeveloperTill'

export default DeveloperTill
