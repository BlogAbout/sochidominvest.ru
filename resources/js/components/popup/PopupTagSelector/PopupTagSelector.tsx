import React, {useEffect, useState} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import withStore from '../../hoc/withStore'
import {checkRules, Rules} from '../../../helpers/accessHelper'
import TagService from '../../../api/TagService'
import {ITag} from '../../../@types/ITag'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import Empty from '../../ui/Empty/Empty'
import ButtonAdd from '../../form/ButtonAdd/ButtonAdd'
import SearchBox from '../../form/SearchBox/SearchBox'
import CheckBox from '../../form/CheckBox/CheckBox'
import Button from '../../form/Button/Button'
import Title from '../../ui/Title/Title'
import openPopupTagCreate from '../PopupTagCreate/PopupTagCreate'
import openPopupAlert from '../PopupAlert/PopupAlert'
import openContextMenu from '../../ui/ContextMenu/ContextMenu'
import classes from './PopupTagSelector.module.scss'

interface Props extends PopupProps {
    selected?: number[]
    buttonAdd?: boolean
    multi?: boolean

    onSelect(value: number[]): void

    onAdd?(): void
}

const defaultProps: Props = {
    selected: [],
    buttonAdd: true,
    multi: false,
    onAdd: () => {
        console.info('PopupTagSelector onAdd')
    },
    onSelect: (value: number[]) => {
        console.info('PopupTagSelector onSelect', value)
    }
}

