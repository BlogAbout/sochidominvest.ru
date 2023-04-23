import React, {useEffect, useState} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {getFormatDate} from '../../../../../helpers/dateHelper'
import {IFeed} from '../../../../../@types/IFeed'
import {IBuilding} from '../../../../../@types/IBuilding'
import {IBusinessProcessRelation} from '../../../../../@types/IBusinessProcess'
import {IBooking} from '../../../../../@types/IBooking'
import BuildingService from '../../../../../api/BuildingService'
import FeedService from '../../../../../api/FeedService'
import BookingService from '../../../../../api/BookingService'
import BlockingElement from '../../../../ui/BlockingElement/BlockingElement'
import Empty from '../../../../ui/Empty/Empty'
import openPopupAlert from '../../../PopupAlert/PopupAlert'
import openContextMenu from '../../../../ui/ContextMenu/ContextMenu'
import openPopupBuildingSelector from '../../../PopupBuildingSelector/PopupBuildingSelector'
import openPopupFeedSelector from '../../../PopupFeedSelector/PopupFeedSelector'
import classes from './RelationList.module.scss'

interface Props {
    selected: IBusinessProcessRelation[]
    fetching: boolean

    onSelect(value: IBusinessProcessRelation[]): void
}

const defaultProps: Props = {
    selected: [],
    fetching: false,
    onSelect: (value: IBusinessProcessRelation[]) => {
        console.info('RelationList onSelect', value)
    }
}

