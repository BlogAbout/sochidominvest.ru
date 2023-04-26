import React from 'react'
import {IBuilding} from '../../../../../@types/IBuilding'
import {IContact} from '../../../../../@types/IAgent'
import BlockingElement from '../../../../../components/ui/BlockingElement/BlockingElement'
import Empty from '../../../../../components/ui/Empty/Empty'
import Title from '../../../../ui/Title/Title'
import classes from './BuildingContactsBlock.module.scss'

interface Props {
    building: IBuilding
}

const defaultProps: Props = {
    building: {} as IBuilding
}

const BuildingContactsBlock: React.FC<Props> = (props): React.ReactElement | null => {
    const renderContactContactsList = () => {
        if (!props.building.contacts || !props.building.contacts.length) {
            return
        }

        return (
            props.building.contacts.map((contact: IContact) => {
                return (
                    <div key={contact.id}>
                        <span>
                            <span>{contact.name}</span>
                        </span>

                        {contact.post && <span className={classes.post}>{contact.post}</span>}

                        <span><a href={`tel:${contact.phone}`}>{contact.phone}</a></span>
                    </div>
                )
            })
        )
    }

    return (
        <BlockingElement fetching={false} className={classes.BuildingContactsBlock}>
            <Title type='h2'>Контакты</Title>

            {props.building.contacts && props.building.contacts.length ?
                <div className={classes.list}>
                    {renderContactContactsList()}
                </div>
                : <Empty message='Отсутствует информация о контактах'/>
            }
        </BlockingElement>
    )
}

BuildingContactsBlock.defaultProps = defaultProps
BuildingContactsBlock.displayName = 'BuildingContactsBlock'

export default React.memo(BuildingContactsBlock)
