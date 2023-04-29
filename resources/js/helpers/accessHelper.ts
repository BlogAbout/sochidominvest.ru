import {getUserFromStorage} from './userHelper'

export enum Rules {
    AUTH,
    IS_MANAGER,
    MORE_TARIFF_FREE,
    MORE_TARIFF_BASE,
    MORE_TARIFF_BUSINESS,
    SHOW_TARIFFS,

    SHOW_USERS,
    EDIT_USER,
    BLOCK_USER,
    REMOVE_USER,

    EDIT_BUILDING,
    REMOVE_BUILDING,

    EDIT_ARTICLE,
    REMOVE_ARTICLE,

    EDIT_COMPILATION,

    SHOW_FEEDS,
    PROCESS_FEED,
    CLOSE_FEED,
    REMOVE_FEED,

    SHOW_DEVELOPERS,
    ADD_DEVELOPER,
    EDIT_DEVELOPER,

    SHOW_AGENTS,
    ADD_AGENT,
    EDIT_AGENT,

    SHOW_CATEGORIES,
    ADD_CATEGORY,
    EDIT_CATEGORY,
    REMOVE_CATEGORY,

    SHOW_PRODUCTS,
    ADD_PRODUCT,
    EDIT_PRODUCT,
    REMOVE_PRODUCT,

    SHOW_QUESTIONS,
    ADD_QUESTION,
    EDIT_QUESTION,
    REMOVE_QUESTION,

    SHOW_POSTS,
    ADD_POST,
    EDIT_POST,
    REMOVE_POST,
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
