import React from 'react'
import classNames from 'classnames/bind'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {IPartner} from '../../../../../../../@types/IPartner'
import Avatar from '../../../../../../ui/Avatar/Avatar'
import {getPartnerTypeText} from '../../../../../../../helpers/partnerHelper'
import classes from './PartnerItem.module.scss'

interface Props {
    partner: IPartner

    onClick(partner: IPartner): void

    onEdit(partner: IPartner): void

    onRemove(partner: IPartner): void

    onContextMenu(e: React.MouseEvent, partner: IPartner): void
}

const defaultProps: Props = {
    partner: {} as IPartner,
    onClick: (partner: IPartner) => {
        console.info('PartnerItem onClick', partner)
    },
    onEdit: (partner: IPartner) => {
        console.info('PartnerItem onEdit', partner)
    },
    onRemove: (partner: IPartner) => {
        console.info('PartnerItem onRemove', partner)
    },
    onContextMenu: (e: React.MouseEvent, partner: IPartner) => {
        console.info('PartnerItem onContextMenu', e, partner)
    }
}

const cx = classNames.bind(classes)

const PartnerItem: React.FC<Props> = (props) => {
    return (
        <div className={cx({'PartnerItem': true, 'disabled': !props.partner.is_active})}
             onClick={() => props.onClick(props.partner)}
             onContextMenu={(e: React.MouseEvent) => props.onContextMenu(e, props.partner)}
        >
            <Avatar href={props.partner.avatar ? props.partner.avatar.content : ''}
                    alt={props.partner.name}
                    width={150}
                    height={150}
            />

            <div className={classes.itemContent}>
                <h2>{props.partner.name}</h2>

                <div className={classes.row} title='Дата публикации'>
                    <FontAwesomeIcon icon='calendar'/>
                    <span>{props.partner.date_created}</span>
                </div>

                <div className={classes.row} title='Тип'>
                    <FontAwesomeIcon icon='star'/>
                    <span>{getPartnerTypeText(props.partner.type)}</span>
                </div>

                {props.partner.author ?
                    <div className={classes.row} title='Автор'>
                        <FontAwesomeIcon icon='user'/>
                        <span>{props.partner.author.name}</span>
                    </div>
                    : null}
            </div>
        </div>
    )
}

PartnerItem.defaultProps = defaultProps
PartnerItem.displayName = 'PartnerItem'

export default PartnerItem
