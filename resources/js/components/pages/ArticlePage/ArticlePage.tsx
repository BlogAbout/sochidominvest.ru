import React, {useEffect, useMemo, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {converter} from '../../../helpers/utilHelper'
import {IArticle} from '../../../@types/IArticle'
import {IBuilding} from '../../../@types/IBuilding'
import ArticleService from '../../../api/ArticleService'
import Wrapper from '../../ui/Wrapper/Wrapper'
import Title from '../../ui/Title/Title'
import DefaultView from '../../views/DefaultView/DefaultView'
import BlockingElement from '../../../components/ui/BlockingElement/BlockingElement'
import Gallery from '../../../components/ui/Gallery/Gallery'
import BuildingItem from '../BuildingsPage/components/BuildingItem/BuildingItem'
import Empty from '../../ui/Empty/Empty'
import classes from './ArticlePage.module.scss'

type ArticlePageProps = {
    id: string
}

interface Props {
    isPublic?: boolean
}

const defaultProps: Props = {
    isPublic: false
}

const ArticlePage: React.FC<Props> = (props): React.ReactElement => {
    const params = useParams<ArticlePageProps>()

    const navigate = useNavigate()

    const [fetchingArticle, setFetchingArticle] = useState(false)
    const [article, setArticle] = useState<IArticle>({} as IArticle)

    useEffect(() => {
        onFetchArticle()
    }, [params.id])

    const onFetchArticle = (): void => {
        if (params.id) {
            const articleId = parseInt(params.id)

            setFetchingArticle(true)

            ArticleService.fetchArticleById(articleId)
                .then((response: any) => setArticle(response.data.data))
                .catch((error: any) => console.error('Ошибка загрузки статьи', error))
                .finally(() => setFetchingArticle(false))
        }
    }

    const pageTitle = useMemo(() => {
        return !article ? 'Статьи' : !article.meta_title ? article.name : article.meta_title
    }, [article])

    // Отображение списка связанных объектов недвижимости
    const renderBuildingsList = (): React.ReactElement | null => {
        if (!article.buildings || !article.buildings.length) {
            return null
        }

        return (
            <div className={classes.relations}>
                <Title type='h2'>Связанные объекты</Title>

                <BlockingElement fetching={fetchingArticle} className={classes.list}>
                    {article.buildings.map((building: IBuilding) => {
                        if (!building.publish) {
                            return null
                        }

                        return (
                            <BuildingItem key={building.id}
                                          building={building}
                                          onClick={() => navigate(`/building/${building.id}`)}
                            />
                        )
                    })}
                </BlockingElement>
            </div>
        )
    }

    // Вывод содержимого статьи
    const renderArticleContent = (): React.ReactElement => {
        return (
            <BlockingElement fetching={fetchingArticle} className={classes.block}>
                <Gallery alt={article.name}
                         images={article.images || []}
                         type='carousel'
                         fetching={fetchingArticle}
                         avatar={article.avatar_id}
                         className={classes.gallery}
                />

                <Title type='h1'
                       style='center'
                >{article.name}</Title>

                <div className={classes.description}
                     dangerouslySetInnerHTML={{__html: converter.makeHtml(article.description)}}
                />

                <div className={classes.information}>
                    <div className={classes.icon}
                         title={`Просмотры: ${article.views}`}
                    >
                        <FontAwesomeIcon icon='eye'/>
                        <span>{article.views}</span>
                    </div>

                    <div className={classes.icon}
                         title={`Дата публикации: ${article.date_created}`}
                    >
                        <FontAwesomeIcon icon='calendar'/>
                        <span>{article.date_created}</span>
                    </div>

                    {article.author ?
                        <div className={classes.icon}
                             title={`Автор: ${article.author.name}`}
                        >
                            <FontAwesomeIcon icon='user'/>
                            <span>{article.author.name}</span>
                        </div>
                        : null
                    }
                </div>
            </BlockingElement>
        )
    }

    return (
        <DefaultView pageTitle={pageTitle}>
            <Wrapper>
                <div className={classes.inner}>
                    <div className={classes.content}>
                        {article && article.id
                            ? renderArticleContent()
                            : <Empty message='Объект недвижимости не найден'/>
                        }
                    </div>

                    {renderBuildingsList()}
                </div>
            </Wrapper>
        </DefaultView>
    )
}

ArticlePage.defaultProps = defaultProps
ArticlePage.displayName = 'ArticlePage'

export default React.memo(ArticlePage)
