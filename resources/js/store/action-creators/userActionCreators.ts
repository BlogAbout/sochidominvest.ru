import {AxiosResponse} from 'axios'
import {UserAction, UserActionTypes} from '../@types/userTypes'
import {RouteNames} from '../../helpers/routerHelper'
import {IUser, IUserExternal} from '../../@types/IUser'
import {IFilter} from '../../@types/IFilter'
import {AppDispatch} from '../reducers'
import UserService from '../../api/UserService'

export const UserActionCreators = {
    setIsAuth: (auth: boolean): UserAction => ({
        type: UserActionTypes.USER_AUTH,
        payload: auth
    }),
    setUser: (user: IUser): UserAction => ({
        type: UserActionTypes.USER,
        payload: user
    }),
    setUsers: (users: IUser[]): UserAction => ({
        type: UserActionTypes.USER_FETCH_LIST,
        payload: users
    }),
    setUsersExternal: (users: IUserExternal[]): UserAction => ({
        type: UserActionTypes.USER_EXTERNAL_FETCH_LIST,
        payload: users
    }),
    setFetching: (payload: boolean): UserAction => ({
        type: UserActionTypes.USER_IS_FETCHING,
        payload
    }),
    setError: (payload: string): UserAction => ({
        type: UserActionTypes.USER_ERROR,
        payload
    }),
    setUserAuth: (response: AxiosResponse) => async (dispatch: AppDispatch) => {
        try {
            if (response.status === 200) {
                const user: IUser = response.data.data

                localStorage.setItem('auth', 'true')
                localStorage.setItem('user', JSON.stringify(user))

                dispatch(UserActionCreators.setIsAuth(true))
                dispatch(UserActionCreators.setUser(user))
            } else {
                localStorage.clear()
                dispatch(UserActionCreators.setError('Ошибка авторизации'))
            }
        } catch (e) {
            localStorage.clear()
            dispatch(UserActionCreators.setError('Непредвиденная ошибка авторизации'))
            console.error('Непредвиденная ошибка авторизации', e)
        }
    },
    logout: () => async (dispatch: AppDispatch) => {
        try {
            const response = await UserService.logoutUser()

            if (response.status === 200) {
                window.location.replace(RouteNames.MAIN)
            } else {
                dispatch(UserActionCreators.setError('Ошибка при выходе из системы'))
            }
        } catch (e) {
            dispatch(UserActionCreators.setError('Непредвиденная ошибка при выходе из системы'))
            console.error('Непредвиденная ошибка при выходе из системы', e)
        } finally {
            localStorage.clear()

            dispatch(UserActionCreators.setIsAuth(false))
        }
    },
    fetchUserList: (filter: IFilter) => async (dispatch: AppDispatch) => {
        dispatch(UserActionCreators.setFetching(true))

        try {
            const response = await UserService.fetchUsers(filter)

            if (response.status === 200) {
                dispatch(UserActionCreators.setUsers(response.data.data))
            } else {
                dispatch(UserActionCreators.setError('Ошибка загрузки данных'))
            }
        } catch (e) {
            dispatch(UserActionCreators.setError('Непредвиденная ошибка загрузки данных'))
            console.error('Непредвиденная ошибка загрузки данных', e)
        }
    },
    fetchUserExternalList: (filter: IFilter) => async (dispatch: AppDispatch) => {
        dispatch(UserActionCreators.setFetching(true))

        try {
            const response = await UserService.fetchUsersExternal(filter)

            if (response.status === 200) {
                dispatch(UserActionCreators.setUsersExternal(response.data.data))
            } else {
                dispatch(UserActionCreators.setError('Ошибка загрузки данных'))
            }
        } catch (e) {
            dispatch(UserActionCreators.setError('Непредвиденная ошибка загрузки данных'))
            console.error('Непредвиденная ошибка загрузки данных', e)
        }
    }
}
