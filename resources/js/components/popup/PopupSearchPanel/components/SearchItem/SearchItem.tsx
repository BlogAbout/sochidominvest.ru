import React from 'react'
import {IUser} from '../../../../../@types/IUser'
import {IBuilding} from '../../../../../@types/IBuilding'
import {IArticle} from '../../../../../@types/IArticle'
import {IDocument} from '../../../../../@types/IDocument'
import {IDeveloper} from '../../../../../@types/IDeveloper'
import {IAttachment} from '../../../../../@types/IAttachment'
import {IPartner} from '../../../../../@types/IPartner'
import {getFormatDate} from '../../../../../helpers/dateHelper'
import classes from './SearchItem.module.scss'
import {configuration} from "../../../../../helpers/utilHelper";

interface Props {
    item: IUser | IBuilding | IArticle | IDocument | IDeveloper | IAttachment | IPartner
    type: 'user' | 'building' | 'article' | 'document' | 'developer' | 'attachment' | 'partner'
    navigate: any

    onClick(): void
}

const defaultProps: Props = {
    item: {} as IBuilding | IArticle | IDocument | IDeveloper | IAttachment | IPartner,
    type: 'building',
    navigate: null,
    onClick: () => {
        console.info('SearchItem onClick')
    }
}

const SearchItem: React.FC<Props> = (props) => {
    return (
        <div className={classes.SearchItem}
             onClick={() => {
                 if (props.type === 'attachment' && 'content' in props.item) {
                     window.open(
                         `${configuration.apiUrl}uploads/${props.item.type}/${props.item.content}`,
                         '_blank'
                     )
                 } else {
                     props.navigate(`/panel/${props.type}/${props.item.id}`)
                 }
                 props.onClick()
             }}
        >
            <div className={classes.name}>
                {'name' in props.item ? props.item.name : ''}
            </div>

            <div className={classes.date}>
                {'dateCreated' in props.item ? getFormatDate(props.item.dateCreated) : ''}
            </div>
        </div>
    )
}

SearchItem.defaultProps = defaultProps
SearchItem.displayName = 'SearchItem'

export default SearchItem
