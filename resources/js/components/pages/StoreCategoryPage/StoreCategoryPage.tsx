import React, {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import {RouteNames} from '../../../helpers/routerHelper'
import {checkRules, Rules} from '../../../helpers/accessHelper'
import {ICategory, IProduct} from '../../../@types/IStore'
import Title from '../../ui/Title/Title'
import Wrapper from '../../ui/Wrapper/Wrapper'
import PanelView from '../../views/PanelView/PanelView'
import StoreService from '../../../api/StoreService'
import ProductTill from '../StoreProductsPanelPage/components/ProductTill/ProductTill'
import openContextMenu from '../../ui/ContextMenu/ContextMenu'
import openPopupProductCreate from '../../../components/popup/PopupProductCreate/PopupProductCreate'
import openPopupAlert from '../../popup/PopupAlert/PopupAlert'
import classes from './StoreCategoryPage.module.scss'

type StoreCategoryPageProps = {
    id: string
}

const CategoryPage: React.FC = (): React.ReactElement => {
    const navigate = useNavigate()

    const params = useParams<StoreCategoryPageProps>()

    const [isUpdate, setIsUpdate] = useState(false)
    const [category, setCategory] = useState<ICategory>({} as ICategory)
    const [filterProduct, setFilterProduct] = useState<IProduct[]>([])
    const [fetching, setFetching] = useState(false)

    const {products, categories, fetching: fetchingStore} = useTypedSelector(state => state.storeReducer)
    const {fetchProductList, fetchCategoryList} = useActions()

    useEffect(() => {
        if (isUpdate || !categories.length) {
            fetchCategoryList({active: [0, 1]})

            setIsUpdate(false)
        }
    }, [isUpdate])

    useEffect(() => {
        if (categories && categories.length && params.id) {
            const categoryId = parseInt(params.id)
            const categoryInfo = categories.find((category: ICategory) => category.id === categoryId)

            if (categoryInfo) {
                setCategory(categoryInfo)
            }
        }
    }, [categories])

    useEffect(() => {
        fetchProductList({active: [0, 1]})
    }, [category])

    useEffect(() => {
        if (products && products.length) {
            setFilterProduct(products.filter((product: IProduct) => product.category_id === category.id))
        } else {
            setFilterProduct([])
        }
    }, [products])

    const onSaveHandler = (): void => {
        setIsUpdate(true)
    }

    const onClickHandler = (product: IProduct): void => {
        navigate(`${RouteNames.STORE_PRODUCTS}/${product.id}`)
    }

    const onAddHandler = (): void => {
        if (category.id) {
            openPopupProductCreate(document.body, {
                product: {
                    id: null,
                    category_id: category.id,
                    name: '',
                    cost: 0,
                    image_ids: [],
                    video_ids: [],
                    fields: {},
                    is_active: 1
                },
                onSave: () => {
                    onSaveHandler()
                }
            })
        }
    }

    const onEditHandler = (product: IProduct): void => {
        openPopupProductCreate(document.body, {
            product: product,
            onSave: () => onSaveHandler()
        })
    }

    const onRemoveHandler = (product: IProduct): void => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить ${product.name}?`,
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

    const onContextMenuItem = (product: IProduct, e: React.MouseEvent): void => {
        e.preventDefault()

        const menuItems: any[] = []

        if (checkRules([Rules.EDIT_PRODUCT])) {
            menuItems.push({text: 'Редактировать', onClick: () => onEditHandler(product)})
        }

        if (checkRules([Rules.REMOVE_PRODUCT])) {
            menuItems.push({text: 'Удалить', onClick: () => onRemoveHandler(product)})
        }

        if (menuItems.length) {
            openContextMenu(e, menuItems)
        }
    }

    return (
        <PanelView pageTitle={category.name}>
            <Wrapper isFull>
                <Title type='h1'
                       onAdd={checkRules([Rules.ADD_PRODUCT]) ? onAddHandler.bind(this) : undefined}
                       addText='Создать товар'
                       className={classes.title}
                >{category.name}</Title>

                <ProductTill list={filterProduct}
                             fetching={fetching || fetchingStore}
                             onClick={(product: IProduct) => onClickHandler(product)}
                             onContextMenu={(product: IProduct, e: React.MouseEvent) => onContextMenuItem(product, e)}
                />
            </Wrapper>
        </PanelView>
    )
}

CategoryPage.displayName = 'CategoryPage'

export default React.memo(CategoryPage)
