import {ISelector} from '../@types/ISelector'

export const developerTypes: ISelector[] = [
    {key: 'constructionCompany', text: 'Строительная компания'}
]

export const getDeveloperTypeText = (key?: string) => {
    if (!key) {
        return ''
    }

    const find = developerTypes.find((item: ISelector) => item.key === key)
    return find ? find.text : ''
}
