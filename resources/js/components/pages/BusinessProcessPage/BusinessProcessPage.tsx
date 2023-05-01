import React, {useEffect, useState} from 'react'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {IBusinessProcess} from '../../../@types/IBusinessProcess'
import BusinessProcessService from '../../../api/BusinessProcessService'
import Title from '../../ui/Title/Title'
import Wrapper from '../../ui/Wrapper/Wrapper'
import PanelView from '../../views/PanelView/PanelView'
import BusinessProcessList from './components/BusinessProcessList/BusinessProcessList'
import openPopupBusinessProcessCreate
    from '../../../components/popup/PopupBusinessProcessCreate/PopupBusinessProcessCreate'
import classes from './BusinessProcessPage.module.scss'

const BusinessProcessPage: React.FC = (): React.ReactElement => {
    const [fetching, setFetching] = useState(false)
    const [businessProcesses, setBusinessProcesses] = useState<IBusinessProcess[]>([])
    const [ordering, setOrdering] = useState<number[]>([])

    const {user} = useTypedSelector(state => state.userReducer)

    useEffect(() => {
        fetchBusinessProcessesHandler()
    }, [])

    useEffect(() => {
        setOrdering(user.business_process_sorting || [])
    }, [user])

    const fetchBusinessProcessesHandler = (): void => {
        setFetching(true)

        BusinessProcessService.fetchBusinessProcesses({active: [0, 1]})
            .then((response: any) => setBusinessProcesses(response.data.data))
            .catch((error: any) => console.error('Произошла ошибка загрузки данных', error))
            .finally(() => setFetching(false))
    }

    const onSaveHandler = (): void => {
        fetchBusinessProcessesHandler()
    }

    const onAddHandler = (): void => {
        openPopupBusinessProcessCreate(document.body, {
            onSave: () => onSaveHandler()
        })
    }

    return (
        <PanelView pageTitle='Бизнес-процессы'>
            <Wrapper isFull>
                <Title type='h1'
                       onAdd={onAddHandler.bind(this)}
                       className={classes.title}
                >Бизнес-процессы</Title>

                <BusinessProcessList list={businessProcesses}
                                     ordering={ordering}
                                     fetching={fetching}
                                     onSave={() => fetchBusinessProcessesHandler()}/>
            </Wrapper>
        </PanelView>
    )
}

BusinessProcessPage.displayName = 'BusinessProcessPage'

export default React.memo(BusinessProcessPage)
