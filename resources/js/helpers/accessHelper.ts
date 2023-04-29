import {getUserFromStorage} from './userHelper'

export enum Rules {
    AUTH,
    MORE_TARIFF_FREE,
    MORE_TARIFF_BASE,
    MORE_TARIFF_BUSINESS,

    SHOW_USERS,
    EDIT_USER,
    BLOCK_USER,
    REMOVE_USER,

    EDIT_BUILDING,
    REMOVE_BUILDING,

    EDIT_ARTICLE,
    REMOVE_ARTICLE,

    EDIT_COMPILATION,
    SHOW_TARIFFS,
    SHOW_DEVELOPERS,
    SHOW_AGENTS,
    ADD_AGENT,
    ADD_DEVELOPER,
    EDIT_AGENT,
    EDIT_DEVELOPER,
}

export const checkRules = (rules: Rules[] = [], id?: number | null) => {
    let result = true

    rules.forEach((rule: Rules) => {
        switch (rule) {
            case Rules.AUTH:
                // проверить, что авторизован
                result = true
                break
            case Rules.MORE_TARIFF_FREE:
                result = true
                break
            case Rules.MORE_TARIFF_BASE:
                result = true
                break
            case Rules.MORE_TARIFF_BUSINESS:
                result = true
                break
            case Rules.SHOW_USERS:
                result = true
                break
            case Rules.EDIT_USER:
                result = true
                break
            case Rules.BLOCK_USER:
                result = true
                break
            case Rules.REMOVE_USER:
                result = true
                break
            case Rules.EDIT_BUILDING:
                // проверить, что id равен пользователю
                result = true
                break
            case Rules.REMOVE_BUILDING:
                // проверить, что id равен пользователю
                result = true
                break
            case Rules.EDIT_ARTICLE:
                result = true
                break
            case Rules.REMOVE_ARTICLE:
                result = true
                break
            case Rules.EDIT_COMPILATION:
                result = true
                break
            case Rules.SHOW_TARIFFS:
                result = true
                break
            case Rules.SHOW_DEVELOPERS:
                result = true
                break
            case Rules.ADD_DEVELOPER:
                result = true
                break
            case Rules.EDIT_DEVELOPER:
                result = true
                break
            case Rules.SHOW_AGENTS:
                result = true
                break
            case Rules.ADD_AGENT:
                result = true
                break
            case Rules.EDIT_AGENT:
                result = true
                break
            default:
                result = false
        }
    })

    return result
}

export const allowForRole = (roles: ('director' | 'administrator' | 'manager' | 'subscriber')[] = [], currentRole?: 'director' | 'administrator' | 'manager' | 'subscriber') => {
    if (!roles || !roles.length) {
        return true
    }

    if (currentRole) {
        return roles.includes(currentRole)
    }

    const user = getUserFromStorage()

    if (user) {
        return '' // Todo return roles.includes(user.role)
    }

    return false
}

export const allowForTariff = (tariffs: ('free' | 'base' | 'business' | 'effectivePlus')[] = [], currentTariff?: 'free' | 'base' | 'business' | 'effectivePlus') => {
    if (!tariffs || !tariffs.length) {
        return true
    }

    if (allowForRole(['director', 'administrator', 'manager'])) {
        return true
    }

    if (currentTariff) {
        return tariffs.includes(currentTariff)
    }

    const user = getUserFromStorage()

    if (user) {
        return '' // Todo tariffs.includes(user.tariff)
    }

    return false
}
