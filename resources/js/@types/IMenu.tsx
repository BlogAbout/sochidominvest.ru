import {RouteNames} from '../helpers/routerHelper'
import {IconProp} from '@fortawesome/fontawesome-svg-core'

export interface IMenuLink {
    route: RouteNames
    title: string
    text?: string
    icon?: IconProp
    isSeparator?: boolean
    unavailable?: boolean
}

export interface ISubMenu {
    href: string
    title: string
    disabled: boolean
    icon: string
    description: string
    type: 'crm' | 'catalog'
    unavailable?: boolean
}
