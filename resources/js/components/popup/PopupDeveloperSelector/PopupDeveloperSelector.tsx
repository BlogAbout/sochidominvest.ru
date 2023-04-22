import React, {useEffect, useState} from 'react'
import withStore from '../../hoc/withStore'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {IDeveloper} from '../../../@types/IDeveloper'
import DeveloperService from '../../../api/DeveloperService'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import Empty from '../../ui/Empty/Empty'
import openContextMenu from '../../ui/ContextMenu/ContextMenu'
import openPopupDeveloperCreate from '../PopupDeveloperCreate/PopupDeveloperCreate'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import ButtonAdd from '../../form/ButtonAdd/ButtonAdd'
import SearchBox from '../../form/SearchBox/SearchBox'
import CheckBox from '../../form/CheckBox/CheckBox'
import Button from '../../form/Button/Button'
import Title from '../../ui/Title/Title'
import openPopupAlert from '../PopupAlert/PopupAlert'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import classes from './PopupDeveloperSelector.module.scss'

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
        console.info('PopupDeveloperSelector onAdd')
    },
    onSelect: (value: number[]) => {
        console.info('PopupDeveloperSelector onSelect', value)
    }
}

const PopupDeveloperSelector: React.FC<Props> = (props) => {
    const [isUpdate, setIsUpdate] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterDevelopers, setFilterDevelopers] = useState<IDeveloper[]>([])
    const [selectedDevelopers, setSelectedDevelopers] = useState<number[]>(props.selected || [])
    const [fetching, setFetching] = useState(false)

    const {role} = useTypedSelector(state => state.userReducer)
    const {fetching: fetchingDeveloperList, developers} = useTypedSelector(state => state.developerReducer)

    const {fetchDeveloperList} = useActions()

    useEffect(() => {
        if (!developers.length || isUpdate) {
            fetchDeveloperList({active: [0, 1]})

            setIsUpdate(false)
        }

        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [isUpdate])

    useEffect(() => {
        search(searchText)
    }, [developers])

    useEffect(() => {
        setFetching(fetchingDeveloperList)
    }, [fetchingDeveloperList])

    // Закрытие Popup
    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    // Клик на строку
    const selectRow = (developer: IDeveloper) => {
        if (props.multi) {
            selectRowMulti(developer)
        } else if (props.onSelect !== null) {
            props.onSelect(developer.id ? [developer.id] : [0])
            close()
        }
    }

    // Клик на строку в мульти режиме
    const selectRowMulti = (developer: IDeveloper) => {
        if (developer.id) {
            if (checkSelected(developer.id)) {
                setSelectedDevelopers(selectedDevelopers.filter((key: number) => key !== developer.id))
            } else {
                setSelectedDevelopers([...selectedDevelopers, developer.id])
            }
        }
    }

    // Проверка наличия элемента среди выбранных
    const checkSelected = (id: number | null) => {
        return id !== null && selectedDevelopers.includes(id)
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (value.trim() !== '') {
            setFilterDevelopers(developers.filter((developer: IDeveloper) => {
                return developer.name.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1
            }))
        } else {
            setFilterDevelopers(developers)
        }
    }

    // Добавление нового элемента
    const onClickAdd = () => {
        openPopupDeveloperCreate(document.body, {
            onSave: () => {
                setIsUpdate(true)
            }
        })
    }

    // Редактирование элемента
    const onClickEdit = (e: React.MouseEvent, developer: IDeveloper) => {
        openPopupDeveloperCreate(document.body, {
            developer: developer,
            onSave: () => {
                setIsUpdate(true)
            }
        })
    }

    // Сохранение выбора
    const onClickSave = () => {
        props.onSelect(selectedDevelopers)
        close()
    }

    // Удаление элемента справочника
    const onClickDelete = (e: React.MouseEvent, developer: IDeveloper) => {
        openPopupAlert(e, {
            text: `Вы действительно хотите удалить ${developer.name}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        setFetching(true)

                        if (developer.id) {
                            DeveloperService.removeDeveloper(developer.id)
                                .then(() => {
                                    setFetching(false)
                                    setIsUpdate(true)
                                })
                                .catch((error: any) => {
                                    openPopupAlert(document.body, {
                                        title: 'Ошибка!',
                                        text: error.data.data,
                                        onOk: close.bind(this)
                                    })

                                    setFetching(false)
                                })
                        }
                    }
                },
                {text: 'Отмена'}
            ]
        })
    }

    // Открытие контекстного меню на элементе справочника
    const onContextMenu = (e: React.MouseEvent, developer: IDeveloper) => {
        e.preventDefault()

        if (['director', 'administrator', 'manager'].includes(role)) {
            const menuItems = [{text: 'Редактировать', onClick: (e: React.MouseEvent) => onClickEdit(e, developer)}]

            if (['director', 'administrator'].includes(role)) {
                menuItems.push({text: 'Удалить', onClick: (e: React.MouseEvent) => onClickDelete(e, developer)})
            }

            openContextMenu(e, menuItems)
        }
    }

    const renderSearch = () => {
        return (
            <div className={classes.search}>
                <SearchBox value={searchText}
                           onChange={(value: string) => search(value)}
                           countFind={filterDevelopers ? filterDevelopers.length : 0}
                           showClear
                           flexGrow
                           autoFocus
                />

                {props.buttonAdd && ['director', 'administrator', 'manager'].includes(role) ?
                    <ButtonAdd onClick={onClickAdd.bind(this)}/>
                    : null
                }
            </div>
        )
    }

    const renderListBox = () => {
        return (
            <BlockingElement fetching={false} className={classes.list}>
                <div className={classes.listContent}>
                    {filterDevelopers.length ?
                        filterDevelopers.map((developer: IDeveloper) => renderRow(developer, 'left', checkSelected(developer.id)))
                        : <Empty message={!developers.length ? 'Нет застройщиков' : 'Застройщики не найдены'}/>
                    }
                </div>
            </BlockingElement>
        )
    }

    const renderSelectedListBox = () => {
        const rows = filterDevelopers.filter((developer: IDeveloper) => checkSelected(developer.id))

        return (
            <BlockingElement fetching={false} className={classes.list}>
                <div className={classes.listContent}>
                    {rows.length ?
                        rows.map((developer: IDeveloper) => renderRow(developer, 'right', checkSelected(developer.id)))
                        : <Empty message='Застройщики не выбраны'/>
                    }
                </div>
            </BlockingElement>
        )
    }

    const renderRow = (developer: IDeveloper, side: string, checked: boolean) => {
        return (
            <div className={classes.row}
                 key={developer.id}
                 onClick={() => selectRow(developer)}
                 onContextMenu={(e: React.MouseEvent) => onContextMenu(e, developer)}
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

                <div className={classes.name}>{developer.name}</div>

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
        <Popup className={classes.PopupDeveloperSelector}>
            <BlockingElement fetching={fetching} className={classes.content}>
                <div className={classes.blockContent}>
                    <Title type='h2'>Выбрать застройщика</Title>

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

PopupDeveloperSelector.defaultProps = defaultProps
PopupDeveloperSelector.displayName = 'PopupDeveloperSelector'

export default function openPopupDeveloperSelector(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true,
        isFixed: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupDeveloperSelector), popupProps, undefined, block, displayOptions)
}
