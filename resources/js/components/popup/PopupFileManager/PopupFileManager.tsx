import React, {useEffect, useState} from 'react'
import withStore from '../../hoc/withStore'
import AttachmentService from '../../../api/AttachmentService'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {IAttachment} from '../../../@types/IAttachment'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import openPopupAlert from '../PopupAlert/PopupAlert'
import {Footer, Popup} from '../Popup/Popup'
import FileList from '../../ui/FileList/FileList'
import Button from '../../form/Button/Button'
import FileUploader from '../../ui/FileUploader/FileUploader'
import SearchBox from '../../form/SearchBox/SearchBox'
import Title from '../../ui/Title/Title'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import classes from './PopupFileManager.module.scss'

interface Props extends PopupProps {
    type: 'image' | 'video' | 'document'
    selected?: number[]
    multi?: boolean

    onSelect(selected: number[], attachments: IAttachment[]): void
}

const defaultProps: Props = {
    type: 'image',
    selected: [],
    multi: false,
    onSelect: (selected: number[], attachments: IAttachment[]) => {
        console.info('PopupFileManager onSelect', selected, attachments)
    }
}

const PopupFileManager: React.FC<Props> = (props) => {
    const [fetching, setFetching] = useState(false)
    const [attachments, setAttachments] = useState<IAttachment[]>([])
    const [filterAttachments, setFilterAttachments] = useState<IAttachment[]>([])
    const [selected, setSelected] = useState<number[]>(props.selected || [])
    const [searchText, setSearchText] = useState('')

    useEffect(() => {
        setFetching(true)

        AttachmentService.fetchAttachments({active: [0, 1], type: props.type})
            .then((response: any) => setAttachments(response.data.data))
            .catch((error: any) => {
                console.error('error', error)

                openPopupAlert(document.body, {
                    title: 'Ошибка!',
                    text: error.data.data
                })
            })
            .finally(() => setFetching(false))

        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [props.blockId])

    useEffect(() => {
        search(searchText)
    }, [attachments])

    // Закрытие popup
    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    // Сохранение выбранных вложений
    const onSaveHandler = () => {
        let selectedAttachments: IAttachment[] = []

        if (selected.length) {
            selectedAttachments = attachments.filter((attachment: IAttachment) => attachment.id && selected.includes(attachment.id))
        }

        props.onSelect(selected, selectedAttachments)
        close()
    }

    // Выбор вложений
    const onSelectHandler = (attachment: IAttachment) => {
        if (attachment.id) {
            if (props.multi) {
                if (selected.includes(attachment.id)) {
                    setSelected(selected.filter((item: number) => item !== attachment.id))
                } else {
                    setSelected([attachment.id, ...selected])
                }
            } else {
                props.onSelect([attachment.id], [attachment])
                close()
            }
        }
    }

    // Загрузка файла
    const onUploadFileHandler = (updateAttachments: IAttachment[]) => {
        setAttachments([...updateAttachments, ...attachments])
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (!attachments || !attachments.length) {
            setFilterAttachments([])
        }

        if (value !== '') {
            setFilterAttachments(attachments.filter((attachment: IAttachment) => {
                return (attachment.name && attachment.name.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1) ||
                    (attachment.description && attachment.description.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1) ||
                    attachment.content.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1
            }))
        } else {
            setFilterAttachments(attachments)
        }
    }

    const onFullRemove = (attachment: IAttachment) => {
        if (attachments && attachments.length) {
            const findIndex = attachments.findIndex((file: IAttachment) => file.id === attachment.id)

            setAttachments([...attachments.slice(0, findIndex), ...attachments.slice(findIndex + 1)])
        }
    }

    return (
        <Popup className={classes.PopupFileManager}>
            <BlockingElement fetching={fetching} className={classes.content}>
                <div className={classes.blockContent}>
                    <Title type='h2'>Файловый менеджер</Title>

                    <div className={classes.uploader}>
                        <FileUploader text='Загрузить'
                                      type={props.type}
                                      onChange={onUploadFileHandler.bind(this)}
                                      multi={props.multi}
                        />

                        <SearchBox value={searchText} onChange={search.bind(this)}/>
                    </div>

                    <FileList files={filterAttachments}
                              selected={selected}
                              fetching={fetching}
                              onSave={() => {
                              }}
                              onSelect={onSelectHandler.bind(this)}
                              onFullRemove={onFullRemove.bind(this)}
                              className={classes.list}
                    />
                </div>
            </BlockingElement>

            <Footer>
                {props.multi ?
                    <Button type='apply'
                            icon='check'
                            onClick={onSaveHandler.bind(this)}
                            disabled={fetching}
                            title='Сохранить'
                    >Сохранить</Button>
                    : null
                }

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

PopupFileManager.defaultProps = defaultProps
PopupFileManager.displayName = 'PopupFileManager'

export default function openPopupFileManager(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true,
        isFixed: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupFileManager), popupProps, undefined, block, displayOptions)
}
