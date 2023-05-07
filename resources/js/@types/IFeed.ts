import {IUser} from './IUser'

export interface IFeed {
    id: number | null
    title: string
    type: string
    status: string
    user_id?: number | null
    user?: IUser | null
    author_id?: number | null
    author?: IUser | null
    phone: string | null
    name: string | null
    object_id?: number | null
    object_type?: string | null
    is_active?: number
    message_text?: string | null
    messages?: IFeedMessage[]
    created_at?: string | null
    updated_at?: string | null
    date_created?: string | null
    date_updated?: string | null
}

export interface IFeedMessage {
    id: number | null
    feedId: number | null
    author: number | null
    active: number
    status: string
    content: string
    authorName?: string | null
    created_at?: string | null
    updated_at?: string | null
    date_created?: string | null
    date_updated?: string | null
}
