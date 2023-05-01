import {IPost} from './IPost'
import {IAttachment} from './IAttachment'
import {IBuilding} from './IBuilding'

export interface IUser {
    id: number | null
    name: string
    email: string
    password: string | null
    phone: string
    is_active?: number
    is_block?: number
    settings?: IUserSetting | null
    role_id?: number | null
    role?: IRole | null
    avatar_id?: number | null
    avatar?: IAttachment | null
    post_id?: number | null
    post?: IPost | null
    tariff_id?: number | null
    tariff_expired?: string | null
    last_active?: string | null
    created_at?: string | null
    updated_at?: string | null
    date_last_active?: string | null
    date_created?: string | null
    date_updated?: string | null
    favorite_ids?: number[] | null
    favorites?: IBuilding[] | null
    business_process_sorting?: number[]
}

export interface IUserSetting {
    notifyEdit?: number
    notifyNewItem?: number
    notifyNewAction?: number
    soundAlert?: number
    pushNotify?: number
    pushMessenger?: number
    sendEmail?: number
}

export interface IUserExternal {
    id: number | null
    name: string
    email: string
    phone: string
    is_active?: number
    created_at?: string | null
    updated_at?: string | null
    date_created?: string | null
    date_updated?: string | null
}

export interface IRole {
    id: number | null
    name: string
}
