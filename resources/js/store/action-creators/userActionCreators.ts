import {UserAction, UserActionTypes} from '../@types/userTypes'
import {RouteNames} from '../../helpers/routerHelper'
import {IUser, IUserExternal, IUserSetting} from '../../@types/IUser'
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
    setUserRole: (role: 'director' | 'administrator' | 'manager' | 'subscriber'): UserAction => ({
        type: UserActionTypes.USER_ROLE,
        payload: role
    }),
    setUserId: (userId: number): UserAction => ({
        type: UserActionTypes.USER_ID,
        payload: userId
    }),
    setUserSetting: (setting: IUserSetting): UserAction => ({
        type: UserActionTypes.USER_SETTING,
        payload: setting
    }),
    setUsersOnline: (users: number[]): UserAction => ({
        type: UserActionTypes.USER_ONLINE,
        payload: users
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
    setUserAuth: (user: IUser) => async (dispatch: AppDispatch) => {
        localStorage.setItem('auth', 'true')
        localStorage.setItem('user', user ? JSON.stringify(user) : '')
        localStorage.setItem('id', user.id ? user.id.toString() : '')
        // localStorage.setItem('token', user.token || '')
        // localStorage.setItem('role', user.role || '')
        localStorage.setItem('settings', user.settings ? JSON.stringify(user.settings) : '')

        dispatch(UserActionCreators.setIsAuth(true))
        dispatch(UserActionCreators.setUser(user || {} as IUser))
        // dispatch(UserActionCreators.setUserRole(user.role || ''))
        dispatch(UserActionCreators.setUserId(user.id || 0))
        dispatch(UserActionCreators.setUserSetting(user.settings || {} as IUserSetting))

        // window.location.replace(RouteNames.P_DESKTOP)
    },
    logout: () => async (dispatch: AppDispatch) => {
        localStorage.clear()

        dispatch(UserActionCreators.setIsAuth(false))

        // window.location.replace(RouteNames.MAIN)
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
    },
}
