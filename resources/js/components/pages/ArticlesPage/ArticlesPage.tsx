import React, {useEffect, useMemo, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import ArticleService from '../../../api/ArticleService'
import {getArticleTypeText} from '../../../helpers/articleHelper'
import {RouteNames} from '../../../helpers/routerHelper'
import {IArticle} from '../../../@types/IArticle'
import {IFilterBase} from '../../../@types/IFilter'
import BlockingElement from '../../../components/ui/BlockingElement/BlockingElement'
import Empty from '../../ui/Empty/Empty'
import FilterBase from '../../../components/ui/FilterBase/FilterBase'
import Title from '../../ui/Title/Title'
import Wrapper from '../../ui/Wrapper/Wrapper'
import DefaultView from '../../views/DefaultView/DefaultView'
import BlockItem from '../../ui/BlockItem/BlockItem'
import classes from './ArticlesPage.module.scss'

const ArticlesPage: React.FC = (): React.ReactElement => {
    const navigate = useNavigate()

    const [articles, setArticles] = useState<IArticle[]>()
    const [filterArticle, setFilterArticle] = useState<IArticle[]>([])
    const [selectedType, setSelectedType] = useState<string>('all')
    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        onFetchArticles()
    }, [])

    useEffect(() => {
        onFiltrationArticles()
    }, [articles, selectedType])

    const onFetchArticles = (): void => {
        setFetching(true)

        ArticleService.fetchArticles({active: [1], publish: 1})
            .then((response: any) => setArticles(response.data.data))
            .catch((error: any) => console.error('Произошла ошибка загрузки данных', error))
            .finally(() => setFetching(false))
    }

    const onFiltrationArticles = (): void => {
        if (!articles || !articles.length) {
            setFilterArticle([])
        } else if (!selectedType || selectedType === 'all') {
            setFilterArticle(articles)
        } else {
            setFilterArticle(articles.filter((article: IArticle) => article.type === selectedType))
        }
    }

    const filterBaseButtons: IFilterBase[] = useMemo((): IFilterBase[] => {
        return [
            {
                key: 'all',
                title: 'Все',
                icon: 'bookmark',
                active: selectedType.includes('all'),
                onClick: () => setSelectedType('all')
            },
            {
                key: 'news',
                title: 'Новости',
                icon: 'bolt',
                active: selectedType.includes('news'),
                onClick: () => setSelectedType('news')
            },
            {
                key: 'action',
                title: 'Акции',
                icon: 'percent',
                active: selectedType.includes('action'),
                onClick: () => setSelectedType('action')
            },
            {
                key: 'article',
                title: 'Статьи',
                icon: 'star',
                active: selectedType.includes('article'),
                onClick: () => setSelectedType('article')
            }
        ]
    }, [selectedType])

    return (
        <DefaultView pageTitle='Статьи'>
            <Wrapper>
                <div className={classes.inner}>
                    <Title type='h1' style='center'>Статьи</Title>

                    <FilterBase buttons={filterBaseButtons}/>

                    <BlockingElement fetching={fetching} className={classes.list}>
                        {filterArticle && filterArticle.length ?
                            filterArticle.map((article: IArticle) => {
                                return (
                                    <BlockItem key={article.id}
                                               title={article.name}
                                               avatar={article.avatar ? article.avatar.content : ''}
                                               description={article.description}
                                               date={article.date_created || undefined}
                                               type={getArticleTypeText(article.type)}
                                               isDisabled={!article.is_active}
                                               onContextMenu={() => {
                                               }}
                                               onClick={() => navigate(`${RouteNames.ARTICLE}/${article.id}`)}
                                    />
                                )
                            })
                            : <Empty message='Нет статей'/>
                        }
                    </BlockingElement>
                </div>
            </Wrapper>
        </DefaultView>
    )
}

ArticlesPage.displayName = 'ArticlesPage'

export default React.memo(ArticlesPage)
