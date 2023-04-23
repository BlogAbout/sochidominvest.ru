import {IUser} from './IUser'

export interface IPost {
    id: number | null
    name: string
    description: string
    type: string
    post_id?: number | null
    post?: IPost | null
    author_id?: number | null
    author?: IUser | null
    is_active?: number
    hasChild?: boolean
    isOpen?: boolean
    spaces?: number
    created_at?: string | null
    updated_at?: string | null
    date_created?: string | null
    date_updated?: string | null
}
