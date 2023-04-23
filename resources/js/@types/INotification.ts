import {IUser} from './IUser'

export interface INotification {
    id: number | null
    name: string
    description: string | null
    type: string
    author_id?: number | null
    author?: IUser | null
    is_active?: number
    object_id?: number | null
    object_type?: string | null
    users?: IUser | null
    status?: string
    created_at?: string | null
    updated_at?: string | null
    date_created?: string | null
    date_updated?: string | null
}
