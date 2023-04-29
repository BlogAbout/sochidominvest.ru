import {ISelector} from '../@types/ISelector'
import {IUser} from '../@types/IUser'

/**
 * Список ролей
 */
export const rolesList: ISelector[] = [
    {key: '1', text: 'Подписчик', isRegistration: true},
    {key: '2', text: 'Менеджер', isRegistration: false},
    {key: '3', text: 'Администратор', isRegistration: false},
    {key: '4', text: 'Директор', isRegistration: false, readOnly: true, hidden: true}
]

export const getRoleUserText = (key: string) => {
    const find = rolesList.find((item: ISelector) => item.key === key)
    return find ? find.text : ''
}

export const findUser = (users: IUser[], userId?: number | null) => {
    if (!userId || !users || !users.length) {
        return null
    }

    const user =  users.find((user: IUser) => user.id === userId)

    return user || null
}

export const getUserName = (users: IUser[], userId?: number | null) => {
    if (!userId || !users || !users.length) {
        return 'Пользователь не найден'
    }

    const findUser = users.find((user: IUser) => user.id === userId)

    if (!findUser) {
        return 'Пользователь не найден'
    }

    return findUser.name
}

export const getUserAvatar = (users: IUser[], userId?: number | null) => {
    if (!userId || !users || !users.length) {
        return ''
    }

    const findUser = users.find((user: IUser) => user.id === userId)

    if (!findUser) {
        return ''
    }

    return '' //Todo return findUser.avatar
}

export const getUserSetting = (param: string, defaultValue: string | number = ''): string | number => {
    let settingsString = localStorage.getItem('settings')

    if (!settingsString) {
        return defaultValue
    }

    const settings = JSON.parse(settingsString)

    if (!(param in settings)) {
        return defaultValue
    }

    return settings[param]
}

export const getUserFromStorage = (): IUser | null => {
    if (localStorage.getItem('user')) {
        return JSON.parse(localStorage.getItem('user') || '')
    }

    return null
}
