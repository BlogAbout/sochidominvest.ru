import React, {useEffect, useState} from 'react'
import withStore from '../../hoc/withStore'
import classNames from 'classnames/bind'
import ArticleService from '../../../api/ArticleService'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {IArticle} from '../../../@types/IArticle'
import {IAttachment} from '../../../@types/IAttachment'
import {IBuilding} from '../../../@types/IBuilding'
import {articleTypes} from '../../../helpers/articleHelper'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import openPopupAlert from '../../popup/PopupAlert/PopupAlert'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import TextBox from '../../form/TextBox/TextBox'
import Button from '../../form/Button/Button'
import CheckBox from '../../form/CheckBox/CheckBox'
import TextAreaBox from '../../form/TextAreaBox/TextAreaBox'
import ComboBox from '../../form/ComboBox/ComboBox'
import BuildingBox from '../../form/BuildingBox/BuildingBox'
import FileList from '../../ui/FileList/FileList'
import Title from '../../ui/Title/Title'
import Label from '../../form/Label/Label'
import openPopupFileManager from '../PopupFileManager/PopupFileManager'
import {sortAttachments} from '../../../helpers/attachmentHelper'
import classes from './PopupArticleCreate.module.scss'

interface Props extends PopupProps {
    article?: IArticle | null

    onSave(): void
}

const defaultProps: Props = {
    article: null,
    onSave: () => {
        console.info('PopupArticleCreate onSave')
    }
}

const cx = classNames.bind(classes)

