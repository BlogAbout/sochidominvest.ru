import {IUser} from './IUser'
import {IAttachment} from './IAttachment'
import {IBuilding} from './IBuilding'

export interface IArticle {
    id: number | null
    name: string
    description: string
    type: string
    author_id?: number | null
    author?: IUser | null
    is_active?: number
    is_publish?: number
    avatar_id?: number | null
    avatar?: IAttachment | null
    image_ids?: number[] | null
    images?: IAttachment[] | null
    video_ids?: number[] | null
    videos?: IAttachment[] | null
    building_ids?: number[] | null
    buildings?: IBuilding[] | null
    meta_title?: string | null
    meta_description?: string | null
    views?: number | null
    created_at?: string | null
    updated_at?: string | null
    date_created?: string | null
    date_updated?: string | null
}
