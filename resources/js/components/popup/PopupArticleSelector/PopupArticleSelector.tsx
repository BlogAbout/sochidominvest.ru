import React, {useEffect, useState} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import withStore from '../../hoc/withStore'
import ArticleService from '../../../api/ArticleService'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import {IArticle} from '../../../@types/IArticle'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import openPopupArticleCreate from '../PopupArticleCreate/PopupArticleCreate'
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
import openPopupAlert from '../../popup/PopupAlert/PopupAlert'
import classes from './PopupArticleSelector.module.scss'

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
        console.info('PopupArticleSelector onAdd')
    },
    onSelect: (value: number[]) => {
        console.info('PopupArticleSelector onSelect', value)
    }
}

const PopupArticleSelector: React.FC<Props> = (props) => {
    const [isUpdate, setIsUpdate] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterArticle, setFilterArticle] = useState<IArticle[]>([])
    const [selectedArticles, setSelectedArticles] = useState<number[]>(props.selected || [])
    const [fetching, setFetching] = useState(false)

    const {user} = useTypedSelector(state => state.userReducer)
    const {fetching: fetchingArticleList, articles} = useTypedSelector(state => state.articleReducer)
    const {fetchArticleList} = useActions()

    useEffect(() => {
        if (!articles.length || isUpdate) {
            fetchArticleList({active: [0, 1]})

            setIsUpdate(false)
        }

        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [isUpdate])

    useEffect(() => {
        search(searchText)
    }, [articles])

    useEffect(() => {
        setFetching(fetchingArticleList)
    }, [fetchingArticleList])

    // Закрытие Popup
    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    // Клик на строку
    const selectRow = (article: IArticle) => {
        if (props.multi) {
            selectRowMulti(article)
        } else if (props.onSelect !== null) {
            props.onSelect(article.id ? [article.id] : [0])
            close()
        }
    }

    // Клик на строку в мульти режиме
    const selectRowMulti = (article: IArticle) => {
        if (article.id) {
            if (checkSelected(article.id)) {
                setSelectedArticles(selectedArticles.filter((key: number) => key !== article.id))
            } else {
                setSelectedArticles([...selectedArticles, article.id])
            }
        }
    }

    // Проверка наличия элемента среди выбранных
    const checkSelected = (id: number | null) => {
        return id !== null && selectedArticles.includes(id)
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (value.trim() !== '') {
            setFilterArticle(articles.filter((article: IArticle) => {
                return article.name.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1
            }))
        } else {
            setFilterArticle(articles)
        }
    }

    // Добавление нового элемента
    const onClickAdd = (e: React.MouseEvent) => {
        openPopupArticleCreate(e.currentTarget, {
            onSave: () => {
                setIsUpdate(true)
            }
        })
    }

    // Редактирование элемента
    const onClickEdit = (e: React.MouseEvent, article: IArticle) => {
        openPopupArticleCreate(e.currentTarget, {
            article: article,
            onSave: () => {
                setIsUpdate(true)
            }
        })
    }

    // Сохранение выбора
    const onClickSave = () => {
        props.onSelect(selectedArticles)
        close()
    }

    // Удаление элемента справочника
    const onClickDelete = (e: React.MouseEvent, article: IArticle) => {
        openPopupAlert(e, {
            text: `Вы действительно хотите удалить ${article.name}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        setFetching(true)

                        if (article.id) {
                            ArticleService.removeArticle(article.id)
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

    // Открытие контекстного меню на элементе справочника
    const onContextMenu = (e: React.MouseEvent, article: IArticle) => {
        e.preventDefault()

        // if (['director', 'administrator', 'manager'].includes(role)) {
        //     const menuItems = [{text: 'Редактировать', onClick: (e: React.MouseEvent) => onClickEdit(e, article)}]
        //
        //     if (['director', 'administrator'].includes(role)) {
        //         menuItems.push({text: 'Удалить', onClick: (e: React.MouseEvent) => onClickDelete(e, article)})
        //     }
        //
        //     openContextMenu(e, menuItems)
        // }
    }

    const renderSearch = () => {
        return (
            <div className={classes.search}>
                <SearchBox value={searchText}
                           onChange={(value: string) => search(value)}
                           countFind={filterArticle ? filterArticle.length : 0}
                           showClear
                           flexGrow
                           autoFocus
                />

                {/*{props.buttonAdd && ['director', 'administrator', 'manager'].includes(role) ?*/}
                {/*    <ButtonAdd onClick={onClickAdd.bind(this)}/>*/}
                {/*    : null}*/}
            </div>
        )
    }

    const renderListBox = () => {
        return (
            <BlockingElement fetching={fetching} className={classes.list}>
                <div className={classes.listContent}>
                    {filterArticle.length
                        ? filterArticle.map((article: IArticle) => renderRow(article, 'left', checkSelected(article.id)))
                        : <Empty message={!articles.length ? 'Нет статей' : 'Статьи не найдены'}/>
                    }
                </div>
            </BlockingElement>
        )
    }

    const renderSelectedListBox = () => {
        const rows = filterArticle.filter((article: IArticle) => checkSelected(article.id))

        return (
            <BlockingElement fetching={fetching} className={classes.list}>
                <div className={classes.listContent}>
                    {rows.length ?
                        rows.map((article: IArticle) => renderRow(article, 'right', checkSelected(article.id)))
                        : <Empty message='Статьи не выбраны'/>
                    }
                </div>
            </BlockingElement>
        )
    }

    const renderRow = (article: IArticle, side: string, checked: boolean) => {
        return (
            <div className={classes.row}
                 key={article.id}
                 onClick={() => selectRow(article)}
                 onContextMenu={(e: React.MouseEvent) => onContextMenu(e, article)}
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

                <div className={classes.name}>{article.name}</div>

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
        <Popup className={classes.PopupArticleSelector}>
            <BlockingElement fetching={fetching} className={classes.content}>
                <div className={classes.blockContent}>
                    <Title type='h2'>Выбрать статьи</Title>

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

PopupArticleSelector.defaultProps = defaultProps
PopupArticleSelector.displayName = 'PopupArticleSelector'

export default function openPopupArticleSelector(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true,
        isFixed: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupArticleSelector), popupProps, undefined, block, displayOptions)
}
