import React, {useEffect, useMemo, useState} from 'react'
import withStore from '../../hoc/withStore'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {IFeed, IFeedMessage} from '../../../@types/IFeed'
import {ISelector} from '../../../@types/ISelector'
import {ITab} from '../../../@types/ITab'
import {feedStatuses, getFeedObjectText, getFeedTypesText} from '../../../helpers/supportHelper'
import {checkRules, Rules} from '../../../helpers/accessHelper'
import FeedService from '../../../api/FeedService'
import BuildingService from '../../../api/BuildingService'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import openPopupAlert from '../PopupAlert/PopupAlert'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import Button from '../../form/Button/Button'
import Empty from '../../ui/Empty/Empty'
import TextAreaBox from '../../form/TextAreaBox/TextAreaBox'
import Title from '../../ui/Title/Title'
import TextBox from '../../form/TextBox/TextBox'
import Field from '../../form/Field/Field'
import Tabs from '../../ui/Tabs/Tabs'
import StatusBox from '../../form/StatusBox/StatusBox'
import classes from './PopupSupportInfo.module.scss'

interface Props extends PopupProps {
    feedId: number | null

    onSave(): void
}

const defaultProps: Props = {
    feedId: null,
    onSave: () => {
        console.info('PopupSupportInfo onSave')
    }
}