const PopupTagSelector: React.FC<Props> = (props) => {
    const [isUpdate, setIsUpdate] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [tagFilter, setTagFilter] = useState<ITag[]>([])
    const [selectedTags, setSelectedTags] = useState<number[]>(props.selected || [])
    const [fetching, setFetching] = useState(false)

    const {fetching: fetchingTagList, tags} = useTypedSelector(state => state.tagReducer)
    const {fetchTagList} = useActions()

    useEffect(() => {
        if (!tags.length || isUpdate) {
            fetchTagList()

            setIsUpdate(false)
        }

        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [isUpdate])

    useEffect(() => {
        search(searchText)
    }, [tags])

    useEffect(() => {
        setFetching(fetchingTagList)
    }, [fetchingTagList])

    const close = (): void => {
        removePopup(props.id ? props.id : '')
    }

    const selectRow = (tag: ITag): void => {
        if (props.multi) {
            selectRowMulti(tag)
        } else if (props.onSelect !== null) {
            props.onSelect(tag.id ? [tag.id] : [0])
            close()
        }
    }

    const selectRowMulti = (tag: ITag): void => {
        if (tag.id) {
            if (checkSelected(tag.id)) {
                setSelectedTags(selectedTags.filter((key: number) => key !== tag.id))
            } else {
                setSelectedTags([...selectedTags, tag.id])
            }
        }
    }

    // Проверка наличия элемента среди выбранных
    const checkSelected = (id: number | null): boolean => {
        return id !== null && selectedTags.includes(id)
    }

    const search = (value: string): void => {
        setSearchText(value)

        if (value.trim() !== '') {
            setTagFilter(tags.filter((tag: ITag) => {
                return tag.name.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1
            }))
        } else {
            setTagFilter(tags)
        }
    }

    const onClickAdd = (e: React.MouseEvent): void => {
        openPopupTagCreate(e.currentTarget, {
            onSave: () => {
                setIsUpdate(true)
            }
        })
    }

    const onClickEdit = (e: React.MouseEvent, tag: ITag): void => {
        openPopupTagCreate(e.currentTarget, {
            tag: tag,
            onSave: () => {
                setIsUpdate(true)
            }
        })
    }

    const onClickSave = (): void => {
        props.onSelect(selectedTags)
        close()
    }

    const onClickDelete = (e: React.MouseEvent, tag: ITag): void => {
        openPopupAlert(e, {
            text: `Вы действительно хотите удалить ${tag.name}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        setFetching(true)

                        if (tag.id) {
                            TagService.removeTag(tag.id)
                                .then(() => setIsUpdate(true))
                                .catch((error: any) => {
                                    openPopupAlert(document.body, {
                                        title: 'Ошибка!',
                                        text: error.data.data,
                                        onOk: close.bind(this)
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

    const onContextMenu = (e: React.MouseEvent, tag: ITag): void => {
        e.preventDefault()

        const menuItems: any[] = []

        if (checkRules([Rules.EDIT_TAG])) {
            menuItems.push({text: 'Редактировать', onClick: (e: React.MouseEvent) => onClickEdit(e, tag)})
        }

        if (checkRules([Rules.REMOVE_TAG])) {
            menuItems.push({text: 'Удалить', onClick: (e: React.MouseEvent) => onClickDelete(e, tag)})
        }

        openContextMenu(e, menuItems)
    }

    const renderSearch = (): React.ReactElement => {
        return (
            <div className={classes.search}>
                <SearchBox value={searchText}
                           onChange={(value: string) => search(value)}
                           countFind={tagFilter ? tagFilter.length : 0}
                           showClear
                           flexGrow
                           autoFocus
                />

                {props.buttonAdd && checkRules([Rules.ADD_TAG]) ?
                    <ButtonAdd onClick={onClickAdd.bind(this)}/>
                    : null
                }
            </div>
        )
    }

    const renderListBox = (): React.ReactElement => {
        return (
            <BlockingElement fetching={fetching} className={classes.list}>
                <div className={classes.listContent}>
                    {tagFilter.length
                        ? tagFilter.map((tag: ITag) => renderRow(tag, 'left', checkSelected(tag.id)))
                        : <Empty message={!tags.length ? 'Нет меток' : 'Метки не найдены'}/>
                    }
                </div>
            </BlockingElement>
        )
    }

    const renderSelectedListBox = (): React.ReactElement => {
        const rows = tagFilter.filter((tag: ITag) => checkSelected(tag.id))

        return (
            <BlockingElement fetching={fetching} className={classes.list}>
                <div className={classes.listContent}>
                    {rows.length ?
                        rows.map((tag: ITag) => renderRow(tag, 'right', checkSelected(tag.id)))
                        : <Empty message='Метки не выбраны'/>
                    }
                </div>
            </BlockingElement>
        )
    }

    const renderRow = (tag: ITag, side: string, checked: boolean): React.ReactElement => {
        return (
            <div className={classes.row}
                 key={tag.id}
                 onClick={() => selectRow(tag)}
                 onContextMenu={(e: React.MouseEvent) => onContextMenu(e, tag)}
            >
                {props.multi && side === 'left' ?
                    <CheckBox type='classic'
                              onChange={e => e}
                              checked={checked}
                              margin='0px 0px 0px 10px'
                              label=''
                    />
                    : null
                }

                {!checked || props.multi ? null :
                    <div className={classes.selected}>
                        <FontAwesomeIcon icon='check'/>
                    </div>
                }

                <div className={classes.name}>{tag.name}</div>

                {props.multi && side === 'right' ?
                    <div className={classes.delete} title='Удалить'>
                        <FontAwesomeIcon icon='xmark'/>
                    </div>
                    : null
                }
            </div>
        )
    }

    return (
        <Popup className={classes.PopupTagSelector}>
            <BlockingElement fetching={fetching} className={classes.content}>
                <div className={classes.blockContent}>
                    <Title type='h2'>Выбрать метки</Title>

                    {renderSearch()}

                    {renderListBox()}

                    {props.multi ? renderSelectedListBox() : null}
                </div>
            </BlockingElement>

            {props.multi ?
                <Footer>
                    <Button type='apply'
                            icon='check'
                            onClick={() => onClickSave()}
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
                :
                null
            }
        </Popup>
    )
}

PopupTagSelector.defaultProps = defaultProps
PopupTagSelector.displayName = 'PopupTagSelector'

export default function openPopupTagSelector(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true,
        isFixed: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupTagSelector), popupProps, undefined, block, displayOptions)
}
