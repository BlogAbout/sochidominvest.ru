import React from 'react'
import classNames from 'classnames/bind'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import withStore from '../../hoc/withStore'
import {checkRules, Rules} from '../../../helpers/accessHelper'
import MessengerService from '../../../api/MessengerService'
import UserService from '../../../api/UserService'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {IFilter} from '../../../@types/IFilter'
import {IUser} from '../../../@types/IUser'
import {IMessage, IMessenger, IMessengerMember} from '../../../@types/IMessenger'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import {findUser, getUserAvatar, getUserFromStorage, getUserName} from '../../../helpers/userHelper'
import {findMembersIds} from '../../../helpers/messengerHelper'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import {Footer, Popup} from '../Popup/Popup'
import Button from '../../form/Button/Button'
import Empty from '../../ui/Empty/Empty'
import UserItem from './components/UserItem/UserItem'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import TextBox from '../../form/TextBox/TextBox'
import MessengerItem from './components/MessengerItem/MessengerItem'
import MessageItem from './components/MessageItem/MessageItem'
import MessengerInfo from './components/MessengerInfo/MessengerInfo'
import classes from './PopupMessenger.module.scss'

interface Props extends PopupProps {
    currentMessengerId?: number
    currentMemberId?: number | null
}

interface State {
    currentMessengerId: number
    currentMemberId: number | null
    currentMessengerInfo: IMessenger | null
    textMessage: string
    messengers: IMessenger[]
    fetchingMessengers: boolean
    fetchingMessages: boolean
    fetchingUsers: boolean
    user: IUser
    users: IUser[]
}

const cx = classNames.bind(classes)

class PopupMessenger extends React.Component<Props, State> {
    refMessenger: React.MutableRefObject<any> | null = null

    state: State = {
        currentMessengerId: this.props.currentMessengerId || 0,
        currentMemberId: this.props.currentMemberId || null,
        currentMessengerInfo: null,
        textMessage: '',
        messengers: [],
        fetchingMessengers: false,
        fetchingMessages: false,
        fetchingUsers: false,
        user: {} as IUser,
        users: []
    }

    componentDidMount() {
        // window.events.addListener('messengerNewMessage', this.updateMessagesHandler)
        // window.events.addListener('messengerCreateMessenger', this.updateMessengerHandler)
        // window.events.addListener('messengerReadMessage', this.readMessageHandler)

        const user: IUser | null = getUserFromStorage()

        if (!user) {
            this.close()
        }

        this.setState({user: user} as State)

        this.refMessenger = React.createRef()

        this.fetchUserList()
        // this.fetchMessengerList()
        //
        // if (this.state.currentMessengerId > 0) {
        //     this.fetchMessagesList(this.state.currentMessengerId)
        // } else if (this.state.currentMemberId) {
        //     const user = findUser(this.state.users, this.state.currentMemberId)
        //
        //     if (user) {
        //         this.findMessengerByUser(user)
        //         this.setState({currentMemberId: null})
        //     }
        // }
    }

    componentWillUnmount() {
        //     window.events.removeListener('messengerNewMessage', this.updateMessagesHandler)
        //     window.events.removeListener('messengerCreateMessenger', this.updateMessengerHandler)
        //     window.events.removeListener('messengerReadMessage', this.readMessageHandler)

        removePopup(this.props.blockId ? this.props.blockId : '')
    }

    close = (): void => {
        removePopup(this.props.id || '')
    }

    fetchUserList = (): void => {
        this.setState({fetchingUsers: true} as State)

        UserService.fetchUsers({} as IFilter)
            .then((response: any) => this.setState({users: response.data.data} as State))
            .catch((error: any) => console.error('Произошла ошибка загрузки данных', error))
            .finally(() => this.setState({fetchingUsers: false} as State))
    }

