import {IUser} from './IUser'
import {IAttachment} from './IAttachment'

export interface IPartner {
    id: number | null
    name: string
    description: string
    info?: IPartnerInfo | null
    subtitle: string | null
    type?: string
    author_id?: number | null
    author?: IUser | null
    is_active?: number
    avatar_id?: number | null
    avatar?: IAttachment | null
    meta_title?: string | null
    meta_description?: string | null
    created_at?: string | null
    updated_at?: string | null
    date_created?: string | null
    date_updated?: string | null
}

export interface IPartnerInfo {
    [key: string]: string
}