const RelationList: React.FC<Props> = (props) => {
    const [selectedBuildings, setSelectedBuildings] = useState<IBuilding[]>([])
    const [selectedFeeds, setSelectedFeeds] = useState<IFeed[]>([])
    const [selectedBookings, setSelectedBookings] = useState<IBooking[]>([])
    const [fetchingBuildings, setFetchingBuildings] = useState(false)
    const [fetchingFeeds, setFetchingFeeds] = useState(false)
    const [fetchingBookings, setFetchingBookings] = useState(false)

    useEffect(() => {
        if (props.selected.length) {
            const buildingsIds: number[] = props.selected
                .filter((relation: IBusinessProcessRelation) => relation.object_type === 'building')
                .map((relation: IBusinessProcessRelation) => relation.object_id)

            const feedsIds: number[] = props.selected
                .filter((relation: IBusinessProcessRelation) => relation.object_type === 'feed')
                .map((relation: IBusinessProcessRelation) => relation.object_id)

            const bookingIds: number[] = props.selected
                .filter((relation: IBusinessProcessRelation) => relation.object_type === 'booking')
                .map((relation: IBusinessProcessRelation) => relation.object_id)

            if (buildingsIds.length) {
                setFetchingBuildings(true)

                BuildingService.fetchBuildings({active: [0, 1], id: buildingsIds})
                    .then((response: any) => {
                        setSelectedBuildings(response.data.data)
                    })
                    .catch((error: any) => {
                        console.error('Ошибка', error)
                    })
                    .finally(() => {
                        setFetchingBuildings(false)
                    })
            }

            if (feedsIds.length) {
                setFetchingFeeds(true)

                FeedService.fetchFeeds({active: [0, 1], id: feedsIds})
                    .then((response: any) => {
                        setSelectedFeeds(response.data.data)
                    })
                    .catch((error: any) => {
                        console.error('Ошибка', error)
                    })
                    .finally(() => {
                        setFetchingFeeds(false)
                    })
            }

            if (bookingIds.length) {
                setFetchingBookings(true)

                // BookingService.fetchBookings({active: [0, 1], id: bookingIds})
                //     .then((response: any) => {
                //         setSelectedBookings(response.data.data)
                //     })
                //     .catch((error: any) => {
                //         console.error('Ошибка', error)
                //     })
                //     .finally(() => {
                //         setFetchingBookings(false)
                //     })
            }
        }
    }, [props.selected])

    // Добавление элемента из списка
    const selectHandler = (e: React.MouseEvent) => {
        const menuItems = [
            {
                text: 'Тикет', onClick: () => {
                    openPopupFeedSelector(document.body, {
                        selected: props.selected
                            .filter((relation: IBusinessProcessRelation) => relation.object_type === 'feed')
                            .map((relation: IBusinessProcessRelation) => relation.object_id),
                        multi: true,
                        onSelect: (value: number[]) => {
                            const updateRelations: IBusinessProcessRelation[] = JSON.parse(JSON.stringify(props.selected))

                            value.forEach((id: number) => {
                                if (updateRelations.findIndex((relation: IBusinessProcessRelation) => relation.object_id === id && relation.object_type === 'feed') === -1) {
                                    updateRelations.push({object_id: id, object_type: 'feed'})
                                }
                            })

                            props.onSelect(updateRelations)
                        }
                    })
                }
            },
            {
                text: 'Недвижимость',
                onClick: () => {
                    openPopupBuildingSelector(document.body, {
                        selected: props.selected
                            .filter((relation: IBusinessProcessRelation) => relation.object_type === 'building')
                            .map((relation: IBusinessProcessRelation) => relation.object_id),
                        multi: true,
                        onSelect: (value: number[]) => {
                            const updateRelations: IBusinessProcessRelation[] = JSON.parse(JSON.stringify(props.selected))

                            value.forEach((id: number) => {
                                if (updateRelations.findIndex((relation: IBusinessProcessRelation) => relation.object_id === id && relation.object_type === 'building') === -1) {
                                    updateRelations.push({object_id: id, object_type: 'building'})
                                }
                            })

                            props.onSelect(updateRelations)
                        }
                    })
                }
            },
        ]

        openContextMenu(e, menuItems)
    }

    // Удаление элемента из списка
    const removeHandler = (relation: IBusinessProcessRelation) => {
        let relationName = ''
        switch (relation.object_type) {
            case 'feed':
                const findFeed = selectedFeeds.find((feed: IFeed) => feed.id === relation.object_id)

                if (findFeed) {
                    relationName = findFeed.title
                }

                break
            case 'building':
                const findBuilding = selectedBuildings.find((building: IBuilding) => building.id === relation.object_id)

                if (findBuilding) {
                    relationName = findBuilding.name
                }

                break
        }

        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить ${relationName} из списка выбранных?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        const removeSelectedList: IBusinessProcessRelation[] = props.selected.filter((item: IBusinessProcessRelation) => !(item.object_id === relation.object_id && item.object_type === relation.object_type))
                        props.onSelect(removeSelectedList)
                    }
                },
                {text: 'Отмена'}
            ]
        })
    }

    // Открытие контекстного меню на элементе
    const onContextMenu = (e: React.MouseEvent, relation: IBusinessProcessRelation) => {
        e.preventDefault()

        const menuItems = [
            {text: 'Удалить', onClick: () => removeHandler(relation)}
        ]

        openContextMenu(e, menuItems)
    }

    const renderRelation = (relation: IBusinessProcessRelation) => {
        switch (relation.object_type) {
            case 'feed':
                return renderFeedItem(relation)
            case 'building':
                return renderBuildingItem(relation)
            case 'booking':
                return renderBookingItem(relation)
        }
    }

    const renderFeedItem = (relation: IBusinessProcessRelation) => {
        const findFeed = selectedFeeds.find((feed: IFeed) => feed.id === relation.object_id)

        if (!findFeed) {
            return null
        }

        return (
            <div key={`${relation.object_type}-${relation.object_id}`}
                 className={classes.row}
                 onContextMenu={(e: React.MouseEvent) => onContextMenu(e, relation)}
            >
                <div className={classes.name}>{findFeed.title}</div>
                <div className={classes.type}>Тикет</div>
            </div>
        )
    }

    const renderBuildingItem = (relation: IBusinessProcessRelation) => {
        const findBuilding = selectedBuildings.find((building: IBuilding) => building.id === relation.object_id)

        if (!findBuilding) {
            return null
        }

        return (
            <div key={`${relation.object_type}-${relation.object_id}`}
                 className={classes.row}
                 onContextMenu={(e: React.MouseEvent) => onContextMenu(e, relation)}
            >
                <div className={classes.name}>{findBuilding.name}</div>
                <div className={classes.type}>Недвижимость</div>
            </div>
        )
    }

    const renderBookingItem = (relation: IBusinessProcessRelation) => {
        const findBooking = selectedBookings.find((booking: IBooking) => booking.id === relation.object_id)

        if (!findBooking) {
            return null
        }

        return (
            <div key={`${relation.object_type}-${relation.object_id}`}
                 className={classes.row}
                 onContextMenu={(e: React.MouseEvent) => onContextMenu(e, relation)}
            >
                <div className={classes.name}>
                    {findBooking.buildingName} с {getFormatDate(findBooking.dateStart, 'date')} по {getFormatDate(findBooking.dateFinish, 'date')}
                </div>
                <div className={classes.type}>Бронь</div>
            </div>
        )
    }

    return (
        <div className={classes.RelationList}>
            <div className={classes.header}>
                <div className={classes.name}>Название</div>
                <div className={classes.type}>Тип</div>
            </div>

            <div className={classes.addUser} onClick={selectHandler.bind(this)}>
                <FontAwesomeIcon icon='plus'/> Добавить
            </div>

            <BlockingElement fetching={props.fetching || fetchingBuildings || fetchingFeeds || fetchingBookings}
                             className={classes.list}>
                {props.selected && props.selected.length ?
                    props.selected.map((relation: IBusinessProcessRelation) => renderRelation(relation))
                    : <Empty message='Бизнес-процесс не имеет связей.'/>
                }
            </BlockingElement>
        </div>
    )
}

RelationList.defaultProps = defaultProps
RelationList.displayName = 'RelationList'

export default RelationList
