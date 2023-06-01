import {MessengerAction, MessengerActionTypes, MessengerState} from '../@types/messengerTypes'

const initialState: MessengerState = {
    onlineUsers: [],
    activeMessengerId: null,
    messengers: [],
    messages: [],
    newMessagesCounter: {},
    fetching: false,
    error: ''
}

export default function MessengerReducer(state: MessengerState = initialState, action: MessengerAction): MessengerState {
    switch (action.type) {
        case MessengerActionTypes.MESSENGER_JOINING_ONLINE_USERS: {
            return {
                ...state,
                onlineUsers: [...state.onlineUsers, ...action.payload]
            }
        }
        case MessengerActionTypes.MESSENGER_LEAVING_ONLINE_USERS: {
            return {
                ...state,
                onlineUsers: [...state.onlineUsers.filter((id: number) => id !== action.payload)]
            }
        }
        case MessengerActionTypes.MESSENGER_SET_ACTIVE_MESSENGER_ID:
            return {...state, activeMessengerId: action.payload}
        case MessengerActionTypes.MESSENGER_SET_MESSENGERS:
            return {...state, messengers: action.payload}
        case MessengerActionTypes.MESSENGER_SET_MESSAGES:
            return {...state, messages: action.payload}
        case MessengerActionTypes.MESSENGER_SET_NEW_MESSAGES_COUNTER: {
            const counter: { [key: number]: number } = {...state.newMessagesCounter}
            counter[action.payload.messengerId] = action.payload.count

            return {...state, newMessagesCounter: counter}
        }
        case MessengerActionTypes.MESSENGER_SET_FETCHING:
            return {...state, fetching: action.payload}
        case MessengerActionTypes.MESSENGER_SET_ERROR:
            return {...state, error: action.payload}
        default:
            return state
    }
}
