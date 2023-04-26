import {getUserFromStorage} from './userHelper'

export enum Rules {
    AUTH,
    MORE_TARIFF_FREE,
    MORE_TARIFF_BASE,
    MORE_TARIFF_BUSINESS,
    EDIT_BUILDING,
    EDIT_COMPILATION
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
            case Rules.EDIT_BUILDING:
                // проверить, что id равен пользователю
                result = true
                break
            case Rules.EDIT_COMPILATION:
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
