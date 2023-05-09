import React, {useEffect, useState} from 'react'
import withStore from '../../hoc/withStore'
import classNames from 'classnames/bind'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import StoreService from '../../../api/StoreService'
import {sortAttachments} from '../../../helpers/attachmentHelper'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import {getFieldTypeChildren, getFieldTypeText} from '../../../helpers/storeHelper'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {ICategory, IProduct} from '../../../@types/IStore'
import {ITab} from '../../../@types/ITab'
import {IAttachment} from '../../../@types/IAttachment'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import TextBox from '../../form/TextBox/TextBox'
import NumberBox from '../../form/NumberBox/NumberBox'
import Button from '../../form/Button/Button'
import CheckBox from '../../form/CheckBox/CheckBox'
import Tabs from '../../ui/Tabs/Tabs'
import TextAreaBox from '../../form/TextAreaBox/TextAreaBox'
import FileList from '../../ui/FileList/FileList'
import CategoryBox from '../../form/CategoryBox/CategoryBox'
import Title from '../../ui/Title/Title'
import Label from '../../form/Label/Label'
import ComboBox from '../../form/ComboBox/ComboBox'
import openPopupAlert from '../PopupAlert/PopupAlert'
import openPopupFileManager from '../PopupFileManager/PopupFileManager'
import classes from './PopupProductCreate.module.scss'

interface Props extends PopupProps {
    product?: IProduct | null

    onSave(): void
}

const defaultProps: Props = {
    product: null,
    onSave: () => {
        console.info('PopupProductCreate onSave')
    }
}

const cx = classNames.bind(classes)