    fetchMessengerList = (): void => {
        this.setState({fetchingMessengers: true} as State)

        MessengerService.fetchMessengers({} as IFilter)
            .then((response: any) => {
                this.setState({messengers: response.data.data} as State)

                if (this.state.currentMemberId) {
                    const user = findUser(this.state.users, this.state.currentMemberId)

                    if (user) {
                        this.findMessengerByUser(user)
                        this.setState({currentMemberId: null} as State)
                    }
                }
            })
            .catch((error: any) => console.error('Произошла ошибка загрузки данных', error))
            .finally(() => this.setState({fetchingMessengers: false} as State))
    }

    fetchMessagesList = (currentMessengerId: number): void => {
        this.setState({fetchingMessages: true} as State)

        MessengerService.fetchMessages(currentMessengerId)
            .then((response: any) => this.setState({currentMessengerInfo: response.data.data} as State, this.submitReadHandler))
            .catch((error: any) => console.error('Произошла ошибка загрузки данных', error))
            .finally(() => this.setState({fetchingMessages: false} as State))
    }

    // Поиск существующего чата с выбранным пользователем
    findMessengerByUser = (user: IUser): void => {
        if (!user || !user.id) {
            return
        }

        if (this.state.messengers && this.state.messengers.length) {
            const findMessenger = this.state.messengers.find((messenger: IMessenger) => user.id && findMembersIds(messenger.members).includes(user.id))

            if (findMessenger && findMessenger.id) {
                this.setState({currentMessengerInfo: findMessenger, currentMessengerId: findMessenger.id} as State)
                this.fetchMessagesList(findMessenger.id)

                return
            }
        }

        const memberIds: number[] = []
        memberIds.push(this.state.user.id || 0)
        memberIds.push(user.id)

        const members: IMessengerMember[] = memberIds.map((userId: number) => {
            return {
                userId: userId,
                readed: null,
                deleted: null,
                active: 1
            }
        })

        this.setState({
            currentMessengerInfo: {
                id: null,
                author_id: this.state.user.id,
                name: '',
                type: 'message',
                member_ids: memberIds,
                members: members,
                messages: []
            } as IMessenger,
            currentMessengerId: -2
        } as State)
    }

    // Отправка сообщения в сокет
    submitMessageHandler = (): void => {
        if (this.state.textMessage.trim() === '' || !this.state.currentMessengerInfo) {
            return
        }

        const attendees: number[] = this.state.currentMessengerInfo.member_ids
            ? this.state.currentMessengerInfo.member_ids
            : findMembersIds(this.state.currentMessengerInfo.members)
        const message: IMessage = {
            id: null,
            messenger_id: this.state.currentMessengerInfo.id,
            is_active: 1,
            type: 'message',
            text: this.state.textMessage,
            author_id: this.state.user.id,
            message_id: null,
            attendee_ids: attendees
        }

        MessengerService.sendMessage(message)
            .then((response: any) => {
                this.setState({textMessage: ''} as State)

                console.log('response', response)
            })
            .catch((error: any) => {
                console.log('error', error)
            })

        // window.events.emit('messengerSendMessage', message)
    }

    submitReadHandler = (): void => {
        if (!this.state.currentMessengerInfo) {
            return
        }

        // Todo: Переделать прочтение сообщения

        // const attendees: number[] = this.state.currentMessengerInfo.member_ids
        //     ? this.state.currentMessengerInfo.member_ids
        //     : findMembersIds(this.state.currentMessengerInfo.members)
        // const message: IMessage = {
        //     id: null,
        //     messengerId: this.state.currentMessengerInfo.id,
        //     active: 1,
        //     type: 'read',
        //     text: String(this.state.currentMessengerInfo.messages[this.state.currentMessengerInfo.messages.length - 1].id),
        //     author: this.state.user.id,
        //     parentMessageId: null,
        //     attendees: attendees
        // }
        //
        // this.setState({textMessage: ''} as State)
        //
        // window.events.emit('messengerSendMessage', message)
    }

