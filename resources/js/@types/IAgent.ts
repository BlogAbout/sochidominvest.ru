import {IUser} from './IUser'
import {IAttachment} from './IAttachment'
import {IBuilding} from './IBuilding'
import {IPost} from './IPost'

export interface IAgent {
    id: number | null
    name: string
    description?: string
    address: string
    phone: string
    type: string
    author_id?: number | null
    author?: IUser | null
    is_active?: number
    avatar_id?: number | null
    avatar?: IAttachment | null
    contacts?: IContact[] | null
    buildings?: IBuilding[] | null
    created_at?: string | null
    updated_at?: string | null
    date_created?: string | null
    date_updated?: string | null
}

export interface IContact {
    id: number | null
    name: string
    phone: string
    agent_id: number
    agent?: IAgent | null
    post?: string
    author_id?: number | null
    author?: IUser | null
    buildings?: IBuilding[] | null
    is_active?: number
    created_at?: string | null
    updated_at?: string | null
    date_created?: string | null
    date_updated?: string | null
}