const PopupSupportInfo: React.FC<Props> = (props) => {
    const [feed, setFeed] = useState<IFeed>({
        id: null,
        title: '',
        type: 'feed',
        status: 'new',
        phone: null,
        name: null,
        object_id: null,
        object_type: null,
        is_active: 1,
        messages: []
    })

    const [messageText, setMessageText] = useState<string>('')

    const [info, setInfo] = useState({
        objectName: ''
    })

    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [props.blockId])

    useEffect(() => {
        if (props.feedId) {
            setFetching(true)

            FeedService.fetchFeedById(props.feedId)
                .then((response: any) => setFeed(response.data.data))
                .catch((error: any) => {
                    console.error('Ошибка загрузки данных!', error)
                    openPopupAlert(document.body, {
                        title: 'Ошибка!',
                        text: error.data.message
                    })
                })
                .finally(() => setFetching(false))
        }
    }, [props.feedId])

    useEffect(() => {
        if (feed.object_id && feed.object_type) {
            if (feed.object_type === 'building') {
                BuildingService.fetchBuildingById(feed.object_id)
                    .then((response: any) => setInfo({...info, objectName: response.data.data.name}))
                    .catch((error: any) => {
                        openPopupAlert(document.body, {
                            title: 'Ошибка!',
                            text: error.data.message
                        })
                    })
            }
        }
    }, [feed.object_id])

    const closePopup = (): void => {
        removePopup(props.id ? props.id : '')
    }

    const saveHandler = (status: string): void => {
        const updateFeed: IFeed = {...feed, status: status}

        setFetching(true)

        FeedService.saveFeed(updateFeed)
            .then((response: any) => {
                setFeed(response.data.data)

                props.onSave()
            })
            .catch((error: any) => {
                openPopupAlert(document.body, {
                    title: 'Ошибка!',
                    text: error.data.message
                })
            })
            .finally(() => setFetching(false))
    }

    const saveMessage = (): void => {
        if (messageText.trim() === '') {
            return
        }

        const updateFeed = {...feed, message_text: messageText}

        if (checkRules([Rules.IS_MANAGER])) {
            updateFeed.status = 'close'
        } else {
            updateFeed.status = 'new'
        }

        setFetching(true)

        FeedService.saveFeed(updateFeed)
            .then((response: any) => {
                setFeed(response.data.data)
                setMessageText('')

                props.onSave()
            })
            .catch((error: any) => {
                openPopupAlert(document.body, {
                    title: 'Ошибка!',
                    text: error.data.message
                })
            })
            .finally(() => setFetching(false))
    }

    const items = feedStatuses.map((item: ISelector) => {
        return {
            title: item.text,
            text: item.key,
            onClick: () => {
                saveHandler(item.key)
            }
        }
    })

    const renderMessage = (message: IFeedMessage): React.ReactElement => {
        return (
            <div key={message.id} className={classes.item}>
                <div className={classes.head}>
                    <div className={classes.name}>{message.authorName}</div>
                    <div className={classes.date}>{message.date_created}</div>
                </div>
                <div className={classes.description}>{message.content}</div>
            </div>
        )
    }

    const renderInfoTab = (): React.ReactElement => {
        return (
            <div key='info' className={classes.tabContent}>
                <Title type='h2'>{`Тикет #${feed.id}`}</Title>

                <Field label='Тема'
                       title='Тема'
                       type='hor'
                       style='dark'
                       labelWidth={150}
                >
                    <TextBox value={feed.title}
                             onChange={() => {
                             }}
                             styleType='minimal'
                             readOnly
                             width='100%'
                    />
                </Field>

                {checkRules([Rules.IS_MANAGER]) ?
                    <>
                        {feed.author ?
                            <Field label='Автор'
                                   title='Автор'
                                   type='hor'
                                   style='dark'
                                   labelWidth={150}
                            >
                                <TextBox value={feed.author ? feed.author.name : ''}
                                         onChange={() => {
                                         }}
                                         styleType='minimal'
                                         readOnly
                                         width='100%'
                                />
                            </Field>
                            : null
                        }

                        {feed.phone ?
                            <Field label='Телефон'
                                   title='Телефон'
                                   type='hor'
                                   style='dark'
                                   labelWidth={150}
                            >
                                <TextBox value={feed.phone}
                                         onChange={() => {
                                         }}
                                         styleType='minimal'
                                         readOnly
                                         width='100%'
                                />
                            </Field>
                            : null
                        }

                        {feed.name ?
                            <Field label='Имя'
                                   title='Имя'
                                   type='hor'
                                   style='dark'
                                   labelWidth={150}
                            >
                                <TextBox value={feed.name}
                                         onChange={() => {
                                         }}
                                         styleType='minimal'
                                         readOnly
                                         width='100%'
                                />
                            </Field>
                            : null
                        }

                        {feed.object_id && feed.object_type ?
                            <Field label={getFeedObjectText(feed.object_type)}
                                   title={getFeedObjectText(feed.object_type)}
                                   type='hor'
                                   style='dark'
                                   labelWidth={150}
                            >
                                <TextBox value={info.objectName}
                                         onChange={() => {
                                         }}
                                         styleType='minimal'
                                         readOnly
                                         width='100%'
                                />
                            </Field>
                            : null
                        }

                        {feed.type ?
                            <Field label='Тип'
                                   title='Тип'
                                   type='hor'
                                   style='dark'
                                   labelWidth={150}
                            >
                                <TextBox value={getFeedTypesText(feed.type)}
                                         onChange={() => {
                                         }}
                                         styleType='minimal'
                                         readOnly
                                         width='100%'
                                />
                            </Field>
                            : null
                        }

                        <Field label='Создано'
                               title='Создано'
                               type='hor'
                               style='dark'
                               labelWidth={150}
                        >
                            <TextBox value={feed.date_created || ''}
                                     onChange={() => {
                                     }}
                                     styleType='minimal'
                                     readOnly
                                     width='100%'
                            />
                        </Field>

                        <Field label='Обновлено'
                               title='Обновлено'
                               type='hor'
                               style='dark'
                               labelWidth={150}
                        >
                            <TextBox value={feed.date_updated || ''}
                                     onChange={() => {
                                     }}
                                     styleType='minimal'
                                     readOnly
                                     width='100%'
                            />
                        </Field>

                        <Field label='Статус'
                               title='Статус'
                               type='hor'
                               style='dark'
                               labelWidth={150}
                        >
                            <StatusBox value={feed.status}
                                       items={items}
                                       onChange={saveHandler.bind(this)}
                            />
                        </Field>
                    </>
                    : null
                }
            </div>
        )
    }

    const renderMessagesTab = (): React.ReactElement => {
        if (!feed.messages || !feed.messages.length) {
            return (
                <Empty message='Нет сообщений'/>
            )
        }

        return (
            <div key='messages' className={classes.tabContent}>
                <Title type='h2'>Сообщения</Title>

                <BlockingElement fetching={false} className={classes.messageList}>
                    {feed.messages.map((message: IFeedMessage) => renderMessage(message))}
                </BlockingElement>

                <Field label='Сообщение'
                       title='Тема'
                       type='vert'
                       style='dark'
                       labelWidth={150}
                >
                    <TextAreaBox value={messageText}
                                 onChange={(value: string) => setMessageText(value)}
                                 placeHolder='Введите текст сообщения'
                    />
                </Field>

                <Button type='apply'
                        icon='check'
                        onClick={() => saveMessage()}
                        disabled={fetching || messageText.trim() === ''}
                >Отправить</Button>
            </div>
        )
    }

    const tabs: ITab = useMemo((): ITab => {
        const tabsList: ITab = {
            info: {title: 'Информация', render: renderInfoTab()}
        }

        if (feed.type === 'feed') {
            tabsList.messages = {title: 'Сообщения', render: renderMessagesTab()}
        }

        return tabsList
    }, [feed, messageText, info])

    return (
        <Popup className={classes.PopupSupportInfo}>
            <BlockingElement fetching={fetching} className={classes.content}>
                <div className={classes.blockContent}>
                    {!feed.id
                        ? <Empty message='Заявка не найдена'/>
                        : <Tabs tabs={tabs} paddingFirstTab='popup'/>
                    }
                </div>
            </BlockingElement>

            <Footer>
                <Button type='regular'
                        icon='xmark'
                        onClick={closePopup.bind(this)}
                >Закрыть</Button>
            </Footer>
        </Popup>
    )
}

PopupSupportInfo.defaultProps = defaultProps
PopupSupportInfo.displayName = 'PopupSupportInfo'

export default function openPopupSupportInfo(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupSupportInfo), popupProps, undefined, block, displayOptions)
}
