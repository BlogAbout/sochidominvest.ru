import {getUserFromStorage} from './userHelper'

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
