import React from 'react'
import {numberWithSpaces, round} from '../../../../../helpers/numberHelper'
import {IProduct} from '../../../../../@types/IStore'
import ListHead from '../../../../ui/List/components/ListHead/ListHead'
import ListCell from '../../../../ui/List/components/ListCell/ListCell'
import ListBody from '../../../../ui/List/components/ListBody/ListBody'
import ListRow from '../../../../ui/List/components/ListRow/ListRow'
import List from '../../../../ui/List/List'
import Empty from '../../../../ui/Empty/Empty'
import classes from './ProductList.module.scss'

interface Props {
    list: IProduct[]
    fetching: boolean

    onClick(product: IProduct): void

    onContextMenu(product: IProduct, e: React.MouseEvent): void
}

const defaultProps: Props = {
    list: [],
    fetching: false,
    onClick: (product: IProduct) => {
        console.info('ProductList onClick', product)
    },
    onContextMenu: (product: IProduct, e: React.MouseEvent) => {
        console.info('ProductList onContextMenu', product, e)
    }
}

const ProductList: React.FC<Props> = (props): React.ReactElement => {
    return (
        <List className={classes.ProductList}>
            <ListHead>
                <ListCell className={classes.name}>Название</ListCell>
                <ListCell className={classes.cost}>Цена, руб.</ListCell>
                <ListCell className={classes.category}>Категория</ListCell>
            </ListHead>

            <ListBody fetching={props.fetching}>
                {props.list && props.list.length ?
                    props.list.map((product: IProduct) => {
                        return (
                            <ListRow key={product.id}
                                     onContextMenu={(e: React.MouseEvent) => props.onContextMenu(product, e)}
                                     onClick={() => props.onClick(product)}
                                     isDisabled={!product.is_active}
                            >
                                <ListCell className={classes.name}>{product.name}</ListCell>
                                <ListCell className={classes.cost}>
                                    {product.cost && product.cost_old ?
                                        <span className={classes.old}>
                                            {numberWithSpaces(round(product.cost_old || 0, 2))}
                                        </span>
                                        : null
                                    }

                                    {numberWithSpaces(round(product.cost || 0, 0))}
                                </ListCell>
                                <ListCell className={classes.category}>
                                    {product.category ? product.category.name : ''}
                                </ListCell>
                            </ListRow>
                        )
                    })
                    : <Empty message='Нет товаров'/>
                }
            </ListBody>
        </List>
    )
}

ProductList.defaultProps = defaultProps
ProductList.displayName = 'ProductList'

export default React.memo(ProductList)
