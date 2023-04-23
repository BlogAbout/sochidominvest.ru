import {IUser} from './IUser'

export interface ITransaction {
    id: number | null
    name: string
    status: string
    user_id?: number | null
    user?: IUser | null
    email?: string | null
    cost: number
    object_id?: number
    object_type?: string
    duration?: string | null
    created_at?: string | null
    updated_at?: string | null
    paid_at?: string | null
    date_created?: string | null
    date_updated?: string | null
    date_paid?: string | null
}
