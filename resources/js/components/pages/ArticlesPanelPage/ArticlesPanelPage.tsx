import React, {useEffect, useMemo, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {articleTypes} from '../../../helpers/articleHelper'
import {compareText} from '../../../helpers/filterHelper'
import {changeLayout, getLayout} from '../../../helpers/utilHelper'
import {checkRules, Rules} from '../../../helpers/accessHelper'
import {RouteNames} from '../../../helpers/routerHelper'
import {IArticle} from '../../../@types/IArticle'
import {IFilterContent} from '../../../@types/IFilter'
import Title from '../../ui/Title/Title'
import Wrapper from '../../ui/Wrapper/Wrapper'
import PanelView from '../../views/PanelView/PanelView'
import ArticleService from '../../../api/ArticleService'
import SidebarLeft from '../../../components/ui/SidebarLeft/SidebarLeft'
import ArticleList from './components/ArticleList/ArticleList'
import ArticleTill from './components/ArticleTill/ArticleTill'
import openPopupArticleCreate from '../../../components/popup/PopupArticleCreate/PopupArticleCreate'
import openPopupAlert from '../../../components/popup/PopupAlert/PopupAlert'
import openContextMenu from '../../ui/ContextMenu/ContextMenu'
import classes from './ArticlesPanelPage.module.scss'

const ArticlesPanelPage: React.FC = (): React.ReactElement => {
    const navigate = useNavigate()

    const [fetching, setFetching] = useState(false)
    const [articles, setArticles] = useState<IArticle[]>([])
    const [searchText, setSearchText] = useState('')
    const [filterArticle, setFilterArticle] = useState<IArticle[]>([])
    const [isShowFilter, setIsShowFilter] = useState(false)
    const [filters, setFilters] = useState({
        types: ['article', 'action', 'news']
    })
    const [layout, setLayout] = useState<'list' | 'till'>(getLayout('articles'))

    useEffect(() => {
        fetchArticlesHandler()
    }, [])

    useEffect(() => {
        search(searchText)
    }, [articles, filters])

    const fetchArticlesHandler = (): void => {
        setFetching(true)

        ArticleService.fetchArticles({active: [0, 1]})
            .then((response: any) => setArticles(response.data.data))
            .catch((error: any) => console.error('Произошла ошибка загрузки данных', error))
            .finally(() => setFetching(false))
    }

    const onSaveHandler = (): void => {
        fetchArticlesHandler()
    }

    const search = (value: string): void => {
        setSearchText(value)

        if (!articles || !articles.length) {
            setFilterArticle([])
        }

        if (value !== '') {
            setFilterArticle(filterItemsHandler(articles.filter((article: IArticle) => {
                return compareText(article.name, value)
            })))
        } else {
            setFilterArticle(filterItemsHandler(articles))
        }
    }

    const onClickHandler = (article: IArticle): void => {
        navigate(`${RouteNames.ARTICLE}/${article.id}`)
    }

    const onAddHandler = (): void => {
        openPopupArticleCreate(document.body, {
            onSave: () => onSaveHandler()
        })
    }

    const onEditHandler = (article: IArticle): void => {
        openPopupArticleCreate(document.body, {
            article: article,
            onSave: () => onSaveHandler()
        })
    }

    const onRemoveHandler = (article: IArticle): void => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить "${article.name}"?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (article.id) {
                            setFetching(true)

                            ArticleService.removeArticle(article.id)
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

    const onContextMenuHandler = (article: IArticle, e: React.MouseEvent): void => {
        e.preventDefault()

        const menuItems: any[] = []

        if (checkRules([Rules.EDIT_ARTICLE])) {
            menuItems.push({text: 'Редактировать', onClick: () => onEditHandler(article)})
        }

        if (checkRules([Rules.REMOVE_ARTICLE])) {
            menuItems.push({text: 'Удалить', onClick: () => onRemoveHandler(article)})
        }

        openContextMenu(e, menuItems)
    }

    const onChangeLayoutHandler = (value: 'list' | 'till'): void => {
        setLayout(value)
        changeLayout('articles', value)
    }

    const filterItemsHandler = (list: IArticle[]): IArticle[] => {
        if (!list || !list.length) {
            return []
        }

        return list.filter((item: IArticle) => {
            return filters.types.includes(item.type)
        })
    }

    const filtersContent: IFilterContent[] = useMemo((): IFilterContent[] => {
        return [
            {
                title: 'Тип',
                type: 'checker',
                multi: true,
                items: articleTypes,
                selected: filters.types,
                onSelect: (values: string[]) => {
                    setFilters({...filters, types: values})
                }
            }
        ]
    }, [filters])

    return (
        <PanelView pageTitle='Статьи'>
            <SidebarLeft filters={filtersContent}
                         isShow={isShowFilter}
                         onChangeShow={(isShow: boolean) => setIsShowFilter(isShow)}
            />

            <Wrapper isFull>
                <Title type='h1'
                       onAdd={checkRules([Rules.ADD_ARTICLE]) ? onAddHandler.bind(this) : undefined}
                       onFilter={() => setIsShowFilter(!isShowFilter)}
                       searchText={searchText}
                       onSearch={search.bind(this)}
                       className={classes.title}
                       layouts={['list', 'till']}
                       activeLayout={layout}
                       onChangeLayout={onChangeLayoutHandler.bind(this)}
                >Статьи</Title>

                {layout === 'till'
                    ? <ArticleTill list={filterArticle}
                                   fetching={fetching}
                                   onClick={(article: IArticle) => onClickHandler(article)}
                                   onContextMenu={(article: IArticle, e: React.MouseEvent) => onContextMenuHandler(article, e)}
                    />
                    : <ArticleList list={filterArticle}
                                   fetching={fetching}
                                   onClick={(article: IArticle) => onClickHandler(article)}
                                   onContextMenu={(article: IArticle, e: React.MouseEvent) => onContextMenuHandler(article, e)}
                    />
                }
            </Wrapper>
        </PanelView>
    )
}

ArticlesPanelPage.displayName = 'ArticlesPanelPage'

export default React.memo(ArticlesPanelPage)
