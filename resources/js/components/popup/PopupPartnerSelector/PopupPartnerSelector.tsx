import React, {useEffect, useState} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import withStore from '../../hoc/withStore'
import PartnerService from '../../../api/PartnerService'
import {IPartner} from '../../../@types/IPartner'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import openPopupPartnerCreate from '../PopupPartnerCreate/PopupPartnerCreate'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import Empty from '../../ui/Empty/Empty'
import SearchBox from '../../form/SearchBox/SearchBox'
import CheckBox from '../../form/CheckBox/CheckBox'
import Button from '../../form/Button/Button'
import Title from '../../ui/Title/Title'
import openPopupAlert from '../PopupAlert/PopupAlert'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import classes from './PopupPartnerSelector.module.scss'
import {checkRules, Rules} from '../../../helpers/accessHelper'
import openContextMenu from '../../ui/ContextMenu/ContextMenu'
import ButtonAdd from '../../form/ButtonAdd/ButtonAdd'

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
        console.info('PopupPartnerSelector onAdd')
    },
    onSelect: (value: number[]) => {
        console.info('PopupPartnerSelector onSelect', value)
    }
}

const PopupPartnerSelector: React.FC<Props> = (props) => {
    const [isUpdate, setIsUpdate] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterPartner, setFilterPartner] = useState<IPartner[]>([])
    const [selectedPartners, setSelectedPartners] = useState<number[]>(props.selected || [])
    const [fetching, setFetching] = useState(false)

    const {fetching: fetchingPartnerList, partners} = useTypedSelector(state => state.partnerReducer)
    const {fetchPartnerList} = useActions()

    useEffect(() => {
        if (!partners.length || isUpdate) {
            fetchPartnerList({active: [0, 1]})

            setIsUpdate(false)
        }
    }, [isUpdate])

    useEffect(() => {
        search(searchText)
    }, [partners])

    useEffect(() => {
        setFetching(fetchingPartnerList)
    }, [fetchingPartnerList])

    const close = (): void => {
        removePopup(props.id ? props.id : '')
    }

    const selectRow = (partner: IPartner): void => {
        if (props.multi) {
            selectRowMulti(partner)
        } else if (props.onSelect !== null) {
            props.onSelect(partner.id ? [partner.id] : [0])
            close()
        }
    }

    const selectRowMulti = (partner: IPartner): void => {
        if (partner.id) {
            if (checkSelected(partner.id)) {
                setSelectedPartners(selectedPartners.filter((key: number) => key !== partner.id))
            } else {
                setSelectedPartners([...selectedPartners, partner.id])
            }
        }
    }

    const checkSelected = (id: number | null): boolean => {
        return id !== null && selectedPartners.includes(id)
    }

    const search = (value: string): void => {
        setSearchText(value)

        if (value.trim() !== '') {
            setFilterPartner(partners.filter((partner: IPartner) => {
                return partner.name.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1
            }))
        } else {
            setFilterPartner(partners)
        }
    }

    const onClickAdd = (e: React.MouseEvent): void => {
        openPopupPartnerCreate(e.currentTarget, {
            onSave: () => {
                setIsUpdate(true)
            }
        })
    }

    const onClickEdit = (e: React.MouseEvent, partner: IPartner): void => {
        openPopupPartnerCreate(e.currentTarget, {
            partner: partner,
            onSave: () => {
                setIsUpdate(true)
            }
        })
    }

    const onClickSave = (): void => {
        props.onSelect(selectedPartners)
        close()
    }

    const onClickDelete = (e: React.MouseEvent, partner: IPartner): void => {
        openPopupAlert(e, {
            text: `Вы действительно хотите удалить ${partner.name}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        setFetching(true)

                        if (partner.id) {
                            PartnerService.removePartner(partner.id)
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

    const onContextMenu = (e: React.MouseEvent, partner: IPartner): void => {
        e.preventDefault()

        const menuItems: any[] = []

        if (checkRules([Rules.EDIT_PARTNER])) {
            menuItems.push({text: 'Редактировать', onClick: (e: React.MouseEvent) => onClickEdit(e, partner)})
        }

        if (checkRules([Rules.REMOVE_PARTNER])) {
            menuItems.push({text: 'Удалить', onClick: (e: React.MouseEvent) => onClickDelete(e, partner)})
        }

        openContextMenu(e, menuItems)
    }

    const renderSearch = (): React.ReactElement => {
        return (
            <div className={classes.search}>
                <SearchBox value={searchText}
                           onChange={(value: string) => search(value)}
                           countFind={filterPartner ? filterPartner.length : 0}
                           showClear
                           flexGrow
                           autoFocus
                />

                {props.buttonAdd && checkRules([Rules.ADD_PARTNER]) ?
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
                    {filterPartner.length
                        ? filterPartner.map((partner: IPartner) => renderRow(partner, 'left', checkSelected(partner.id)))
                        : <Empty message={!partners.length ? 'Нет партнеров' : 'Партнеры не найдены'}/>
                    }
                </div>
            </BlockingElement>
        )
    }

    const renderSelectedListBox = (): React.ReactElement => {
        const rows = filterPartner.filter((partner: IPartner) => checkSelected(partner.id))

        return (
            <BlockingElement fetching={fetching} className={classes.list}>
                <div className={classes.listContent}>
                    {rows.length ?
                        rows.map((partner: IPartner) => renderRow(partner, 'right', checkSelected(partner.id)))
                        : <Empty message='Партнеры не выбраны'/>
                    }
                </div>
            </BlockingElement>
        )
    }

    const renderRow = (partner: IPartner, side: string, checked: boolean): React.ReactElement => {
        return (
            <div className={classes.row}
                 key={partner.id}
                 onClick={() => selectRow(partner)}
                 onContextMenu={(e: React.MouseEvent) => onContextMenu(e, partner)}
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

                <div className={classes.name}>{partner.name}</div>

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
        <Popup className={classes.PopupPartnerSelector}>
            <BlockingElement fetching={fetching} className={classes.content}>
                <div className={classes.blockContent}>
                    <Title type='h2'>Выбрать партнеров</Title>

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

PopupPartnerSelector.defaultProps = defaultProps
PopupPartnerSelector.displayName = 'PopupPartnerSelector'

export default function openPopupPartnerSelector(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true,
        isFixed: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupPartnerSelector), popupProps, undefined, block, displayOptions)
}
