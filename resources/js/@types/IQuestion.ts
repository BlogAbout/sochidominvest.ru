import {IUser} from './IUser'

export interface IQuestion {
    id: number | null
    name: string
    description: string
    type: string
    author_id?: number | null
    author?: IUser | null
    is_active?: number
    created_at?: string | null
    updated_at?: string | null
    date_created?: string | null
    date_updated?: string | null
}
