import React from 'react'
import {ICategory} from '../../../../../@types/IStore'
import ListHead from '../../../../ui/List/components/ListHead/ListHead'
import ListCell from '../../../../ui/List/components/ListCell/ListCell'
import ListBody from '../../../../ui/List/components/ListBody/ListBody'
import ListRow from '../../../../ui/List/components/ListRow/ListRow'
import List from '../../../../ui/List/List'
import Empty from '../../../../ui/Empty/Empty'
import classes from './CategoryList.module.scss'

interface Props {
    list: ICategory[]
    fetching: boolean

    onClick(category: ICategory): void

    onContextMenu(category: ICategory, e: React.MouseEvent): void
}

const defaultProps: Props = {
    list: [],
    fetching: false,
    onClick: (category: ICategory) => {
        console.info('CategoryList onClick', category)
    },
    onContextMenu: (category: ICategory, e: React.MouseEvent) => {
        console.info('CategoryList onContextMenu', category, e)
    }
}

const CategoryList: React.FC<Props> = (props): React.ReactElement => {
    return (
        <List className={classes.CategoryList}>
            <ListHead>
                <ListCell className={classes.name}>Название</ListCell>
            </ListHead>

            <ListBody fetching={props.fetching}>
                {props.list && props.list.length ?
                    props.list.map((category: ICategory) => {
                        return (
                            <ListRow key={category.id}
                                     onContextMenu={(e: React.MouseEvent) => props.onContextMenu(category, e)}
                                     onClick={() => props.onClick(category)}
                                     isDisabled={!category.active}
                            >
                                <ListCell className={classes.name}>{category.name}</ListCell>
                            </ListRow>
                        )
                    })
                    : <Empty message='Нет категорий товаров'/>
                }
            </ListBody>
        </List>
    )
}

CategoryList.defaultProps = defaultProps
CategoryList.displayName = 'CategoryList'

export default React.memo(CategoryList)
