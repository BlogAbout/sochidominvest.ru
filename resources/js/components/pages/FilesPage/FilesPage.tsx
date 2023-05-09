import React, {useEffect, useMemo, useState} from 'react'
import {IFilter, IFilterContent} from '../../../@types/IFilter'
import {IAttachment} from '../../../@types/IAttachment'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {checkRules, Rules} from '../../../helpers/accessHelper'
import {compareText} from '../../../helpers/filterHelper'
import {attachmentTypes} from '../../../helpers/attachmentHelper'
import AttachmentService from '../../../api/AttachmentService'
import Title from '../../ui/Title/Title'
import Wrapper from '../../ui/Wrapper/Wrapper'
import PanelView from '../../views/PanelView/PanelView'
import SidebarLeft from '../../../components/ui/SidebarLeft/SidebarLeft'
import FileList from '../../ui/FileList/FileList'
import FileUploader from '../../../components/ui/FileUploader/FileUploader'
import openContextMenu from '../../ui/ContextMenu/ContextMenu'
import classes from './FilesPage.module.scss'

const FilesPage: React.FC = (): React.ReactElement => {
    const [uploaderType, setUploaderType] = useState<'image' | 'video' | 'document'>('image')
    const [showUploader, setShowUploader] = useState(false)
    const [fetching, setFetching] = useState(false)
    const [files, setFiles] = useState<IAttachment[]>([])
    const [searchText, setSearchText] = useState('')
    const [filterFile, setFilterFile] = useState<IAttachment[]>([])
    const [isShowFilter, setIsShowFilter] = useState(false)
    const [filters, setFilters] = useState({
        type: ['image', 'video', 'document']
    })

    const {user} = useTypedSelector(state => state.userReducer)

    useEffect(() => {
        fetchFilesHandler()
    }, [])

    useEffect(() => {
        search(searchText)
    }, [files, filters])

    const fetchFilesHandler = (): void => {
        setFetching(true)

        const filter: IFilter = {active: [0, 1]}

        if (!checkRules([Rules.IS_MANAGER]) && user.id) {
            filter.author = [user.id]
        }

        AttachmentService.fetchAttachments(filter)
            .then((response: any) => setFiles(response.data.data))
            .catch((error: any) => console.error('Произошла ошибка загрузки данных', error))
            .finally(() => setFetching(false))
    }

    const onSaveHandler = (attachment: IAttachment): void => {
        if (files && files.length) {
            const findIndex = files.findIndex((file: IAttachment) => file.id === attachment.id)

            setFiles([...files.slice(0, findIndex), attachment, ...files.slice(findIndex + 1)])
        }
    }

    const onFullRemove = (attachment: IAttachment): void => {
        if (files && files.length) {
            const findIndex = files.findIndex((file: IAttachment) => file.id === attachment.id)

            setFiles([...files.slice(0, findIndex), ...files.slice(findIndex + 1)])
        }
    }

    // Загрузка файла
    const onUploadFile = (updateAttachments: IAttachment[]): void => {
        setFiles([...updateAttachments, ...files])
    }

    const search = (value: string): void => {
        setSearchText(value)

        if (!files || !files.length) {
            setFilterFile([])
        }

        if (value !== '') {
            setFilterFile(filterItemsHandler(files.filter((file: IAttachment) => {
                return compareText(file.name, value) || (file.description && compareText(file.description, value)) || compareText(file.content, value)
            })))
        } else {
            setFilterFile(filterItemsHandler(files))
        }
    }

    const uploadHandler = (type: 'image' | 'video' | 'document'): void => {
        setUploaderType(type)
        setShowUploader(true)
    }

    const filterItemsHandler = (list: IAttachment[]): IAttachment[] => {
        if (!list || !list.length) {
            return []
        }

        return list.filter((item: IAttachment) => {
            return filters.type.includes(item.type)
        })
    }

    const onContextMenuHandler = (e: React.MouseEvent): void => {
        e.preventDefault()

        const menuItems: any[] = [
            {text: 'Изображения', onClick: () => uploadHandler('image')},
            {text: 'Видео', onClick: () => uploadHandler('video')},
            {text: 'Документы', onClick: () => uploadHandler('document')}
        ]

        openContextMenu(e.currentTarget, menuItems)
    }

    const filtersContent: IFilterContent[] = useMemo((): IFilterContent[] => {
        return [
            {
                title: 'Тип',
                type: 'checker',
                multi: true,
                items: attachmentTypes,
                selected: filters.type,
                onSelect: (values: string[]) => {
                    setFilters({...filters, type: values})
                }
            }
        ]
    }, [filters])

    const renderUploader = (): React.ReactElement => {
        let labelTitle = ''

        switch (uploaderType) {
            case 'image':
                labelTitle = 'Загрузить изображения'
                break
            case 'video':
                labelTitle = 'Загрузить видео'
                break
            case 'document':
                labelTitle = 'Загрузить документы'
                break
        }

        return (
            <div>
                <FileUploader text={labelTitle}
                              type={uploaderType}
                              onChange={onUploadFile.bind(this)}
                              onCancel={() => setShowUploader(false)}
                              showCancel
                              multi
                />
            </div>
        )
    }

    return (
        <PanelView pageTitle='Файловый менеджер'>
            <SidebarLeft filters={filtersContent}
                         isShow={isShowFilter}
                         onChangeShow={(isShow: boolean) => setIsShowFilter(isShow)}
            />

            <Wrapper isFull>
                <Title type='h1'
                       onAdd={onContextMenuHandler.bind(this)}
                       onFilter={() => setIsShowFilter(!isShowFilter)}
                       searchText={searchText}
                       onSearch={search.bind(this)}
                       addText='Загрузить'
                       className={classes.title}
                >Файловый менеджер</Title>

                {showUploader && renderUploader()}

                <FileList files={filterFile}
                          fetching={fetching}
                          onSave={onSaveHandler.bind(this)}
                          onFullRemove={onFullRemove.bind(this)}
                />
            </Wrapper>
        </PanelView>
    )
}

FilesPage.displayName = 'FilesPage'

export default React.memo(FilesPage)
