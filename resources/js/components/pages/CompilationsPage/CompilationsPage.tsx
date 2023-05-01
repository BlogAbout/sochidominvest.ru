import React, {useEffect, useState} from 'react'
import {ICompilation} from '../../../@types/ICompilation'
import {compareText} from '../../../helpers/filterHelper'
import {checkRules, Rules} from '../../../helpers/accessHelper'
import CompilationService from '../../../api/CompilationService'
import Title from '../../ui/Title/Title'
import Wrapper from '../../ui/Wrapper/Wrapper'
import PanelView from '../../views/PanelView/PanelView'
import CompilationList from './components/CompilationList/CompilationList'
import openPopupCompilationCreate from '../../../components/popup/PopupCompilationCreate/PopupCompilationCreate'
import classes from './CompilationsPage.module.scss'

const CompilationsPage: React.FC = (): React.ReactElement => {
    const [fetching, setFetching] = useState(false)
    const [compilations, setCompilations] = useState<ICompilation[]>([])
    const [searchText, setSearchText] = useState('')
    const [filterCompilation, setFilterCompilation] = useState<ICompilation[]>([])

    useEffect(() => {
        fetchCompilationsHandler()
    }, [])

    useEffect(() => {
        search(searchText)
    }, [compilations])

    const fetchCompilationsHandler = (): void => {
        setFetching(true)

        CompilationService.fetchCompilations()
            .then((response: any) => setCompilations(response.data.data))
            .catch((error: any) => console.error('Произошла ошибка загрузки данных', error))
            .finally(() => setFetching(false))
    }

    const onSaveHandler = (): void => {
        fetchCompilationsHandler()
    }

    const search = (value: string): void => {
        setSearchText(value)

        if (!compilations || !compilations.length) {
            setFilterCompilation([])
        }

        if (value !== '') {
            setFilterCompilation(compilations.filter((compilation: ICompilation) => {
                return compareText(compilation.name, value) || compareText(compilation.description, value)
            }))
        } else {
            setFilterCompilation(compilations)
        }
    }

    const onAddHandler = () => {
        openPopupCompilationCreate(document.body, {
            onSave: () => onSaveHandler()
        })
    }

    return (
        <PanelView pageTitle='Подборки'>
            <Wrapper isFull>
                <Title type='h1'
                       onAdd={checkRules([Rules.ADD_COMPILATION]) ? onAddHandler.bind(this) : undefined}
                       searchText={searchText}
                       onSearch={search.bind(this)}
                       className={classes.title}
                >Подборки</Title>

                <CompilationList list={filterCompilation} fetching={fetching}
                                 onSave={() => fetchCompilationsHandler()}/>
            </Wrapper>
        </PanelView>
    )
}

CompilationsPage.displayName = 'CompilationsPage'

export default React.memo(CompilationsPage)
