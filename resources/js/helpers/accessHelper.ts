import {getUserFromStorage} from './userHelper'

export enum Rules {
    AUTH,
    IS_ADMINISTRATOR,
    IS_MANAGER,
    MORE_TARIFF_FREE,
    MORE_TARIFF_BASE,
    MORE_TARIFF_BUSINESS,
    SHOW_TARIFFS,

    SHOW_USERS,
    ADD_USER,
    EDIT_USER,
    BLOCK_USER,
    REMOVE_USER,

    ADD_BUILDING,
    EDIT_BUILDING,
    REMOVE_BUILDING,

    ADD_ARTICLE,
    EDIT_ARTICLE,
    REMOVE_ARTICLE,

    SHOW_COMPILATION,
    ADD_COMPILATION,
    EDIT_COMPILATION,
    REMOVE_COMPILATION,

    SHOW_FEEDS,
    EDIT_FEED,
    PROCESS_FEED,
    CLOSE_FEED,
    REMOVE_FEED,

    SHOW_DEVELOPERS,
    ADD_DEVELOPER,
    EDIT_DEVELOPER,
    REMOVE_DEVELOPER,

    SHOW_AGENTS,
    ADD_AGENT,
    EDIT_AGENT,
    REMOVE_AGENT,

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

    SHOW_PAYMENTS,
    ADD_PAYMENT,
    EDIT_PAYMENT,
    COPY_PAYMENT,
    REMOVE_PAYMENT,

    SHOW_DOCUMENTS,
    ADD_DOCUMENT,
    EDIT_DOCUMENT,
    REMOVE_DOCUMENT,

    SHOW_MAILINGS,
    ADD_MAILING,
    EDIT_MAILING,
    REMOVE_MAILING,

    SHOW_BOOKINGS,
    ADD_BOOKING,
    EDIT_BOOKING,
    REMOVE_BOOKING,

    SHOW_TAGS,
    ADD_TAG,
    EDIT_TAG,
    REMOVE_TAG,

    SHOW_CHECKERS,
    ADD_CHECKER,
    EDIT_CHECKER,
    REMOVE_CHECKER,

    SHOW_PARTNERS,
    ADD_PARTNER,
    EDIT_PARTNER,
    REMOVE_PARTNER,

    SHOW_BUSINESS_PROCESSES,
    ADD_BUSINESS_PROCESS,
    EDIT_BUSINESS_PROCESS,
    REMOVE_BUSINESS_PROCESS,
    RUN_BUSINESS_PROCESS,

    SHOW_ATTACHMENTS,
    ADD_ATTACHMENT,
    EDIT_ATTACHMENT,
    REMOVE_ATTACHMENT,
}

export const checkRules = (rules: Rules[] = [], id?: number | null) => {
    let result = true

    rules.forEach((rule: Rules) => {
        switch (rule) {
            case Rules.AUTH:
                // проверить, что авторизован
                result = true
                break
            case Rules.IS_ADMINISTRATOR:
            case Rules.IS_MANAGER:
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
            case Rules.ADD_USER:
            case Rules.EDIT_USER:
                result = true
                break
            case Rules.BLOCK_USER:
                result = true
                break
            case Rules.REMOVE_USER:
                result = true
                break
            case Rules.ADD_BUILDING:
            case Rules.EDIT_BUILDING:
                // проверить, что id равен пользователю
                result = true
                break
            case Rules.REMOVE_BUILDING:
                // проверить, что id равен пользователю
                result = true
                break
            case Rules.ADD_ARTICLE:
            case Rules.EDIT_ARTICLE:
                result = true
                break
            case Rules.REMOVE_ARTICLE:
                result = true
                break
            case Rules.SHOW_COMPILATION:
            case Rules.ADD_COMPILATION:
            case Rules.EDIT_COMPILATION:
            case Rules.REMOVE_COMPILATION:
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
                // проверить, что id равен пользователю
                result = true
                break
            case Rules.REMOVE_DEVELOPER:
                // проверить, что id равен пользователю
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
            case Rules.REMOVE_AGENT:
                result = true
                break
            case Rules.SHOW_DOCUMENTS:
                result = true
                break
            case Rules.ADD_DOCUMENT:
            case Rules.EDIT_DOCUMENT:
                // проверить, что id равен пользователю
                result = true
                break
            case Rules.REMOVE_DOCUMENT:
                // проверить, что id равен пользователю
                result = true
                break
            case Rules.SHOW_TAGS:
                result = true
                break
            case Rules.ADD_TAG:
            case Rules.EDIT_TAG:
                result = true
                break
            case Rules.REMOVE_TAG:
                result = true
                break
            case Rules.SHOW_FEEDS:
            case Rules.EDIT_FEED:
            case Rules.PROCESS_FEED:
            case Rules.CLOSE_FEED:
            case Rules.REMOVE_FEED:
            case Rules.SHOW_CATEGORIES:
            case Rules.ADD_CATEGORY:
            case Rules.EDIT_CATEGORY:
            case Rules.REMOVE_CATEGORY:
            case Rules.SHOW_PRODUCTS:
            case Rules.ADD_PRODUCT:
            case Rules.EDIT_PRODUCT:
            case Rules.REMOVE_PRODUCT:
            case Rules.SHOW_QUESTIONS:
            case Rules.ADD_QUESTION:
            case Rules.EDIT_QUESTION:
            case Rules.REMOVE_QUESTION:
            case Rules.SHOW_POSTS:
            case Rules.ADD_POST:
            case Rules.EDIT_POST:
            case Rules.REMOVE_POST:
            case Rules.SHOW_PAYMENTS:
            case Rules.ADD_PAYMENT:
            case Rules.EDIT_PAYMENT:
            case Rules.COPY_PAYMENT:
            case Rules.REMOVE_PAYMENT:
            case Rules.SHOW_MAILINGS:
            case Rules.ADD_MAILING:
            case Rules.EDIT_MAILING:
            case Rules.REMOVE_MAILING:
            case Rules.SHOW_BOOKINGS:
            case Rules.ADD_BOOKING:
            case Rules.EDIT_BOOKING:
            case Rules.REMOVE_BOOKING:
            case Rules.SHOW_CHECKERS:
            case Rules.ADD_CHECKER:
            case Rules.EDIT_CHECKER:
            case Rules.REMOVE_CHECKER:
            case Rules.SHOW_PARTNERS:
            case Rules.ADD_PARTNER:
            case Rules.EDIT_PARTNER:
            case Rules.REMOVE_PARTNER:
            case Rules.SHOW_BUSINESS_PROCESSES:
            case Rules.ADD_BUSINESS_PROCESS:
            case Rules.EDIT_BUSINESS_PROCESS:
            case Rules.REMOVE_BUSINESS_PROCESS:
            case Rules.RUN_BUSINESS_PROCESS:
            case Rules.SHOW_ATTACHMENTS:
            case Rules.ADD_ATTACHMENT:
            case Rules.EDIT_ATTACHMENT:
            case Rules.REMOVE_ATTACHMENT:
            default:
                result = true
        }
    })

    return result
}
