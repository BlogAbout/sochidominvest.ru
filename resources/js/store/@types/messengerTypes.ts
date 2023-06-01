import {IMessage, IMessenger} from '../../@types/IMessenger'

export interface MessengerState {
    onlineUsers: number[]
    activeMessengerId: number | null
    messengers: IMessenger[]
    messages: IMessage[]
    newMessagesCounter: { [key: number]: number }
    fetching: boolean
    error: string
}

export enum MessengerActionTypes {
    MESSENGER_JOINING_ONLINE_USERS = 'MESSENGER_JOINING_ONLINE_USERS',
    MESSENGER_LEAVING_ONLINE_USERS = 'MESSENGER_LEAVING_ONLINE_USERS',
    MESSENGER_SET_ACTIVE_MESSENGER_ID = 'MESSENGER_SET_ACTIVE_MESSENGER_ID',
    MESSENGER_SET_MESSENGERS = 'MESSENGER_SET_MESSENGERS',
    MESSENGER_SET_MESSAGES = 'MESSENGER_SET_MESSAGES',
    MESSENGER_SET_NEW_MESSAGES_COUNTER = 'MESSENGER_SET_NEW_MESSAGES_COUNTER',
    MESSENGER_SET_FETCHING = 'MESSENGER_SET_FETCHING',
    MESSENGER_SET_ERROR = 'MESSENGER_SET_ERROR'
}

interface MessengerJoiningOnlineUsersAction {
    type: MessengerActionTypes.MESSENGER_JOINING_ONLINE_USERS
    payload: number[]
}

interface MessengerLeavingOnlineUsersAction {
    type: MessengerActionTypes.MESSENGER_LEAVING_ONLINE_USERS
    payload: number
}

interface MessengerSetActiveMessengerAction {
    type: MessengerActionTypes.MESSENGER_SET_ACTIVE_MESSENGER_ID
    payload: number | null
}

interface MessengerSetMessengersAction {
    type: MessengerActionTypes.MESSENGER_SET_MESSENGERS
    payload: IMessenger[]
}

interface MessengerSetMessagesAction {
    type: MessengerActionTypes.MESSENGER_SET_MESSAGES
    payload: IMessage[]
}

interface MessengerSetNewMessagesCounterAction {
    type: MessengerActionTypes.MESSENGER_SET_NEW_MESSAGES_COUNTER
    payload: {
        messengerId: number
        count: number
    }
}

interface MessengerSetFetchingAction {
    type: MessengerActionTypes.MESSENGER_SET_FETCHING
    payload: boolean
}

interface MessengerSetErrorAction {
    type: MessengerActionTypes.MESSENGER_SET_ERROR
    payload: string
}

export type MessengerAction =
    MessengerJoiningOnlineUsersAction
    | MessengerLeavingOnlineUsersAction
    | MessengerSetActiveMessengerAction
    | MessengerSetMessengersAction
    | MessengerSetMessagesAction
    | MessengerSetNewMessagesCounterAction
    | MessengerSetFetchingAction
    | MessengerSetErrorAction
