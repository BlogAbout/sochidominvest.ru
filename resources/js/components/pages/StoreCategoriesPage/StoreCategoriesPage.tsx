import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import {compareText} from '../../../helpers/filterHelper'
import {checkRules, Rules} from '../../../helpers/accessHelper'
import {RouteNames} from '../../../helpers/routerHelper'
import {ICategory} from '../../../@types/IStore'
import PanelView from '../../views/PanelView/PanelView'
import Wrapper from '../../ui/Wrapper/Wrapper'
import Title from '../../ui/Title/Title'
import StoreService from '../../../api/StoreService'
import CategoryList from './components/CategoryList/CategoryList'
import openContextMenu from '../../ui/ContextMenu/ContextMenu'
import openPopupAlert from '../../popup/PopupAlert/PopupAlert'
import openPopupCategoryCreate from '../../../components/popup/PopupCategoryCreate/PopupCategoryCreate'
import classes from './StoreCategoriesPage.module.scss'

const StoreCategoriesPage: React.FC = (): React.ReactElement => {
    const navigate = useNavigate()

    const [fetching, setFetching] = useState(false)
    const [filterCategories, setFilterCategories] = useState<ICategory[]>([])
    const [searchText, setSearchText] = useState('')

    const {categories, fetching: fetchingCategories} = useTypedSelector(state => state.storeReducer)

    const {fetchCategoryList} = useActions()

    useEffect(() => {
        fetchCategoriesHandler()
    }, [])

    useEffect(() => {
        search(searchText)
    }, [categories])

    const fetchCategoriesHandler = (): void => {
        fetchCategoryList({active: [0, 1]})
    }

    const onSaveHandler = () => {
        fetchCategoriesHandler()
    }

    const search = (value: string): void => {
        setSearchText(value)

        if (!categories || !categories.length) {
            setFilterCategories([])
        }

        if (value !== '') {
            setFilterCategories(categories.filter((category: ICategory) => {
                return compareText(category.name, value)
            }))
        } else {
            setFilterCategories(categories)
        }
    }

    const onClickHandler = (category: ICategory): void => {
        navigate(`${RouteNames.P_STORE_CATEGORIES}/${category.id}`)
    }

    const onAddHandler = (): void => {
        openPopupCategoryCreate(document.body, {
            onSave: () => onSaveHandler()
        })
    }

    const onEditHandler = (category: ICategory): void => {
        openPopupCategoryCreate(document.body, {
            category: category,
            onSave: () => onSaveHandler()
        })
    }

    const onRemoveHandler = (category: ICategory): void => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить "${category.name}"?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (category.id) {
                            setFetching(true)

                            StoreService.removeCategory(category.id)
                                .then(() => onSaveHandler())
                                .catch((error: any) => {
                                    openPopupAlert(document.body, {
                                        title: 'Ошибка!',
                                        text: error.data.data
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

    const onContextMenuHandler = (category: ICategory, e: React.MouseEvent): void => {
        e.preventDefault()

        const menuItems: any[] = []

        if (checkRules([Rules.EDIT_CATEGORY])) {
            menuItems.push({text: 'Редактировать', onClick: () => onEditHandler(category)})
        }

        if (checkRules([Rules.REMOVE_CATEGORY])) {
            menuItems.push({text: 'Удалить', onClick: () => onRemoveHandler(category)})
        }

        openContextMenu(e, menuItems)
    }

    return (
        <PanelView pageTitle='Категории товаров'>
            <Wrapper isFull>
                <Title type='h1'
                       onAdd={checkRules([Rules.ADD_CATEGORY]) ? onAddHandler.bind(this) : undefined}
                       searchText={searchText}
                       onSearch={search.bind(this)}
                       className={classes.title}
                >Категории товаров</Title>

                <CategoryList list={filterCategories}
                              fetching={fetching || fetchingCategories}
                              onClick={(category: ICategory) => onClickHandler(category)}
                              onContextMenu={(category: ICategory, e: React.MouseEvent) => onContextMenuHandler(category, e)}
                />
            </Wrapper>
        </PanelView>
    )
}

StoreCategoriesPage.displayName = 'StoreCategoriesPage'

export default React.memo(StoreCategoriesPage)
