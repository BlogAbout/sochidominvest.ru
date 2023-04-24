import {IUser} from './IUser'
import {IAttachment} from './IAttachment'
import {IBuilding} from './IBuilding'

export interface IDeveloper {
    id: number | null
    name: string
    description: string
    address?: string
    phone?: string
    type: string
    author_id?: number | null
    author?: IUser | null
    is_active?: number
    avatar_id?: number | null
    avatar?: IAttachment | null
    building_ids?: number[] | null
    buildings?: IBuilding[] | null
    created_at?: string | null
    updated_at?: string | null
    date_created?: string | null
    date_updated?: string | null
}