    // Обновление активного чата сообщений при отправке
    updateMessagesHandler = (message: IMessage): void => {
        if (this.state.currentMessengerId <= 0 && this.state.messengers && this.state.messengers.length) {
            const findIndex = this.state.messengers.findIndex((messenger: IMessenger) => messenger.id === message.messenger_id)

            if (findIndex !== -1) {
                const updateMessenger: IMessenger = JSON.parse(JSON.stringify(this.state.messengers[findIndex]))
                updateMessenger.messages = [message]

                this.setState({
                    messengers: [
                        ...this.state.messengers.slice(0, findIndex),
                        updateMessenger,
                        ...this.state.messengers.slice(findIndex + 1)
                    ]
                } as State)
            }
        }

        if (this.state.currentMessengerId === message.messenger_id) {
            const updateMessengerInfo: IMessenger = JSON.parse(JSON.stringify(this.state.currentMessengerInfo))

            if (updateMessengerInfo.messages) {
                updateMessengerInfo.messages.push(message)
            } else {
                updateMessengerInfo.messages = [message]
            }

            this.setState({currentMessengerInfo: updateMessengerInfo} as State, this.onScrollContainerTopHandler)

            this.submitReadHandler()
        }
    }

    // Обновление данных чатов
    updateMessengerHandler = (message: IMessage): void => {
        if (message.author_id === this.state.user.id && this.state.currentMessengerId === -2) {
            this.setState({currentMessengerId: message.messenger_id || 0} as State)
            this.fetchMessagesList(message.messenger_id || 0)
        } else if (this.state.currentMessengerId <= 0) {
            this.fetchMessengerList()
        }
    }

    // Пометка сообщений прочитанными
    readMessageHandler = (message: IMessage): void => {
        // if (message.author === this.state.userId && this.state.currentMessengerId === message.messenger_id) {
        //     const updateMessengerInfo: IMessenger = JSON.parse(JSON.stringify(this.state.currentMessengerInfo))
        //
        //     if (updateMessengerInfo.members) {
        //         updateMessengerInfo.members[message.author].readed = parseInt(message.text)
        //     }
        //
        //     this.setState({currentMessengerInfo: updateMessengerInfo} as State)
        // } else if (this.state.currentMessengerId <= 0 && this.state.messengers && this.state.messengers.length) {
        //     const findIndex = this.state.messengers.findIndex((messenger: IMessenger) => messenger.id === message.id)
        //
        //     if (findIndex !== -1) {
        //         const updateMessenger: IMessenger = JSON.parse(JSON.stringify(this.state.messengers[findIndex]))
        //
        //         if (message.author_id && updateMessenger.members) {
        //             updateMessenger.members[message.author_id].readed = parseInt(message.text)
        //         }
        //
        //         this.setState({
        //             messengers: [
        //                 ...this.state.messengers.slice(0, findIndex),
        //                 updateMessenger,
        //                 ...this.state.messengers.slice(findIndex + 1)
        //             ]
        //         } as State)
        //     }
        // }
    }

    // Прокрутка чата к последнему сообщению
    onScrollContainerTopHandler = (): void => {
        if (this.refMessenger) {
            this.refMessenger.current.scrollTop = this.refMessenger.current.scrollHeight
        }
    }

    renderMessengerList = (): React.ReactElement => {
        return (
            <>
                <div className={classes.messenger}>
                    <BlockingElement fetching={this.state.fetchingMessengers || this.state.fetchingUsers}
                                     className={classes.list}
                    >
                        {this.state.messengers && this.state.messengers.length ?
                            this.state.messengers.map((messenger: IMessenger) => {
                                return (
                                    <MessengerItem key={messenger.id}
                                                   messenger={messenger}
                                                   onClick={() => {
                                                       this.setState({currentMessengerId: messenger.id || 0} as State)
                                                       this.fetchMessagesList(messenger.id || 0)
                                                   }}
                                                   users={this.state.users}
                                                   user={this.state.user}
                                    />
                                )
                            })
                            : <Empty message='Нет активных чатов'/>
                        }
                    </BlockingElement>
                </div>

                <div className={classes.link}>
                    <span onClick={() => this.setState({currentMessengerId: -1} as State)}>
                        <FontAwesomeIcon icon='plus'/>
                        <span>Начать чат</span>
                    </span>
                </div>
            </>
        )
    }

