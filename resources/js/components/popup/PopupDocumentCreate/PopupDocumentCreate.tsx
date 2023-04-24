import React, {useEffect, useState} from 'react'
import DocumentService from '../../../api/DocumentService'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {IDocument} from '../../../@types/IDocument'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import openPopupAlert from '../PopupAlert/PopupAlert'
import openPopupFileManager from '../PopupFileManager/PopupFileManager'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import TextBox from '../../form/TextBox/TextBox'
import Button from '../../form/Button/Button'
import CheckBox from '../../form/CheckBox/CheckBox'
import Title from '../../ui/Title/Title'
import Label from '../../form/Label/Label'
import classes from './PopupDocumentCreate.module.scss'

interface Props extends PopupProps {
    document?: IDocument | null
    objectId?: number
    objectType?: string
    type?: 'file' | 'link' | 'constructor'

    onSave(document: IDocument): void
}

const defaultProps: Props = {
    document: null,
    type: 'file',
    onSave: (document: IDocument) => {
        console.info('PopupDocumentCreate onSave', document)
    }
}

const PopupDocumentCreate: React.FC<Props> = (props) => {
    const [documentInfo, setDocumentInfo] = useState<IDocument>(props.document || {
        id: null,
        name: '',
        type: props.type || 'file',
        attachment_id: null,
        object_id: props.objectId || null,
        object_type: props.objectType || null,
        is_active: 1
    })

    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [props.blockId])

    // Закрытие popup
    const close = () => {
        removePopup(props.id || '')
    }

    // Сохранение изменений
    const saveHandler = (isClose?: boolean) => {
        setFetching(true)

        DocumentService.saveDocument(documentInfo)
            .then((response: any) => {
                setFetching(false)
                setDocumentInfo(response.data.data)

                props.onSave(response.data.data)

                if (isClose) {
                    close()
                }
            })
            .catch((error: any) => {
                openPopupAlert(document.body, {
                    title: 'Ошибка!',
                    text: error.data.data
                })

                setFetching(false)
            })
    }

    const checkDisabledButton = () => {
        if (documentInfo.type === 'link' && (!documentInfo.content || documentInfo.content.trim() === '')) {
            return true
        }

        return fetching || documentInfo.name.trim() === ''
    }

    return (
        <Popup className={classes.PopupDocumentCreate}>
            <BlockingElement fetching={fetching} className={classes.content}>
                <div className={classes.blockContent}>
                    <Title type='h2'>Информация о документе</Title>

                    <div className={classes.field}>
                        <Label text='Название'/>

                        <TextBox value={documentInfo.name}
                                 onChange={(value: string) => setDocumentInfo({
                                     ...documentInfo,
                                     name: value
                                 })}
                                 placeHolder='Введите название'
                                 error={documentInfo.name.trim() === ''}
                                 showRequired
                                 errorText='Поле обязательно для заполнения'
                                 styleType='minimal'
                        />
                    </div>

                    {documentInfo.type === 'file' ?
                        <div className={classes.field}>
                            <Label text='Файл'/>

                            <Button type='save'
                                    icon='arrow-pointer'
                                    onClick={() => openPopupFileManager(document.body, {
                                        type: 'document',
                                        selected: documentInfo.attachment_id ? [documentInfo.attachment_id] : [],
                                        onSelect: (selected: number[]) => {
                                            setDocumentInfo({
                                                ...documentInfo,
                                                attachment_id: selected.length ? selected[0] : null
                                            })
                                        }
                                    })}
                                    disabled={fetching}
                            >{documentInfo.attachment_id ? 'Заменить' : 'Выбрать / Загрузить'}</Button>
                        </div>
                        : null
                    }

                    {documentInfo.type === 'link' ?
                        <div className={classes.field}>
                            <Label text='Ссылка'/>

                            <TextBox value={documentInfo.content}
                                     onChange={(value: string) => setDocumentInfo({
                                         ...documentInfo,
                                         content: value
                                     })}
                                     placeHolder='Введите ссылку'
                                     error={!documentInfo.content || documentInfo.content.trim() === ''}
                                     showRequired
                                     errorText='Поле обязательно для заполнения'
                                     styleType='minimal'
                            />
                        </div>
                        : null
                    }

                    <div className={classes.field}>
                        <CheckBox label='Активен'
                                  type='modern'
                                  width={110}
                                  checked={!!documentInfo.is_active}
                                  onChange={(e: React.MouseEvent, value: boolean) => setDocumentInfo({
                                      ...documentInfo,
                                      is_active: value ? 1 : 0
                                  })}
                        />
                    </div>
                </div>
            </BlockingElement>

            <Footer>
                <Button type='save'
                        icon='check-double'
                        onClick={() => saveHandler(true)}
                        disabled={checkDisabledButton()}
                        title='Сохранить и закрыть'
                />

                <Button type='apply'
                        icon='check'
                        onClick={() => saveHandler()}
                        disabled={checkDisabledButton()}
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

PopupDocumentCreate.defaultProps = defaultProps
PopupDocumentCreate.displayName = 'PopupDocumentCreate'

export default function openPopupDocumentCreate(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(PopupDocumentCreate, popupProps, undefined, block, displayOptions)
}
