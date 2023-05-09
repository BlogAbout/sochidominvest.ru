import React, {useEffect, useState} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import withStore from '../../hoc/withStore'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import {checkRules, Rules} from '../../../helpers/accessHelper'
import BuildingService from '../../../api/BuildingService'
import {IBuilding} from '../../../@types/IBuilding'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import openPopupBuildingCreate from '../PopupBuildingCreate/PopupBuildingCreate'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import Empty from '../../ui/Empty/Empty'
import openContextMenu from '../../ui/ContextMenu/ContextMenu'
import ButtonAdd from '../../form/ButtonAdd/ButtonAdd'
import SearchBox from '../../form/SearchBox/SearchBox'
import CheckBox from '../../form/CheckBox/CheckBox'
import Button from '../../form/Button/Button'
import Title from '../../ui/Title/Title'
import openPopupAlert from '../PopupAlert/PopupAlert'
import classes from './PopupBuildingSelector.module.scss'

interface Props extends PopupProps {
    selected?: number[]
    buttonAdd?: boolean
    multi?: boolean
    onlyRent?: boolean

    onSelect(value: number[]): void

    onAdd?(): void
}

const defaultProps: Props = {
    selected: [],
    buttonAdd: true,
    multi: false,
    onlyRent: false,
    onAdd: () => {
        console.info('PopupBuildingSelector onAdd')
    },
    onSelect: (value: number[]) => {
        console.info('PopupBuildingSelector onSelect', value)
    }
}

const PopupBuildingSelector: React.FC<Props> = (props) => {
    const [isUpdate, setIsUpdate] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterBuilding, setFilterBuilding] = useState<IBuilding[]>([])
    const [selectedBuildings, setSelectedBuildings] = useState<number[]>(props.selected || [])
    const [fetching, setFetching] = useState(false)

    const {fetching: fetchingBuildingList, buildings} = useTypedSelector(state => state.buildingReducer)
    const {fetchBuildingList} = useActions()

    useEffect(() => {
        if (!buildings.length || isUpdate) {
            fetchBuildingList({active: [0, 1]})

            setIsUpdate(false)
        }

        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [isUpdate])

    useEffect(() => {
        search(searchText)
    }, [buildings])

    useEffect(() => {
        setFetching(fetchingBuildingList)
    }, [fetchingBuildingList])

    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    const selectRow = (building: IBuilding) => {
        if (props.multi) {
            selectRowMulti(building)
        } else if (props.onSelect !== null) {
            props.onSelect(building.id ? [building.id] : [0])
            close()
        }
    }

    const selectRowMulti = (building: IBuilding) => {
        if (building.id) {
            if (checkSelected(building.id)) {
                setSelectedBuildings(selectedBuildings.filter((key: number) => key !== building.id))
            } else {
                setSelectedBuildings([...selectedBuildings, building.id])
            }
        }
    }

    const checkSelected = (id: number | null) => {
        return id !== null && selectedBuildings.includes(id)
    }

    const search = (value: string) => {
        setSearchText(value)

        const prepareBuildings = props.onlyRent ? buildings.filter((building: IBuilding) => building.is_rent === 1) : buildings

        if (value.trim() !== '') {
            setFilterBuilding(prepareBuildings.filter((building: IBuilding) => {
                return building.name.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1
            }))
        } else {
            setFilterBuilding(prepareBuildings)
        }
    }

    const onClickAdd = (e: React.MouseEvent) => {
        openPopupBuildingCreate(e.currentTarget, {
            onSave: () => {
                setIsUpdate(true)
            }
        })
    }

    const onClickEdit = (e: React.MouseEvent, building: IBuilding) => {
        openPopupBuildingCreate(e.currentTarget, {
            building: building,
            onSave: () => {
                setIsUpdate(true)
            }
        })
    }

    const onClickSave = () => {
        props.onSelect(selectedBuildings)
        close()
    }

    const onClickDelete = (e: React.MouseEvent, building: IBuilding) => {
        openPopupAlert(e, {
            text: `Вы действительно хотите удалить ${building.name}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        setFetching(true)

                        if (building.id) {
                            BuildingService.removeBuilding(building.id)
                                .then(() => setIsUpdate(true))
                                .catch((error: any) => {
                                    openPopupAlert(document.body, {
                                        title: 'Ошибка!',
                                        text: error.data.message,
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

    const onContextMenu = (e: React.MouseEvent, building: IBuilding) => {
        e.preventDefault()

        const menuItems: any[] = []

        if (checkRules([Rules.ADD_BUILDING]), building.id) {
            menuItems.push({text: 'Редактировать', onClick: (e: React.MouseEvent) => onClickEdit(e, building)})
        }

        if (checkRules([Rules.ADD_BUILDING]), building.id) {
            menuItems.push({text: 'Удалить', onClick: (e: React.MouseEvent) => onClickDelete(e, building)})
        }

        openContextMenu(e, menuItems)
    }

    const renderSearch = () => {
        return (
            <div className={classes['search']}>
                <SearchBox value={searchText}
                           onChange={(value: string) => search(value)}
                           countFind={filterBuilding ? filterBuilding.length : 0}
                           showClear
                           flexGrow
                           autoFocus
                />

                {props.buttonAdd && checkRules([Rules.ADD_BUILDING]) ?
                    <ButtonAdd onClick={onClickAdd.bind(this)}/>
                    : null
                }
            </div>
        )
    }

    const renderListBox = () => {
        return (
            <BlockingElement fetching={fetching} className={classes.list}>
                <div className={classes.listContent}>
                    {filterBuilding.length
                        ? filterBuilding.map((building: IBuilding) => renderRow(building, 'left', checkSelected(building.id)))
                        : <Empty message={
                            !filterBuilding.length ? 'Нет объектов недвижимости' : 'Объекты недвижимости не найдены'
                        }/>
                    }
                </div>
            </BlockingElement>
        )
    }

    const renderSelectedListBox = () => {
        const rows = filterBuilding.filter((building: IBuilding) => checkSelected(building.id))

        return (
            <BlockingElement fetching={fetching} className={classes.list}>
                <div className={classes.listContent}>
                    {rows.length ?
                        rows.map((building: IBuilding) => renderRow(building, 'right', checkSelected(building.id)))
                        : <Empty message='Объекты недвижимости не выбраны'/>
                    }
                </div>
            </BlockingElement>
        )
    }

    const renderRow = (building: IBuilding, side: string, checked: boolean) => {
        return (
            <div className={classes.row}
                 key={building.id}
                 onClick={() => selectRow(building)}
                 onContextMenu={(e: React.MouseEvent) => onContextMenu(e, building)}
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

                <div className={classes.name}>{building.name}</div>

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
        <Popup className={classes.PopupBuildingSelector}>
            <BlockingElement fetching={fetching} className={classes.content}>
                <div className={classes.blockContent}>
                    <Title type='h2'>Выбрать объекты недвижимости</Title>

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

PopupBuildingSelector.defaultProps = defaultProps
PopupBuildingSelector.displayName = 'PopupBuildingSelector'

export default function openPopupBuildingSelector(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true,
        isFixed: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupBuildingSelector), popupProps, undefined, block, displayOptions)
}
