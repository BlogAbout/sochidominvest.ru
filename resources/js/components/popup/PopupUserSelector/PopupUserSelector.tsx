import React, {useEffect, useState} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import withStore from '../../hoc/withStore'
import {checkRules, Rules} from '../../../helpers/accessHelper'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {IUser} from '../../../@types/IUser'
import UserService from '../../../api/UserService'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import Empty from '../../ui/Empty/Empty'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import ButtonAdd from '../../form/ButtonAdd/ButtonAdd'
import SearchBox from '../../form/SearchBox/SearchBox'
import CheckBox from '../../form/CheckBox/CheckBox'
import Button from '../../form/Button/Button'
import Title from '../../ui/Title/Title'
import openPopupAlert from '../PopupAlert/PopupAlert'
import openContextMenu from '../../ui/ContextMenu/ContextMenu'
import openPopupUserCreate from '../PopupUserCreate/PopupUserCreate'
import classes from './PopupUserSelector.module.scss'

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
        console.info('PopupUserSelector onAdd')
    },
    onSelect: (value: number[]) => {
        console.info('PopupUserSelector onSelect', value)
    }
}

const PopupUserSelector: React.FC<Props> = (props) => {
    const [isUpdate, setIsUpdate] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterUsers, setFilterUsers] = useState<IUser[]>([])
    const [selectedUsers, setSelectedUsers] = useState<number[]>(props.selected || [])
    const [fetching, setFetching] = useState(false)

    const {fetching: fetchingUserList, users} = useTypedSelector(state => state.userReducer)
    const {fetchUserList} = useActions()

    useEffect(() => {
        if (!users.length || isUpdate) {
            fetchUserList({active: [0, 1]})

            setIsUpdate(false)
        }

        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [isUpdate])

    useEffect(() => {
        search(searchText)
    }, [users])

    useEffect(() => {
        setFetching(fetchingUserList)
    }, [fetchingUserList])

    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    const selectRow = (user: IUser) => {
        if (props.multi) {
            selectRowMulti(user)
        } else if (props.onSelect !== null) {
            props.onSelect(user.id ? [user.id] : [0])
            close()
        }
    }

    const selectRowMulti = (user: IUser) => {
        if (user.id) {
            if (checkSelected(user.id)) {
                setSelectedUsers(selectedUsers.filter((key: number) => key !== user.id))
            } else {
                setSelectedUsers([...selectedUsers, user.id])
            }
        }
    }

    const checkSelected = (id: number | null) => {
        return id !== null && selectedUsers.includes(id)
    }

    const search = (value: string) => {
        setSearchText(value)

        if (value.trim() !== '') {
            setFilterUsers(users.filter((user: IUser) => {
                return user.name.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1
            }))
        } else {
            setFilterUsers(users)
        }
    }

    const onClickAdd = (e: React.MouseEvent) => {
        openPopupUserCreate(e.currentTarget, {
            onSave: () => {
                setIsUpdate(true)
            }
        })
    }

    const onClickEdit = (e: React.MouseEvent, user: IUser) => {
        openPopupUserCreate(e.currentTarget, {
            user: user,
            onSave: () => {
                setIsUpdate(true)
            }
        })
    }

    const onClickSave = () => {
        props.onSelect(selectedUsers)
        close()
    }

    const onClickDelete = (e: React.MouseEvent, user: IUser) => {
        openPopupAlert(e, {
            text: `Вы действительно хотите удалить ${user.name}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        setFetching(true)

                        if (user.id) {
                            UserService.removeUser(user.id)
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

    const onContextMenu = (e: React.MouseEvent, user: IUser) => {
        e.preventDefault()

        const menuItems: any[] = []

        if (checkRules([Rules.EDIT_USER])) {
            menuItems.push({text: 'Редактировать', onClick: (e: React.MouseEvent) => onClickEdit(e, user)})
        }

        if (checkRules([Rules.REMOVE_USER])) {
            menuItems.push({text: 'Удалить', onClick: (e: React.MouseEvent) => onClickDelete(e, user)})
        }

        openContextMenu(e, menuItems)
    }

    const renderSearch = () => {
        return (
            <div className={classes.search}>
                <SearchBox value={searchText}
                           onChange={(value: string) => search(value)}
                           countFind={filterUsers ? filterUsers.length : 0}
                           showClear
                           flexGrow
                           autoFocus
                />

                {props.buttonAdd && checkRules([Rules.ADD_USER]) ?
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
                    {filterUsers.length
                        ? filterUsers.map((user: IUser) => renderRow(user, 'left', checkSelected(user.id)))
                        : <Empty message={!users.length ? 'Нет пользователей' : 'Пользователи не найдены'}/>
                    }
                </div>
            </BlockingElement>
        )
    }

    const renderSelectedListBox = () => {
        const rows = filterUsers.filter((user: IUser) => checkSelected(user.id))

        return (
            <BlockingElement fetching={fetching} className={classes.list}>
                <div className={classes.listContent}>
                    {rows.length ?
                        rows.map((user: IUser) => renderRow(user, 'right', checkSelected(user.id)))
                        : <Empty message='Пользователи не выбраны'/>
                    }
                </div>
            </BlockingElement>
        )
    }

    const renderRow = (user: IUser, side: string, checked: boolean) => {
        return (
            <div className={classes.row}
                 key={user.id}
                 onClick={() => selectRow(user)}
                 onContextMenu={(e: React.MouseEvent) => onContextMenu(e, user)}
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

                <div className={classes.name}>{user.name}</div>

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
        <Popup className={classes.PopupUserSelector}>
            <BlockingElement fetching={fetching} className={classes.content}>
                <div className={classes.blockContent}>
                    <Title type='h2'>Выбрать пользователей</Title>

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

PopupUserSelector.defaultProps = defaultProps
PopupUserSelector.displayName = 'PopupUserSelector'

export default function openPopupUserSelector(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true,
        isFixed: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupUserSelector), popupProps, undefined, block, displayOptions)
}
