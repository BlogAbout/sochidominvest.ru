import React, {useEffect, useState} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {checkRules, Rules} from '../../../../../helpers/accessHelper'
import {IBuildingChecker} from '../../../../../@types/IBuilding'
import {getCheckerStatusText} from '../../../../../helpers/buildingHelper'
import {numberWithSpaces} from '../../../../../helpers/numberHelper'
import BlockingElement from '../../../../ui/BlockingElement/BlockingElement'
import Empty from '../../../../ui/Empty/Empty'
import openPopupCheckerCreate from '../../../PopupCheckerCreate/PopupCheckerCreate'
import CheckerService from '../../../../../api/CheckerService'
import openPopupAlert from '../../../../popup/PopupAlert/PopupAlert'
import openContextMenu from '../../../../ui/ContextMenu/ContextMenu'
import Preloader from '../../../../ui/Preloader/Preloader'
import classes from './CheckerList.module.scss'

interface Props {
    buildingId: number | null
}

const defaultProps: Props = {
    buildingId: null
}

const CheckerList: React.FC<Props> = (props) => {
    const [fetching, setFetching] = useState(false)
    const [checkers, setCheckers] = useState<IBuildingChecker[]>([])

    useEffect(() => {
        onFetchCheckersHandler()
    }, [props.buildingId])

    const onFetchCheckersHandler = () => {
        if (props.buildingId) {
            setFetching(true)

            CheckerService.fetchCheckers(props.buildingId)
                .then((response: any) => setCheckers(response.data.data))
                .catch((error: any) => {
                    openPopupAlert(document.body, {
                        title: 'Ошибка!',
                        text: error.data.message
                    })
                })
                .finally(() => setFetching(false))
        }
    }

    const createHandler = () => {
        openPopupCheckerCreate(document.body, {
            buildingId: props.buildingId,
            onSave: () => onFetchCheckersHandler()
        })
    }

    const updateHandler = (checker: IBuildingChecker) => {
        openPopupCheckerCreate(document.body, {
            checker: checker,
            buildingId: props.buildingId,
            onSave: () => onFetchCheckersHandler()
        })
    }

    const onContextMenu = (e: React.MouseEvent, checker: IBuildingChecker) => {
        e.preventDefault()

        const menuItems: any[] = []

        if (checkRules([Rules.EDIT_CHECKER])) {
            menuItems.push({text: 'Редактировать', onClick: () => updateHandler(checker)})
        }

        if (checkRules([Rules.REMOVE_CHECKER])) {
            menuItems.push({text: 'Удалить', onClick: () => removeHandler(checker)})
        }

        openContextMenu(e, menuItems)
    }

    const removeHandler = (checker: IBuildingChecker) => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить ${checker.name}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (checker.id) {
                            setFetching(true)

                            CheckerService.removeChecker(checker.id)
                                .then(() => onFetchCheckersHandler())
                                .catch((error: any) => {
                                    openPopupAlert(document.body, {
                                        title: 'Ошибка!',
                                        text: error.data.message
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

    return (
        <div className={classes.CheckerList}>
            {fetching && <Preloader/>}

            <div className={classes.header}>
                <div className={classes.name}>Название</div>
                <div className={classes.status}>Статус</div>
                <div className={classes.housing}>Кор.</div>
                <div className={classes.stage}>Эт.</div>
                <div className={classes.area}>Пл., м<sup>2</sup></div>
                <div className={classes.cost}>Цена, руб.</div>
            </div>

            <div className={classes.addChecker} onClick={createHandler.bind(this)}>
                <FontAwesomeIcon icon='plus'/> Добавить
            </div>

            <BlockingElement fetching={fetching} className={classes.list}>
                {checkers && checkers.length ?
                    checkers.map((checker: IBuildingChecker) => {
                        return (
                            <div key={checker.id}
                                 className={classes.row}
                                 onContextMenu={(e: React.MouseEvent) => onContextMenu(e, checker)}
                            >
                                <div className={classes.name}>{checker.name}</div>
                                <div className={classes.status}>{getCheckerStatusText(checker.status)}</div>
                                <div className={classes.housing}>{checker.housing}</div>
                                <div className={classes.stage}>{checker.stage}</div>
                                <div className={classes.area}>{checker.area ? checker.area : ''}</div>
                                <div className={classes.cost}>{checker.cost ? numberWithSpaces(checker.cost) : ''}</div>
                            </div>
                        )
                    })
                    : <Empty message='Объект недвижимости не имеет шахматок'/>
                }
            </BlockingElement>
        </div>
    )
}

CheckerList.defaultProps = defaultProps
CheckerList.displayName = 'CheckerList'

export default CheckerList
