import {IUser} from './IUser'
import {IAttachment} from './IAttachment'

export interface ICategory {
    id: number | null
    name: string
    description?: string
    author_id?: number | null
    author?: IUser | null
    is_active?: number
    avatar_id?: number | null
    avatar?: IAttachment | null
    product_ids?: number[] | null
    products?: IProduct[] | null
    meta_title?: string
    meta_description?: string
    fields: string[]
    created_at?: string | null
    updated_at?: string | null
    date_created?: string | null
    date_updated?: string | null
}

export interface IProduct {
    id: number | null
    category_id: number
    category?: ICategory | null
    name: string
    description?: string
    cost: number
    cost_old?: number
    author_id?: number | null
    author?: IUser | null
    avatar_id?: number | null
    avatar?: IAttachment | null
    image_ids?: number[] | null
    images?: IAttachment[] | null
    video_ids?: number[] | null
    videos?: IAttachment[] | null
    fields: { [key: string]: string | number }
    is_active?: number
    meta_title?: string
    meta_description?: string
    views?: number | null
    prices?: any[]
    created_at?: string | null
    updated_at?: string | null
    date_created?: string | null
    date_updated?: string | null
}
