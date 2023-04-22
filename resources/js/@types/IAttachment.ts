import {IUser} from './IUser'

export interface IAttachment {
    id: number | null
    name: string
    description: string
    content: string
    type: 'image' | 'video' | 'document'
    extension: string
    author_id?: number | null
    author?: IUser | null
    is_active?: number
    poster_id?: number | null
    poster?: IAttachment | null
    created_at?: string | null
    updated_at?: string | null
    date_created?: string | null
    date_updated?: string | null
}
