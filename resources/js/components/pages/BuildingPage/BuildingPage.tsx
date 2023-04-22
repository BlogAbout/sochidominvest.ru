import React, {useEffect, useMemo, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {sortAttachments} from '../../../helpers/attachmentHelper'
import {allowForRole, allowForTariff} from '../../../helpers/accessHelper'
import {IFilter} from '../../../@types/IFilter'
import {IArticle} from '../../../@types/IArticle'
import {IAttachment} from '../../../@types/IAttachment'
import {IBuilding} from '../../../@types/IBuilding'
import ArticleService from '../../../api/ArticleService'
import UtilService from '../../../api/UtilService'
import BuildingService from '../../../api/BuildingService'
import AttachmentService from '../../../api/AttachmentService'
import Wrapper from '../../ui/Wrapper/Wrapper'
import Title from '../../ui/Title/Title'
import DefaultView from '../../views/DefaultView/DefaultView'
import BlockingElement from '../../../components/ui/BlockingElement/BlockingElement'
import Gallery from '../../../components/ui/Gallery/Gallery'
import Empty from '../../ui/Empty/Empty'
import BuildingInfoBlock from './components/BuildingInfoBlock/BuildingInfoBlock'
import BuildingAdvantagesBlock from './components/BuildingAdvantagesBlock/BuildingAdvantagesBlock'
import BuildingAdvancedBlock from './components/BuildingAdvancedBlock/BuildingAdvancedBlock'
import BuildingDescriptionBlock from './components/BuildingDescriptionBlock/BuildingDescriptionBlock'
import BuildingCheckersBlock from './components/BuildingCheckersBlock/BuildingCheckersBlock'
import BuildingDocumentsBlock from './components/BuildingDocumentsBlock/BuildingDocumentsBlock'
import BuildingDevelopersBlock from './components/BuildingDevelopersBlock/BuildingDevelopersBlock'
import BuildingContactsBlock from './components/BuildingContactsBlock/BuildingContactsBlock'
import ArticleItem from '../ArticlesPage/components/ArticleItem/ArticleItem'
import Grid from '../../ui/Grid/Grid'
import GridColumn from '../../ui/Grid/components/GridColumn/GridColumn'
import classes from './BuildingPage.module.scss'

type BuildingPageProps = {
    id: string
}

interface Props {
    role?: number | null
    isPublic?: boolean
    isRent?: boolean
}

const defaultProps: Props = {
    isPublic: false,
    isRent: false
}

const BuildingPage: React.FC<Props> = (props): React.ReactElement => {
    const params = useParams<BuildingPageProps>()

    const navigate = useNavigate()

    const [fetchingBuilding, setFetchingBuilding] = useState(false)
    const [fetchingArticles, setFetchingArticles] = useState(false)
    const [fetchingImages, setFetchingImages] = useState(false)
    const [fetchingVideos, setFetchingVideos] = useState(false)
    const [building, setBuilding] = useState<IBuilding>({} as IBuilding)
    const [articles, setArticles] = useState<IArticle[]>([])
    const [images, setImages] = useState<IAttachment[]>([])
    const [videos, setVideos] = useState<IAttachment[]>([])
    const [views, setViews] = useState<number>(0)

    useEffect(() => {
        onFetchBuilding()
    }, [params.id])

    useEffect(() => {
        onUpdateViews()

        onFetchArticles()

        onFetchImages()

        onFetchVideos()
    }, [building])

    // Загрузка данных объекта недвижимости
    const onFetchBuilding = (): void => {
        if (params.id) {
            const buildingId = parseInt(params.id)

            setFetchingBuilding(true)

            BuildingService.fetchBuildingById(buildingId)
                .then((response: any) => {
                    setBuilding(response.data.data)
                })
                .catch((error: any) => {
                    console.error('Ошибка загрузки объекта недвижимости', error)
                })
                .finally(() => {
                    setFetchingBuilding(false)
                })
        }
    }

    // Загрузка связанных статей
    const onFetchArticles = (): void => {
        if (building.articles && building.articles.length) {
            const filter: IFilter = {
                active: [0, 1],
                id: building.articles
            }

            if (props.isPublic) {
                filter.publish = 1
            }

            setFetchingArticles(true)

            ArticleService.fetchArticles(filter)
                .then((response) => {
                    setArticles(response.data.data)
                })
                .catch((error: any) => {
                    console.error('Ошибка загрузки связанных статей', error)
                })
                .finally(() => {
                    setFetchingArticles(false)
                })
        }
    }

    // Загрузка фотогалереи объекта недвижимости
    const onFetchImages = (): void => {
        if (building.images && building.images.length) {
            setFetchingImages(true)

            const filter: IFilter = {
                active: [0, 1],
                id: building.images,
                type: 'image'
            }

            AttachmentService.fetchAttachments(filter)
                .then((response: any) => {
                    setImages(sortAttachments(response.data.data, building.images))
                })
                .catch((error: any) => {
                    console.error('Ошибка загрузки фотогалереи объекта недвижимости', error)
                })
                .finally(() => {
                    setFetchingImages(false)
                })
        }
    }

    // Загрузка фотогалереи объекта недвижимости
    const onFetchVideos = (): void => {
        if (building.videos && building.videos.length) {
            setFetchingVideos(true)

            const filter: IFilter = {
                active: [0, 1],
                id: building.videos,
                type: 'video'
            }

            AttachmentService.fetchAttachments(filter)
                .then((response: any) => {
                    setVideos(sortAttachments(response.data.data, building.videos))
                })
                .catch((error: any) => {
                    console.error('Ошибка загрузки видео объекта недвижимости', error)
                })
                .finally(() => {
                    setFetchingVideos(false)
                })
        }
    }

    // Обновление счетчика просмотров
    const onUpdateViews = (): void => {
        if (building.id) {
            // UtilService.updateViews('building', building.id)
            //     .then(() => {
            //         setViews(building.views ? building.views + 1 : 1)
            //     })
            //     .catch((error: any) => {
            //         console.error('Ошибка регистрации количества просмотров', error)
            //     })
        }
    }

    const pageTitle = useMemo(() => {
        return !building ? 'Недвижимость' : !building.metaTitle ? building.name : building.metaTitle
    }, [building])

    const showPanels = useMemo((): boolean => {
        // return allowForRole(['director', 'administrator', 'manager']) || allowForTariff(['business', 'effectivePlus'])
        return true
    }, [props.role])

    // Отображение списка связанных статей
    const renderArticlesList = (): React.ReactElement | null => {
        if (!building.articles || !building.articles.length || !articles || !articles.length) {
            return null
        }

        return (
            <div className={classes.relations}>
                <Title type='h2'>Связанные статьи</Title>

                <BlockingElement fetching={fetchingBuilding || fetchingArticles} className={classes.list}>
                    {articles.map((article: IArticle) => {
                        return (
                            <ArticleItem key={article.id}
                                         article={article}
                                         onClick={() => navigate(`/article/${article.id}`)}
                            />
                        )
                    })}
                </BlockingElement>
            </div>
        )
    }

    // Вывод содержимого объекта недвижимости
    const renderBuildingContent = (): React.ReactElement => {
        return (
            <BlockingElement fetching={fetchingBuilding}
                             className={classes.block}
            >
                <Grid>
                    <GridColumn width='60%'>
                        <Gallery alt={building.name}
                                 images={images}
                                 videos={videos}
                                 type='carousel'
                                 fetching={fetchingImages || fetchingVideos}
                                 avatar={building.avatarId}
                                 className={classes.gallery}
                        />
                    </GridColumn>

                    <GridColumn width='40%'>
                        <BuildingInfoBlock building={building}
                                           views={views}
                                           isRent={props.isRent}
                                           onSave={() => onFetchBuilding()}
                        />
                    </GridColumn>
                </Grid>

                <Grid className={classes.info}>
                    <GridColumn width={showPanels ? '68%' : '100%'}>
                        <BuildingDescriptionBlock building={building}/>

                        <BuildingAdvantagesBlock building={building}/>

                        <BuildingAdvancedBlock building={building}/>

                        <BuildingCheckersBlock building={building}/>
                    </GridColumn>

                    {showPanels ?
                        <GridColumn width='30%'>
                            <BuildingDocumentsBlock building={building}/>
                            <BuildingDevelopersBlock building={building}/>
                            <BuildingContactsBlock building={building}/>
                        </GridColumn>
                        : null
                    }
                </Grid>

                {renderArticlesList()}
            </BlockingElement>
        )
    }

    return (
        <DefaultView pageTitle={pageTitle}>
            <Wrapper>
                <div className={classes.inner}>
                    <div className={classes.content}>
                        {building && building.id
                            ? renderBuildingContent()
                            : <Empty message='Объект недвижимости не найден'/>
                        }
                    </div>
                </div>
            </Wrapper>
        </DefaultView>
    )
}

BuildingPage.defaultProps = defaultProps
BuildingPage.displayName = 'BuildingPage'

export default React.memo(BuildingPage)
