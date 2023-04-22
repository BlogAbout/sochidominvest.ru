import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {RouteNames} from '../../../../../helpers/routerHelper'
import {getArticleTypeText} from '../../../../../helpers/articleHelper'
import {IArticle} from '../../../../../@types/IArticle'
import Wrapper from '../../../../ui/Wrapper/Wrapper'
import ArticleService from '../../../../../api/ArticleService'
import Title from '../../../../ui/Title/Title'
import Button from '../../../../form/Button/Button'
import BlockingElement from '../../../../ui/BlockingElement/BlockingElement'
import Empty from '../../../../ui/Empty/Empty'
import BlockItem from '../../../../ui/BlockItem/BlockItem'
import classes from './SectionArticles.module.scss'

const SectionArticles: React.FC = (): React.ReactElement => {
    const navigate = useNavigate()

    const [fetching, setFetching] = useState(false)
    const [articles, setArticles] = useState<IArticle[]>([])

    useEffect(() => {
        setFetching(true)

        ArticleService.fetchArticles({active: [1], publish: 1})
            .then((response: any) => setArticles(response.data.data))
            .catch((error: any) => {
                console.error('Произошла ошибка загрузки данных', error)
            })
            .finally(() => setFetching(false))
    }, [])

    const renderItems = () => {
        const showArticles: IArticle[] = []

        for (let i = 0; i < 3; i++) {
            showArticles.push(articles[i])
        }

        return showArticles.map((article: IArticle) => {
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
    }

    return (
        <section className={classes.SectionArticles}>
            <Wrapper>
                <div className={classes.inner}>
                    <Title type='h2' style='center'>Последние новости и события</Title>

                    <BlockingElement fetching={fetching} className={classes.list}>
                        {articles.length ? renderItems() : <Empty message='Нет статей'/>}
                    </BlockingElement>

                    <div className={classes.buttons}>
                        <Button type='apply' onClick={() => navigate(RouteNames.ARTICLE)}>Смотреть все</Button>
                    </div>
                </div>
            </Wrapper>
        </section>
    )
}

SectionArticles.displayName = 'SectionArticles'

export default React.memo(SectionArticles)
