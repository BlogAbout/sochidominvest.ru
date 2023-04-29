import React from 'react'
import {IArticle} from '../../../../../@types/IArticle'
import {IBuilding} from '../../../../../@types/IBuilding'
import {checkRules, Rules} from '../../../../../helpers/accessHelper'
import BuildingService from '../../../../../api/BuildingService'
import ArticleService from '../../../../../api/ArticleService'
import openContextMenu from '../../../../ui/ContextMenu/ContextMenu'
import openPopupArticleCreate from '../../../../popup/PopupArticleCreate/PopupArticleCreate'
import openPopupAlert from '../../../../popup/PopupAlert/PopupAlert'
import openPopupBuildingCreate from '../../../../popup/PopupBuildingCreate/PopupBuildingCreate'
import classes from './InfoItem.module.scss'

interface Props {
    article?: IArticle
    building?: IBuilding
    type: 'article' | 'building' | 'log'

    onSave(): void
}

const defaultProps: Props = {
    type: 'article',
    onSave: () => {
        console.info('InfoItem onSave')
    }
}

const InfoItem: React.FC<Props> = (props) => {
    const updateArticleHandler = (): void => {
        openPopupArticleCreate(document.body, {
            article: props.article,
            onSave: () => {
                props.onSave()
            }
        })
    }

    const removeArticleHandler = (): void => {
        if (!props.article) {
            return
        }

        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить ${props.article.name}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (props.article && props.article.id) {
                            ArticleService.removeArticle(props.article.id)
                                .then(() => props.onSave())
                                .catch((error: any) => {
                                    openPopupAlert(document.body, {
                                        title: 'Ошибка!',
                                        text: error.data.message
                                    })
                                })
                        }
                    }
                },
                {text: 'Отмена'}
            ]
        })
    }

    const updateBuildingHandler = (): void => {
        openPopupBuildingCreate(document.body, {
            building: props.building,
            onSave: () => {
                props.onSave()
            }
        })
    }

    const removeBuildingHandler = (): void => {
        if (!props.building) {
            return
        }

        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить ${props.building.name}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (props.building && props.building.id) {
                            BuildingService.removeBuilding(props.building.id)
                                .then(() => props.onSave())
                                .catch((error: any) => {
                                    openPopupAlert(document.body, {
                                        title: 'Ошибка!',
                                        text: error.data.message
                                    })
                                })
                        }
                    }
                },
                {text: 'Отмена'}
            ]
        })
    }

    const onArticleContextMenu = (e: React.MouseEvent): void => {
        e.preventDefault()

        if (!props.article) {
            return
        }

        const menuItems: any[] = []

        if (checkRules([Rules.EDIT_ARTICLE])) {
            menuItems.push({text: 'Редактировать', onClick: () => updateArticleHandler()})
        }

        if (checkRules([Rules.REMOVE_ARTICLE])) {
            menuItems.push({text: 'Удалить', onClick: () => removeArticleHandler()})
        }

        openContextMenu(e, menuItems)
    }

    const onBuildingContextMenu = (e: React.MouseEvent): void => {
        e.preventDefault()

        if (!props.building) {
            return
        }

        const menuItems: any[] = []

        if (checkRules([Rules.EDIT_BUILDING])) {
            menuItems.push({text: 'Редактировать', onClick: () => updateBuildingHandler()})
        }

        if (checkRules([Rules.REMOVE_BUILDING], props.building.id)) {
            menuItems.push({text: 'Удалить', onClick: () => removeBuildingHandler()})
        }

        openContextMenu(e, menuItems)
    }

    const renderArticle = (): React.ReactElement | null => {
        if (!props.article) {
            return null
        }

        return (
            <div className={classes.InfoItem}
                 onContextMenu={(e: React.MouseEvent) => onArticleContextMenu(e)}
            >
                <div className={classes.name}>{props.article.name}</div>
                <div className={classes.date}>{props.article.date_created}</div>
            </div>
        )
    }

    const renderBuilding = (): React.ReactElement | null => {
        if (!props.building) {
            return null
        }

        return (
            <div className={classes.InfoItem}
                 onContextMenu={(e: React.MouseEvent) => onBuildingContextMenu(e)}
            >
                <div className={classes.name}>{props.building.name}</div>
                <div className={classes.date}>{props.building.date_created}</div>
            </div>
        )
    }

    return (
        props.type === 'article' ? renderArticle()
            : props.type === 'building' ? renderBuilding()
            : null
    )
}

InfoItem.defaultProps = defaultProps
InfoItem.displayName = 'InfoItem'

export default React.memo(InfoItem)
