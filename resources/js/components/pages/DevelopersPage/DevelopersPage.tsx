import React, {useEffect, useMemo, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {developerTypes} from '../../../helpers/developerHelper'
import {compareText} from '../../../helpers/filterHelper'
import {changeLayout, getLayout} from '../../../helpers/utilHelper'
import {checkRules, Rules} from '../../../helpers/accessHelper'
import {RouteNames} from '../../../helpers/routerHelper'
import {IDeveloper} from '../../../@types/IDeveloper'
import {IFilter, IFilterContent} from '../../../@types/IFilter'
import Title from '../../ui/Title/Title'
import Wrapper from '../../ui/Wrapper/Wrapper'
import PanelView from '../../views/PanelView/PanelView'
import DeveloperService from '../../../api/DeveloperService'
import SidebarLeft from '../../../components/ui/SidebarLeft/SidebarLeft'
import DeveloperList from './components/DeveloperList/DeveloperList'
import DeveloperTill from './components/DeveloperTill/DeveloperTill'
import openPopupDeveloperCreate from '../../../components/popup/PopupDeveloperCreate/PopupDeveloperCreate'
import openPopupAlert from '../../popup/PopupAlert/PopupAlert'
import openContextMenu from '../../ui/ContextMenu/ContextMenu'
import classes from './DevelopersPage.module.scss'

const DevelopersPage: React.FC = (): React.ReactElement => {
    const navigate = useNavigate()

    const [fetching, setFetching] = useState(false)
    const [developers, setDevelopers] = useState<IDeveloper[]>([])
    const [searchText, setSearchText] = useState('')
    const [filterDeveloper, setFilterDeveloper] = useState<IDeveloper[]>([])
    const [isShowFilter, setIsShowFilter] = useState(false)
    const [filters, setFilters] = useState({
        types: ['constructionCompany']
    })
    const [layout, setLayout] = useState<'list' | 'till'>(getLayout('developers'))

    const {user} = useTypedSelector(state => state.userReducer)

    useEffect(() => {
        fetchDevelopersHandler()
    }, [])

    useEffect(() => {
        search(searchText)
    }, [developers, filters])

    const fetchDevelopersHandler = (): void => {
        setFetching(true)

        const filter: IFilter = {active: [0, 1]}

        if (!checkRules([Rules.IS_MANAGER])) {
            filter.author = [user.id]
        }

        DeveloperService.fetchDevelopers(filter)
            .then((response: any) => setDevelopers(response.data.data))
            .catch((error: any) => {
                console.error('Произошла ошибка загрузки данных', error)
            })
            .finally(() => setFetching(false))
    }

    const onSaveHandler = (): void => {
        fetchDevelopersHandler()
    }

    const search = (value: string): void => {
        setSearchText(value)

        if (!developers || !developers.length) {
            setFilterDeveloper([])
        }

        if (value !== '') {
            setFilterDeveloper(filterItemsHandler(developers.filter((developer: IDeveloper) => {
                return compareText(developer.name, value)
                    || (developer.address && compareText(developer.address, value))
                    || (developer.phone && compareText(developer.phone, value.toLocaleLowerCase()))
            })))
        } else {
            setFilterDeveloper(filterItemsHandler(developers))
        }
    }

    const onClickHandler = (developer: IDeveloper): void => {
        navigate(`${RouteNames.P_DEVELOPER}/${developer.id}`)
    }

    const onAddHandler = (): void => {
        openPopupDeveloperCreate(document.body, {
            onSave: () => onSaveHandler()
        })
    }

    const onEditHandler = (developer: IDeveloper): void => {
        openPopupDeveloperCreate(document.body, {
            developer: developer,
            onSave: () => onSaveHandler()
        })
    }

    const onRemoveHandler = (developer: IDeveloper): void => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить ${developer.name}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (developer.id) {
                            setFetching(true)

                            DeveloperService.removeDeveloper(developer.id)
                                .then(() => onSaveHandler())
                                .catch((error: any) => {
                                    openPopupAlert(document.body, {
                                        title: 'Ошибка!',
                                        text: error.data.data
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

    const onContextMenuHandler = (developer: IDeveloper, e: React.MouseEvent): void => {
        e.preventDefault()

        const menuItems: any[] = [{
            text: 'Открыть',
            onClick: () => navigate(`${RouteNames.P_DEVELOPER}/${developer.id}`)
        }]

        if (checkRules([Rules.EDIT_DEVELOPER])) {
            menuItems.push({text: 'Редактировать', onClick: () => onEditHandler(developer)})
        }

        if (checkRules([Rules.REMOVE_DEVELOPER])) {
            menuItems.push({text: 'Удалить', onClick: () => onRemoveHandler(developer)})
        }

        openContextMenu(e, menuItems)
    }

    const onChangeLayoutHandler = (value: 'list' | 'till'): void => {
        setLayout(value)
        changeLayout('developers', value)
    }

    const filterItemsHandler = (list: IDeveloper[]): IDeveloper[] => {
        if (!list || !list.length) {
            return []
        }

        return list.filter((item: IDeveloper) => {
            return filters.types.includes(item.type)
        })
    }

    const filtersContent: IFilterContent[] = useMemo((): IFilterContent[] => {
        return [
            {
                title: 'Тип',
                type: 'checker',
                multi: true,
                items: developerTypes,
                selected: filters.types,
                onSelect: (values: string[]) => {
                    setFilters({...filters, types: values})
                }
            }
        ]
    }, [filters])

    return (
        <PanelView pageTitle='Застройщики'>
            <SidebarLeft filters={filtersContent}
                         isShow={isShowFilter}
                         onChangeShow={(isShow: boolean) => setIsShowFilter(isShow)}
            />

            <Wrapper isFull>
                <Title type='h1'
                       onAdd={checkRules([Rules.ADD_DEVELOPER]) ? onAddHandler.bind(this) : undefined}
                       onFilter={() => setIsShowFilter(!isShowFilter)}
                       searchText={searchText}
                       onSearch={search.bind(this)}
                       className={classes.title}
                       layouts={['list', 'till']}
                       activeLayout={layout}
                       onChangeLayout={onChangeLayoutHandler.bind(this)}
                >Застройщики</Title>

                {layout === 'till'
                    ? <DeveloperTill list={filterDeveloper}
                                     fetching={fetching}
                                     onClick={(developer: IDeveloper) => onClickHandler(developer)}
                                     onContextMenu={(developer: IDeveloper, e: React.MouseEvent) => onContextMenuHandler(developer, e)}
                    />
                    : <DeveloperList list={filterDeveloper}
                                     fetching={fetching}
                                     onClick={(developer: IDeveloper) => onClickHandler(developer)}
                                     onContextMenu={(developer: IDeveloper, e: React.MouseEvent) => onContextMenuHandler(developer, e)}
                    />
                }
            </Wrapper>
        </PanelView>
    )
}

DevelopersPage.displayName = 'DevelopersPage'

export default React.memo(DevelopersPage)