const PopupProductCreate: React.FC<Props> = (props) => {
    const [product, setProduct] = useState<IProduct>(props.product ? JSON.parse(JSON.stringify(props.product)) : {
        id: null,
        category_id: 0,
        name: '',
        cost: 0,
        is_active: 1,
        image_ids: [],
        video_ids: [],
        fields: {}
    })

    const [fetchingProduct, setFetchingProduct] = useState(false)

    const {categories} = useTypedSelector(state => state.storeReducer)

    useEffect(() => {
        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [props.blockId])

    useEffect(() => {
        if (product.images && product.images.length) {
            checkAvatar()
        }
    }, [product.images])

    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    const saveHandler = (isClose?: boolean) => {
        if (product.name.trim() === '' || !product.category_id) {
            return
        }

        setFetchingProduct(true)

        StoreService.saveProduct(product)
            .then((response: any) => {
                setProduct(response.data.data)

                props.onSave()

                if (isClose) {
                    close()
                }
            })
            .catch((error: any) => {
                console.error('error', error)
                openPopupAlert(document.body, {
                    title: 'Ошибка!',
                    text: error.data.message
                })
            })
            .finally(() => setFetchingProduct(false))
    }

    const addAttachmentHandler = (attachment: IAttachment) => {
        if (attachment.id) {
            switch (attachment.type) {
                case 'image':
                    const image_ids: number[] = product.image_ids ? [...product.image_ids] : []
                    const images: IAttachment[] = product.images ? [...product.images] : []
                    setProduct({
                        ...product,
                        image_ids: [attachment.id, ...image_ids],
                        images: [attachment, ...images]
                    })
                    break
                case 'video':
                    const video_ids: number[] = product.video_ids ? [...product.video_ids] : []
                    const videos: IAttachment[] = product.videos ? [...product.videos] : []
                    setProduct({
                        ...product,
                        video_ids: [attachment.id, ...video_ids],
                        videos: [attachment, ...videos]
                    })
                    break
            }
        }
    }

    const selectImageAvatarHandler = (attachment: IAttachment) => {
        setProduct({...product, avatar_id: attachment.id, avatar: attachment})
    }

    const checkAvatar = () => {
        if (product.images && product.images.length && product.image_ids && product.image_ids.length) {
            if (!product.avatar_id || !product.image_ids.includes(product.avatar_id)) {
                selectImageAvatarHandler(product.images[0])
            }
        } else {
            setProduct({...product, avatar_id: null, avatar: null})
        }
    }

    const isDisableButton = () => {
        return fetchingProduct || product.name.trim() === '' || !product.category_id
    }

    const onUpdateOrderingImagesHandler = (files: IAttachment[]) => {
        const ids: number[] = []
        files.forEach((attachment: IAttachment) => {
            if (attachment.id) {
                ids.push(attachment.id)
            }
        })
        setProduct({...product, image_ids: ids, images: sortAttachments(files, ids)})
    }

    const onUpdateOrderingVideosHandler = (files: IAttachment[]) => {
        const ids: number[] = []
        files.forEach((attachment: IAttachment) => {
            if (attachment.id) {
                ids.push(attachment.id)
            }
        })
        setProduct({...product, video_ids: ids, videos: sortAttachments(files, ids)})
    }

    const removeSelectedImageHandler = (file: IAttachment) => {
        if (file.id) {
            const image_ids: number[] = product.image_ids ? product.image_ids.filter((id: number) => id !== file.id) : []
            const images: IAttachment[] = product.images ? [...product.images.filter((attachment: IAttachment) => attachment.id !== file.id)] : []
            setProduct({
                ...product,
                image_ids: image_ids,
                images: images
            })
        }
    }

    const removeSelectedVideoHandler = (file: IAttachment) => {
        if (file.id) {
            const video_ids: number[] = product.video_ids ? product.video_ids.filter((id: number) => id !== file.id) : []
            const videos: IAttachment[] = product.videos ? [...product.videos.filter((attachment: IAttachment) => attachment.id !== file.id)] : []
            setProduct({
                ...product,
                video_ids: video_ids,
                videos: videos
            })
        }
    }

    const renderField = (fieldName: string): React.ReactElement | null => {
        const fieldValue = product.fields[fieldName] ? product.fields[fieldName] : ''

        switch (fieldName) {
            case 'length':
            case 'width':
            case 'height':
            case 'depth':
            case 'diameter':
                return (
                    <div key={fieldName} className={classes.field}>
                        <Label text={getFieldTypeText(fieldName)}/>

                        <NumberBox value={fieldValue || ''}
                                   min={0}
                                   step={0.01}
                                   max={999999999}
                                   countAfterComma={2}
                                   onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setProduct({
                                       ...product,
                                       fields: {...product.fields, [fieldName]: value}
                                   })}
                                   styleType='minimal'
                        />
                    </div>
                )
            case 'material':
                return (
                    <div key={fieldName} className={classes.field}>
                        <Label text={getFieldTypeText(fieldName)}/>

                        <ComboBox selected={fieldValue ? fieldValue.toString() : ''}
                                  items={getFieldTypeChildren(fieldName)}
                                  onSelect={(value: string) => setProduct({
                                      ...product,
                                      fields: {...product.fields, [fieldName.toString()]: value}
                                  })}
                                  placeHolder={`Выберите ${getFieldTypeText(fieldName)}`}
                                  styleType='minimal'
                        />
                    </div>
                )
        }

        return null
    }

    const renderStateTab = () => {
        return (
            <div key='state' className={classes.tabContent}>
                <div className={classes.field}>
                    <Label text='Название'/>

                    <TextBox value={product.name}
                             onChange={(value: string) => setProduct({
                                 ...product,
                                 name: value
                             })}
                             placeHolder='Введите название'
                             error={product.name.trim() === ''}
                             showRequired
                             errorText='Поле обязательно для заполнения'
                             styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Категория'/>

                    <CategoryBox categories={product.category_id ? [product.category_id] : []}
                                 onSelect={(value: number[], e: React.MouseEvent) => setProduct({
                                     ...product,
                                     category_id: value.length ? value[0] : 0
                                 })}
                                 placeHolder='Выберите категорию'
                                 error={!product.category_id}
                                 showRequired
                                 errorText='Поле обязательно для заполнения'
                                 styleType='minimal'
                    />
                </div>

                <div className={cx({'field': true, 'fieldWrap': true})}>
                    <Label text='Описание'/>

                    <TextAreaBox value={product.description}
                                 onChange={(value: string) => setProduct({
                                     ...product,
                                     description: value
                                 })}
                                 placeHolder='Введите описание товара'
                                 isVisual={true}
                                 width='100%'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Цена, руб.'/>

                    <NumberBox value={product.cost || ''}
                               min={0}
                               step={0.01}
                               max={999999999}
                               countAfterComma={2}
                               onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setProduct({
                                   ...product,
                                   cost: value
                               })}
                               placeHolder='Введите стоимость товара'
                               styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Старая цена, руб.'/>

                    <NumberBox value={product.cost_old || ''}
                               min={0}
                               step={0.01}
                               max={999999999}
                               countAfterComma={2}
                               onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setProduct({
                                   ...product,
                                   cost_old: value
                               })}
                               placeHolder='Введите старую стоимость товара'
                               styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <CheckBox label='Активен'
                              type='modern'
                              width={110}
                              checked={!!product.is_active}
                              onChange={(e: React.MouseEvent, value: boolean) => setProduct({
                                  ...product,
                                  is_active: value ? 1 : 0
                              })}
                    />
                </div>
            </div>
        )
    }

    const renderInformationTab = (): React.ReactElement | null => {
        if (!categories || !categories.length || !product.category_id) {
            return null
        }

        const category = categories.find((category: ICategory) => category.id === product.category_id)
        if (!category || !category.fields || !category.fields.length) {
            return null
        }

        return (
            <div key='info' className={classes.tabContent}>
                {category.fields.map((fieldName: string) => renderField(fieldName))}
            </div>
        )
    }

    const renderMediaTab = () => {
        return (
            <div key='media' className={classes.tabContent}>
                <div className={cx({'field': true, 'fieldWrap': true})}>
                    <Label text='Фотогалерея'/>

                    <Button type='save'
                            icon='arrow-pointer'
                            onClick={() => openPopupFileManager(document.body, {
                                type: 'image',
                                selected: product.image_ids || [],
                                onSelect: (selected: number[], attachments: IAttachment[]) => {
                                    setProduct({...product, image_ids: selected, images: attachments})
                                },
                                multi: true
                            })}
                            disabled={isDisableButton()}
                    >Выбрать / Загрузить</Button>

                    <FileList files={product.images || []}
                              selected={product.avatar_id ? [product.avatar_id] : []}
                              fetching={fetchingProduct}
                              onSave={addAttachmentHandler.bind(this)}
                              onSelect={selectImageAvatarHandler.bind(this)}
                              onRemove={removeSelectedImageHandler.bind(this)}
                              onUpdateOrdering={onUpdateOrderingImagesHandler.bind(this)}
                              isOnlyList={true}
                    />
                </div>

                <div className={cx({'field': true, 'fieldWrap': true})}>
                    <Label text='Видео'/>

                    <Button type='save'
                            icon='arrow-pointer'
                            onClick={() => openPopupFileManager(document.body, {
                                type: 'video',
                                selected: product.video_ids || [],
                                onSelect: (selected: number[], attachments: IAttachment[]) => {
                                    setProduct({...product, video_ids: selected, videos: attachments})
                                },
                                multi: true
                            })}
                            disabled={isDisableButton()}
                    >Выбрать / Загрузить</Button>

                    <FileList files={product.videos || []}
                              fetching={fetchingProduct}
                              onSave={addAttachmentHandler.bind(this)}
                              onSelect={selectImageAvatarHandler.bind(this)}
                              onRemove={removeSelectedVideoHandler.bind(this)}
                              onUpdateOrdering={onUpdateOrderingVideosHandler.bind(this)}
                              isOnlyList={true}
                    />
                </div>
            </div>
        )
    }

    const renderSeoTab = () => {
        return (
            <div key='seo' className={classes.tabContent}>
                <div>
                    <div className={classes.field}>
                        <Label text='Meta Title'/>

                        <TextBox value={product.meta_title}
                                 onChange={(value: string) => setProduct({
                                     ...product,
                                     meta_title: value
                                 })}
                                 placeHolder='Введите Meta Title'
                                 styleType='minimal'
                        />
                    </div>

                    <div className={cx({'field': true, 'fieldWrap': true})}>
                        <Label text='Meta Description'/>

                        <TextAreaBox value={product.meta_description || ''}
                                     onChange={(value: string) => setProduct({
                                         ...product,
                                         meta_description: value
                                     })}
                                     placeHolder='Введите Meta Description'
                                     width='100%'
                        />
                    </div>
                </div>
            </div>
        )
    }

    const tabs: ITab = {
        state: {
            title: 'Состояние',
            render: renderStateTab()
        },
        info: {
            title: 'Информация',
            render: renderInformationTab()
        },
        media: {
            title: 'Медиа',
            render: renderMediaTab()
        },
        seo: {
            title: 'СЕО',
            render: renderSeoTab()
        }
    }

    return (
        <Popup className={classes.PopupProductCreate}>
            <BlockingElement fetching={fetchingProduct} className={classes.content}>
                <div className={classes.blockContent}>
                    <Title type='h2'>{product.id ? 'Редактировать товар' : 'Новый товар'}</Title>

                    <Tabs tabs={tabs} paddingFirstTab='popup'/>
                </div>
            </BlockingElement>

            <Footer>
                <Button type='save'
                        icon='check-double'
                        onClick={() => saveHandler(true)}
                        disabled={isDisableButton()}
                        title='Сохранить и закрыть'
                />

                <Button type='apply'
                        icon='check'
                        onClick={() => saveHandler()}
                        disabled={isDisableButton()}
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

PopupProductCreate.defaultProps = defaultProps
PopupProductCreate.displayName = 'PopupProductCreate'

export default function openPopupProductCreate(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true,
        isFixed: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupProductCreate), popupProps, undefined, block, displayOptions)
}
