import React from 'react'
import {IProduct} from '../../../../../@types/IStore'
import Empty from '../../../../ui/Empty/Empty'
import BlockingElement from '../../../../../components/ui/BlockingElement/BlockingElement'
import BlockItem from '../../../../ui/BlockItem/BlockItem'
import classes from './ProductTill.module.scss'

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
        console.info('BuildingList onClick', product)
    },
    onContextMenu: (product: IProduct, e: React.MouseEvent) => {
        console.info('ProductTill onClick', product, e)
    }
}

const ProductTill: React.FC<Props> = (props): React.ReactElement => {
    return (
        <div className={classes.ProductTill}>
            <BlockingElement fetching={props.fetching} className={classes.list}>
                {props.list && props.list.length ?
                    props.list.map((product: IProduct) => {
                        return (
                            <BlockItem key={product.id}
                                       title={product.name}
                                       avatar={product.avatar ? product.avatar.content : ''}
                                       description={product.description}
                                       cost={product.cost}
                                       date={product.date_created || undefined}
                                       type={product.category ? product.category.name : ''}
                                       isDisabled={!product.is_active}
                                       onContextMenu={(e: React.MouseEvent) => props.onContextMenu(product, e)}
                                       onClick={() => props.onClick(product)}
                            />
                        )
                    })
                    : <Empty message='Нет товаров'/>
                }
            </BlockingElement>
        </div>
    )
}

ProductTill.defaultProps = defaultProps
ProductTill.displayName = 'ProductTill'

export default React.memo(ProductTill)