    renderUsers = (): React.ReactElement => {
        return (
            <>
                <div className={classes.users}>
                    <BlockingElement fetching={this.state.fetchingUsers} className={classes.list}>
                        {this.state.users && this.state.users.length ?
                            this.state.users.map((user: IUser) => {
                                if (user.is_block || user.is_active !== 1 || user.id === this.state.user.id) {
                                    return null
                                }

                                if (!checkRules([Rules.IS_MANAGER])) {
                                    return null
                                }

                                return (
                                    <UserItem key={user.id}
                                              user={user}
                                              onClick={() => this.findMessengerByUser(user)}
                                    />
                                )
                            })
                            : <Empty message='Нет пользователей'/>
                        }
                    </BlockingElement>
                </div>

                <div className={cx({'link': true, 'back': true})}>
                    <span onClick={() => this.setState({currentMessengerId: 0} as State)}>
                        <FontAwesomeIcon icon='arrow-left-long'/>
                        <span>Назад</span>
                    </span>
                </div>
            </>
        )
    }

    renderMessenger = (): React.ReactElement | null => {
        if (!this.state.currentMessengerInfo) {
            return null
        }

        if (this.refMessenger && this.refMessenger.current) {
            this.refMessenger.current.scrollTop = this.refMessenger.current.scrollHeight
        }

        const memberId: number = findMembersIds(this.state.currentMessengerInfo.members).find((id: number) => id !== this.state.user.id) || 0
        const member = findUser(this.state.users, memberId)
        const avatarUrl = getUserAvatar(this.state.users, memberId)
        const memberName = getUserName(
            this.state.users,
            this.state.user.id === this.state.currentMessengerInfo.author_id
                ? memberId : this.state.currentMessengerInfo.author_id
        )

        return (
            <>
                <MessengerInfo memberId={memberId}
                               member={member}
                               avatarUrl={avatarUrl}
                               memberName={memberName}
                               onClickBack={() => this.setState({currentMessengerId: 0} as State)}
                />

                <div className={classes.messages}>
                    <BlockingElement fetching={this.state.fetchingMessages || this.state.fetchingUsers}
                                     className={classes.list}
                                     innerRef={this.refMessenger}
                    >
                        {this.state.currentMessengerInfo.messages && this.state.currentMessengerInfo.messages.length ?
                            this.state.currentMessengerInfo.messages.map((message: IMessage) => {
                                return (
                                    <MessageItem key={message.id}
                                                 message={message}
                                                 userId={this.state.user.id || 0}
                                                 memberId={memberId}
                                                 messenger={this.state.currentMessengerInfo}
                                    />
                                )
                            })
                            : <Empty message='Нет сообщений'/>
                        }
                    </BlockingElement>
                </div>

                <div className={classes.field}>
                    <TextBox value={this.state.textMessage}
                             onChange={(value: string) => this.setState({textMessage: value} as State)}
                             placeHolder='Введите текст сообщения'
                    />

                    <Button type='save'
                            icon='check'
                            onClick={() => this.submitMessageHandler()}
                            disabled={this.state.fetchingUsers}
                            title='Отправить'
                    />
                </div>
            </>
        )
    }

    renderPanelByType = (): React.ReactElement | null => {
        if (this.state.currentMessengerId === 0) {
            return this.renderMessengerList()
        } else if (this.state.currentMessengerId === -1) {
            return this.renderUsers()
        } else {
            return this.renderMessenger()
        }
    }

    render = () => {
        return (
            <Popup className={classes.PopupMessenger}>
                <div className={classes.content}>
                    <div className={classes.blockContent}>
                        {this.renderPanelByType()}
                    </div>
                </div>

                <Footer>
                    <Button type='regular'
                            icon='arrow-rotate-left'
                            onClick={this.close.bind(this)}
                            className='marginLeft'
                            title='Закрыть'
                    >Закрыть</Button>
                </Footer>
            </Popup>
        )
    }
}

export default function openPopupMessenger(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true,
        isFixed: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupMessenger), popupProps, undefined, block, displayOptions)
}
