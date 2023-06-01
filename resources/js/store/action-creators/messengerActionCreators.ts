import {MessengerAction, MessengerActionTypes} from '../@types/messengerTypes'
import {IMessage, IMessenger} from '../../@types/IMessenger'
import {IFilter} from '../../@types/IFilter'
import {AppDispatch} from '../reducers'
import MessengerService from '../../api/MessengerService'

export const MessengerActionCreators = {
    joiningUsersOnline: (users: number[]): MessengerAction => ({
        type: MessengerActionTypes.MESSENGER_JOINING_ONLINE_USERS,
        payload: users
    }),
    leavingUserOnline: (user: number): MessengerAction => ({
        type: MessengerActionTypes.MESSENGER_LEAVING_ONLINE_USERS,
        payload: user
    }),
    setActiveMessengerId: (messengerId: number | null): MessengerAction => ({
        type: MessengerActionTypes.MESSENGER_SET_ACTIVE_MESSENGER_ID,
        payload: messengerId
    }),
    setMessengers: (messengers: IMessenger[]): MessengerAction => ({
        type: MessengerActionTypes.MESSENGER_SET_MESSENGERS,
        payload: messengers
    }),
    setMessages: (messages: IMessage[]): MessengerAction => ({
        type: MessengerActionTypes.MESSENGER_SET_MESSAGES,
        payload: messages
    }),
    setNewMessagesCounter: (messengerId: number, count: number): MessengerAction => ({
        type: MessengerActionTypes.MESSENGER_SET_NEW_MESSAGES_COUNTER,
        payload: {
            messengerId: messengerId,
            count: count
        }
    }),
    setFetching: (isFetching: boolean): MessengerAction => ({
        type: MessengerActionTypes.MESSENGER_SET_FETCHING,
        payload: isFetching
    }),
    setError: (error: string): MessengerAction => ({
        type: MessengerActionTypes.MESSENGER_SET_ERROR,
        payload: error
    }),
    changeActiveMessengerId: (messengerId: number | null) => async (dispatch: AppDispatch, getState: any) => {
        if (getState().messengerReducer.activeMessengerId === messengerId) {
            return
        }

        dispatch(MessengerActionCreators.setActiveMessengerId(messengerId))

        if (messengerId) {

        } else {

        }
    },
    fetchMessengerList: (filter: IFilter) => async (dispatch: AppDispatch) => {
        dispatch(MessengerActionCreators.setFetching(true))

        try {
            const response = await MessengerService.fetchMessengers(filter)

            if (response.status === 200) {
                dispatch(MessengerActionCreators.setMessengers(response.data.data))
            } else {
                dispatch(MessengerActionCreators.setError('Ошибка загрузки данных'))
            }
        } catch (e) {
            dispatch(MessengerActionCreators.setError('Непредвиденная ошибка загрузки данных'))
            console.error('Непредвиденная ошибка загрузки данных', e)
        }
    },
    fetchMessagesList: (messengerId: number) => async (dispatch: AppDispatch) => {
        dispatch(MessengerActionCreators.setFetching(true))

        try {
            const response = await MessengerService.fetchMessages(messengerId)

            if (response.status === 200) {
                dispatch(MessengerActionCreators.setMessengers(response.data.data))
            } else {
                dispatch(MessengerActionCreators.setError('Ошибка загрузки данных'))
            }
        } catch (e) {
            dispatch(MessengerActionCreators.setError('Непредвиденная ошибка загрузки данных'))
            console.error('Непредвиденная ошибка загрузки данных', e)
        }
    }
}