const PopupArticleCreate: React.FC<Props> = (props) => {
    const [article, setArticle] = useState<IArticle>({
        id: null,
        name: '',
        description: '',
        type: 'article',
        is_active: 1,
        is_publish: 0,
        image_ids: [],
        video_ids: [],
        building_ids: []
    })

    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [props.blockId])

    useEffect(() => {
        if (props.article) {
            onUpdateArticleData(props.article)
        }
    }, [props.article])

    useEffect(() => {
        if (article.images && article.images.length) {
            checkAvatar()
        }
    }, [article.image_ids])

    const onUpdateArticleData = (articleData: IArticle) => {
        const image_ids: number[] = []
        const video_ids: number[] = []
        const building_ids: number[] = []

        if (articleData.images && articleData.images.length) {
            articleData.images.map((image: IAttachment) => {
                if (image.id) {
                    image_ids.push(image.id)
                }
            })
        }

        if (articleData.videos && articleData.videos.length) {
            articleData.videos.map((video: IAttachment) => {
                if (video.id) {
                    video_ids.push(video.id)
                }
            })
        }

        if (articleData.buildings && articleData.buildings.length) {
            articleData.buildings.map((building: IBuilding) => {
                if (building.id) {
                    building_ids.push(building.id)
                }
            })
        }

        setArticle({
            ...articleData,
            image_ids: image_ids,
            video_ids: video_ids,
            building_ids: building_ids
        })
    }

    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    const saveHandler = (isClose?: boolean) => {
        setFetching(true)

        ArticleService.saveArticle(article)
            .then((response: any) => {
                onUpdateArticleData(response.data.data)

                props.onSave()

                if (isClose) {
                    close()
                }
            })
            .catch((error: any) => {
                openPopupAlert(document.body, {
                    title: 'Ошибка!',
                    text: error.data.message
                })
            })
            .finally(() => setFetching(false))
    }

    // Добавление файла
    const addAttachmentHandler = (attachment: IAttachment) => {
        if (attachment.id) {
            switch (attachment.type) {
                case 'image':
                    const image_ids = article.image_ids ? [...article.image_ids] : []
                    const images = article.images ? [...article.images] : []
                    setArticle({
                        ...article,
                        image_ids: [attachment.id, ...image_ids],
                        images: [attachment, ...images]
                    })
                    break
                case 'video':
                    const video_ids = article.video_ids ? [...article.video_ids] : []
                    const videos = article.videos ? [...article.videos] : []
                    setArticle({
                        ...article,
                        video_ids: [attachment.id, ...video_ids],
                        videos: [attachment, ...videos]
                    })
                    break
            }
        }
    }

    // Смена главного изображения
    const selectImageAvatarHandler = (attachment: IAttachment) => {
        setArticle({...article, avatar_id: attachment.id, avatar: attachment})
    }

    // Проверка наличия главного изображения
    const checkAvatar = () => {
        if (article.image_ids && article.image_ids.length && article.images && article.images.length) {
            if (!article.avatar_id || !article.image_ids.includes(article.avatar_id)) {
                selectImageAvatarHandler(article.images[0])
            }
        } else {
            setArticle({...article, avatar_id: null, avatar: null})
        }
    }

    const onUpdateOrderingImagesHandler = (files: IAttachment[]) => {
        const ids: number[] = []
        files.forEach((attachment: IAttachment) => {
            if (attachment.id) {
                ids.push(attachment.id)
            }
        })
        setArticle({...article, image_ids: ids, images: sortAttachments(files, ids)})
    }

    const removeSelectedImageHandler = (file: IAttachment) => {
        setArticle({
            ...article,
            image_ids: article.image_ids ? article.image_ids.filter((id: number) => id !== file.id) : [],
            images: article.images ? article.images.filter((attachment: IAttachment) => attachment.id !== file.id) : []
        })
    }

    const renderContentBlock = () => {
        return (
            <div key='content' className={classes.blockContent}>
                <Title type='h2'>Информация о статье</Title>

                <div className={classes.field}>
                    <Label text='Название'/>

                    <TextBox value={article.name}
                             onChange={(value: string) => setArticle({
                                 ...article,
                                 name: value
                             })}
                             placeHolder='Введите название'
                             error={!article.name || article.name.trim() === ''}
                             showRequired
                             errorText='Поле обязательно для заполнения'
                             styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Тип'/>

                    <ComboBox selected={article.type}
                              items={articleTypes}
                              onSelect={(value: string) => setArticle({...article, type: value})}
                              placeHolder='Выберите тип'
                              styleType='minimal'
                    />
                </div>

                <div className={cx({'field': true, 'fieldWrap': true})}>
                    <Label text='Описание'/>

                    <TextAreaBox value={article.description}
                                 onChange={(value: string) => setArticle({
                                     ...article,
                                     description: value
                                 })}
                                 placeHolder='Введите текст статьи'
                                 isVisual={true}
                                 width='100%'
                    />
                </div>

                <div className={classes.field}>
                    <CheckBox label='Публичный'
                              type='modern'
                              width={110}
                              checked={!!article.is_publish}
                              onChange={(e: React.MouseEvent, value: boolean) => setArticle({
                                  ...article,
                                  is_publish: value ? 1 : 0
                              })}
                    />
                </div>

                <div className={classes.field}>
                    <CheckBox label='Активен'
                              type='modern'
                              width={110}
                              checked={!!article.is_active}
                              onChange={(e: React.MouseEvent, value: boolean) => setArticle({
                                  ...article,
                                  is_active: value ? 1 : 0
                              })}
                    />
                </div>
            </div>
        )
    }

    // Вкладка галереи
    const renderGalleryBlock = () => {
        return (
            <div key='gallery' className={classes.blockContent}>
                <Title type='h2'>Медиа</Title>

                <div className={cx({'field': true, 'fieldWrap': true})}>
                    <Label text='Фотогалерея'/>

                    <Button type='save'
                            icon='arrow-pointer'
                            onClick={() => openPopupFileManager(document.body, {
                                type: 'image',
                                selected: article.image_ids || [],
                                onSelect: (selected: number[], attachments: IAttachment[]) => {
                                    setArticle({
                                        ...article,
                                        image_ids: selected,
                                        images: attachments
                                    })
                                },
                                multi: true
                            })}
                            disabled={fetching}
                    >Выбрать / Загрузить</Button>

                    <FileList files={article.images || []}
                              selected={article.avatar_id ? [article.avatar_id] : []}
                              fetching={fetching}
                              onSave={addAttachmentHandler.bind(this)}
                              onSelect={selectImageAvatarHandler.bind(this)}
                              onRemove={removeSelectedImageHandler.bind(this)}
                              onUpdateOrdering={onUpdateOrderingImagesHandler.bind(this)}
                              isOnlyList
                    />
                </div>
            </div>
        )
    }

    const renderRelationBlock = () => {
        return (
            <div key='relation' className={classes.blockContent}>
                <Title type='h2'>Связи</Title>

                <div className={classes.field}>
                    <Label text='Недвижимость'/>

                    <BuildingBox buildings={article.building_ids || []}
                                 onSelect={(value: number[]) => setArticle({...article, building_ids: value})}
                                 placeHolder='Выберите объекты недвижимости'
                                 styleType='minimal'
                                 multi
                    />
                </div>
            </div>
        )
    }

    const renderSeoBlock = () => {
        return (
            <div key='seo' className={classes.blockContent}>
                <Title type='h2'>СЕО</Title>

                <div className={classes.field}>
                    <Label text='Meta Title'/>

                    <TextBox value={article.meta_title || ''}
                             onChange={(value: string) => setArticle({
                                 ...article,
                                 meta_title: value
                             })}
                             placeHolder='Введите Meta Title'
                             styleType='minimal'
                    />
                </div>

                <div className={cx({'field': true, 'fieldWrap': true})}>
                    <Label text='Meta Description'/>

                    <TextAreaBox value={article.meta_description || ''}
                                 onChange={(value: string) => setArticle({
                                     ...article,
                                     meta_description: value
                                 })}
                                 placeHolder='Введите Meta Description'
                                 width='100%'
                    />
                </div>
            </div>
        )
    }

    return (
        <Popup className={classes.PopupArticleCreate}>
            <BlockingElement fetching={fetching} className={classes.content}>
                {renderContentBlock()}
                {renderGalleryBlock()}
                {renderRelationBlock()}
                {renderSeoBlock()}
            </BlockingElement>

            <Footer>
                <Button type='save'
                        icon='check-double'
                        onClick={() => saveHandler(true)}
                        disabled={fetching || article.name.trim() === '' || article.description.trim() === ''}
                        title='Сохранить и закрыть'
                />

                <Button type='apply'
                        icon='check'
                        onClick={() => saveHandler()}
                        disabled={fetching || article.name.trim() === '' || article.description.trim() === ''}
                        className='marginLeft'
                        title='Сохранить'
                >Сохранить</Button>

                <Button type='regular'
                        icon='arrow-rotate-left'
                        onClick={close.bind(this)}
                        className='marginLeft'
                        title='Отменить'
                >Отменить</Button>
            </Footer>
        </Popup>
    )
}

PopupArticleCreate.defaultProps = defaultProps
PopupArticleCreate.displayName = 'PopupArticleCreate'

export default function openPopupArticleCreate(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupArticleCreate), popupProps, undefined, block, displayOptions)
}
