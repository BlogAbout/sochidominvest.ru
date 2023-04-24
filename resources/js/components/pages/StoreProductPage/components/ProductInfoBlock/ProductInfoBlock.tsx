import React from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {IProduct} from '../../../../../@types/IStore'
import {IFeed} from '../../../../../@types/IFeed'
import {numberWithSpaces, round} from '../../../../../helpers/numberHelper'
import Title from '../../../../ui/Title/Title'
import Button from '../../../../../components/form/Button/Button'
import openPopupFeedCreate from '../../../../../components/popup/PopupFeedCreate/PopupFeedCreate'
import classes from './ProductInfoBlock.module.scss'

interface Props {
    product: IProduct

    onSave?(): void
}

const defaultProps: Props = {
    product: {} as IProduct
}

const ProductInfoBlock: React.FC<Props> = (props): React.ReactElement => {

    // Вызов окна обратной связи
    const onFeedButtonHandler = (): void => {
        const feed: IFeed = {
            id: null,
            title: `Заявка на покупку ${props.product.name}`,
            type: 'callback',
            status: 'new',
            phone: '',
            name: '',
            object_id: props.product.id,
            object_type: 'store',
            is_active: 1
        }
        openPopupFeedCreate(document.body, {
            feed: feed,
            type: 'callback'
        })
    }

    // Вывод графика цен
    const renderDynamicChangePrices = (): React.ReactElement | null => {
        // Todo
        return null
        // if (!props.product.id || !props.product.cost_old || !props.product.cost) {
        //     return null
        // }
        //
        // return (
        //     <div className={cx({'icon': true, 'link': true})}
        //          title='График цен'
        //          onClick={() => openPopupPriceChart(document.body, {productId: props.product.id || 0})}
        //     >
        //         <FontAwesomeIcon icon='chart-line'/>
        //     </div>
        // )
    }

    // Вывод старой цены
    const renderOldPrice = (): React.ReactElement | null => {
        if (!props.product.cost_old) {
            return null
        }

        if (props.product.cost_old > props.product.cost) {
            return (
                <span className={classes.costDown}
                      title={`Старая цена: ${numberWithSpaces(round(props.product.cost_old || 0, 0))} руб.`}
                >
                    <FontAwesomeIcon icon='arrow-down'/>
                </span>
            )
        } else {
            return (
                <span className={classes.costUp}
                      title={`Старая цена: ${numberWithSpaces(round(props.product.cost_old || 0, 0))} руб.`}
                >
                    <FontAwesomeIcon icon='arrow-up'/>
                </span>
            )
        }
    }

    const renderMetaInformation = (): React.ReactElement => {
        return (
            <div className={classes.information}>
                <div className={classes.icon} title={`Дата публикации: ${props.product.date_created}`}>
                    <FontAwesomeIcon icon='calendar'/>
                    <span>{props.product.date_created}</span>
                </div>

                {renderDynamicChangePrices()}
            </div>
        )
    }

    const renderProductInfo = (): React.ReactElement => {
        return (
            <div className={classes.info}>
                <div className={classes.row}>

                    <>
                        <span>{numberWithSpaces(round(props.product.cost || 0, 0))} руб.</span>
                        <span>Цена</span>
                    </>
                </div>

                {props.product.cost_old ?
                    <div className={classes.row}>

                        <>
                            <span>{numberWithSpaces(round(props.product.cost_old || 0, 0))} руб.</span>
                            <span>Старая цена</span>
                        </>
                    </div>
                    : null
                }
            </div>
        )
    }

    const renderButtons = (): React.ReactElement => {
        return (
            <div className={classes.buttons}>
                <Button type='save'
                        onClick={() => onFeedButtonHandler()}
                >Заказать</Button>
            </div>
        )
    }

    return (
        <div className={classes.ProductInfoBlock}>
            {renderMetaInformation()}

            {props.product.category ?
                <div className={classes.category}>
                    <div>{props.product.category.name}</div>
                </div>
                : null
            }

            <Title type='h1'
                   className={classes.title}
            >{props.product.name}</Title>

            {renderProductInfo()}

            {renderButtons()}
        </div>
    )
}

ProductInfoBlock.defaultProps = defaultProps
ProductInfoBlock.displayName = 'ProductInfoBlock'

export default ProductInfoBlock
