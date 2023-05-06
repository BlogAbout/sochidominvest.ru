import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import {changeLayout, getLayout} from '../../../helpers/utilHelper'
import {compareText} from '../../../helpers/filterHelper'
import {checkRules, Rules} from '../../../helpers/accessHelper'
import {IProduct} from '../../../@types/IStore'
import {RouteNames} from '../../../helpers/routerHelper'
import PanelView from '../../views/PanelView/PanelView'
import Wrapper from '../../ui/Wrapper/Wrapper'
import Title from '../../ui/Title/Title'
import StoreService from '../../../api/StoreService'
import ProductList from './components/ProductList/ProductList'
import ProductTill from './components/ProductTill/ProductTill'
import openPopupAlert from '../../popup/PopupAlert/PopupAlert'
import openContextMenu from '../../ui/ContextMenu/ContextMenu'
import openPopupProductCreate from '../../../components/popup/PopupProductCreate/PopupProductCreate'
import classes from './StoreProductsPanelPage.module.scss'

const StoreProductsPanelPage: React.FC = (): React.ReactElement => {
    const navigate = useNavigate()

    const [fetching, setFetching] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterProducts, setFilterProducts] = useState<IProduct[]>([])
    const [layout, setLayout] = useState<'list' | 'till'>(getLayout('products'))

    const {products, fetching: fetchingProducts} = useTypedSelector(state => state.storeReducer)

    const {fetchProductList, fetchCategoryList} = useActions()

    useEffect(() => {
        fetchProductsHandler()
        fetchCategoryList({active: [0, 1]})
    }, [])

    useEffect(() => {
        search(searchText)
    }, [products])

    const fetchProductsHandler = (): void => {
        fetchProductList({active: [0, 1]})
    }

    const onSaveHandler = (): void => {
        fetchProductsHandler()
    }

    const search = (value: string): void => {
        setSearchText(value)

        if (!products || !products.length) {
            setFilterProducts([])
        }

        if (value !== '') {
            setFilterProducts(products.filter((product: IProduct) => {
                return compareText(product.name, value)
            }))
        } else {
            setFilterProducts(products)
        }
    }

    const onClickHandler = (product: IProduct): void => {
        navigate(`${RouteNames.STORE_PRODUCTS}/${product.id}`)
    }

    const onAddHandler = (): void => {
        openPopupProductCreate(document.body, {
            onSave: () => onSaveHandler()
        })
    }

    const onEditHandler = (product: IProduct): void => {
        openPopupProductCreate(document.body, {
            product: product,
            onSave: () => onSaveHandler()
        })
    }

    const onRemoveHandler = (product: IProduct): void => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить "${product.name}"?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (product.id) {
                            setFetching(true)

                            StoreService.removeProduct(product.id)
                                .then(() => onSaveHandler())
                                .catch((error: any) => {
                                    openPopupAlert(document.body, {
                                        title: 'Ошибка!',
                                        text: error.data.message
                                    })
                                })
                                .finally(() => setFetching(false))
                        }
                    }
                },
                {text: 'Отмена'}
            ]
        })
    }

    const onContextMenuHandler = (product: IProduct, e: React.MouseEvent): void => {
        e.preventDefault()

        const menuItems: any[] = []

        if (checkRules([Rules.EDIT_PRODUCT])) {
            menuItems.push({text: 'Редактировать', onClick: () => onEditHandler(product)})
        }

        if (checkRules([Rules.REMOVE_PRODUCT])) {
            menuItems.push({text: 'Удалить', onClick: () => onRemoveHandler(product)})
        }

        openContextMenu(e, menuItems)
    }

    const onChangeLayoutHandler = (value: 'list' | 'till'): void => {
        setLayout(value)
        changeLayout('products', value)
    }

    return (
        <PanelView pageTitle='Товары'>
            <Wrapper isFull>
                <Title type='h1'
                       onAdd={checkRules([Rules.ADD_PRODUCT]) ? onAddHandler.bind(this) : undefined}
                       searchText={searchText}
                       onSearch={search.bind(this)}
                       className={classes.title}
                       layouts={['list', 'till']}
                       activeLayout={layout}
                       onChangeLayout={onChangeLayoutHandler.bind(this)}
                >Товары</Title>

                {layout === 'till'
                    ? <ProductTill list={filterProducts}
                                   fetching={fetching || fetchingProducts}
                                   onClick={(product: IProduct) => onClickHandler(product)}
                                   onContextMenu={(product: IProduct, e: React.MouseEvent) => onContextMenuHandler(product, e)}
                    />
                    : <ProductList list={filterProducts}
                                   fetching={fetching || fetchingProducts}
                                   onClick={(product: IProduct) => onClickHandler(product)}
                                   onContextMenu={(product: IProduct, e: React.MouseEvent) => onContextMenuHandler(product, e)}
                    />
                }
            </Wrapper>
        </PanelView>
    )
}

StoreProductsPanelPage.displayName = 'StoreProductsPanelPage'

export default React.memo(StoreProductsPanelPage)
