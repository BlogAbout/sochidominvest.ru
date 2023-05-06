import React, {useEffect, useState} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import withStore from '../../hoc/withStore'
import CompilationService from '../../../api/CompilationService'
import {ICompilation} from '../../../@types/ICompilation'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
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
import openPopupCompilationCreate from '../PopupCompilationCreate/PopupCompilationCreate'
import classes from './PopupCompilationSelector.module.scss'
import {checkRules, Rules} from "../../../helpers/accessHelper";

interface Props extends PopupProps {
    exclude?: number[]
    selected?: number[]
    buttonAdd?: boolean
    multi?: boolean

    onSelect(compilation: ICompilation[]): void

    onAdd?(): void
}

const defaultProps: Props = {
    exclude: [],
    selected: [],
    buttonAdd: true,
    multi: false,
    onAdd: () => {
        console.info('PopupCompilationSelector onAdd')
    },
    onSelect: (compilation: ICompilation[]) => {
        console.info('PopupCompilationSelector onSelect', compilation)
    }
}

const PopupCompilationSelector: React.FC<Props> = (props) => {
    const [isUpdate, setIsUpdate] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterCompilation, setFilterCompilation] = useState<ICompilation[]>([])
    const [selectedCompilations, setSelectedCompilations] = useState<number[]>(props.selected || [])
    const [fetching, setFetching] = useState(false)

    const {fetching: fetchingCompilationList, compilations} = useTypedSelector(state => state.compilationReducer)
    const {fetchCompilationList} = useActions()

    useEffect(() => {
        if (!compilations.length || isUpdate) {
            fetchCompilationList()

            setIsUpdate(false)
        }

        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [isUpdate])

    useEffect(() => {
        search(searchText)
    }, [compilations])

    useEffect(() => {
        setFetching(fetchingCompilationList)
    }, [fetchingCompilationList])

    const close = (): void => {
        removePopup(props.id ? props.id : '')
    }

    const selectRow = (compilation: ICompilation): void => {
        if (props.multi) {
            selectRowMulti(compilation)
        } else if (props.onSelect !== null) {
            props.onSelect(compilation.id ? [compilation] : [])
            close()
        }
    }

    const selectRowMulti = (compilation: ICompilation): void => {
        if (compilation.id) {
            if (checkSelected(compilation.id)) {
                setSelectedCompilations(selectedCompilations.filter((key: number) => key !== compilation.id))
            } else {
                setSelectedCompilations([...selectedCompilations, compilation.id])
            }
        }
    }

    const checkSelected = (id: number | null): boolean => {
        return id !== null && selectedCompilations.includes(id)
    }

    const search = (value: string): void => {
        setSearchText(value)

        if (value.trim() !== '') {
            setFilterCompilation(compilations.filter((compilation: ICompilation) => {
                return compilation.name.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1 && (!compilation.id || !props.exclude || !props.exclude.length || !props.exclude.includes(compilation.id))
            }))
        } else {
            setFilterCompilation(compilations.filter((compilation: ICompilation) => !compilation.id || (props.exclude && !props.exclude.includes(compilation.id))))
        }
    }

    const onClickAdd = (): void => {
        openPopupCompilationCreate(document.body, {
            onSave: () => {
                setIsUpdate(true)
            }
        })
    }

    const onClickEdit = (compilation: ICompilation): void => {
        openPopupCompilationCreate(document.body, {
            compilation: compilation,
            onSave: () => {
                setIsUpdate(true)
            }
        })
    }

    const onClickSave = (): void => {
        props.onSelect(compilations.filter((compilation: ICompilation) => compilation.id && selectedCompilations.includes(compilation.id)))
        close()
    }

    const onClickDelete = (compilation: ICompilation): void => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить ${compilation.name}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        setFetching(true)

                        if (compilation.id) {
                            CompilationService.removeCompilation(compilation.id)
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

    const onContextMenu = (e: React.MouseEvent, compilation: ICompilation): void => {
        e.preventDefault()

        const menuItems: any[] = []

        if (checkRules([Rules.EDIT_COMPILATION])) {
            menuItems.push({text: 'Редактировать', onClick: () => onClickEdit(compilation)})
        }

        if (checkRules([Rules.REMOVE_COMPILATION])) {
            menuItems.push({text: 'Редактировать', onClick: () => onClickDelete(compilation)})
        }

        openContextMenu(e, menuItems)
    }

    const renderSearch = (): React.ReactElement => {
        return (
            <div className={classes.search}>
                <SearchBox value={searchText}
                           onChange={(value: string) => search(value)}
                           countFind={filterCompilation ? filterCompilation.length : 0}
                           showClear
                           flexGrow
                           autoFocus
                />

                {props.buttonAdd && checkRules([Rules.ADD_COMPILATION]) ?
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
                    {filterCompilation.length
                        ? filterCompilation.map((compilation: ICompilation) => renderRow(compilation, 'left', checkSelected(compilation.id)))
                        : <Empty message={!compilations.length ? 'Нет подборок' : 'Подборки не найдены'}/>
                    }
                </div>
            </BlockingElement>
        )
    }

    const renderSelectedListBox = (): React.ReactElement => {
        const rows = filterCompilation.filter((compilation: ICompilation) => checkSelected(compilation.id))

        return (
            <BlockingElement fetching={fetching} className={classes.list}>
                <div className={classes.listContent}>
                    {rows.length ?
                        rows.map((compilation: ICompilation) => renderRow(compilation, 'right', checkSelected(compilation.id)))
                        : <Empty message='Подборки не выбраны'/>
                    }
                </div>
            </BlockingElement>
        )
    }

    const renderRow = (compilation: ICompilation, side: string, checked: boolean): React.ReactElement => {
        return (
            <div className={classes.row}
                 key={compilation.id}
                 onClick={() => selectRow(compilation)}
                 onContextMenu={(e: React.MouseEvent) => onContextMenu(e, compilation)}
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

                <div className={classes.name}>{compilation.name}</div>

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
        <Popup className={classes.PopupCompilationSelector}>
            <BlockingElement fetching={fetching} className={classes.content}>
                <div className={classes.blockContent}>
                    <Title type='h2'>Выбрать подборки</Title>

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

PopupCompilationSelector.defaultProps = defaultProps
PopupCompilationSelector.displayName = 'PopupCompilationSelector'

export default function openPopupCompilationSelector(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true,
        isFixed: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupCompilationSelector), popupProps, undefined, block, displayOptions)
}
