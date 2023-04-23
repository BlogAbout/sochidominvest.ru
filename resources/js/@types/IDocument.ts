import {IUser} from './IUser'
import {IAttachment} from './IAttachment'
import {IBuilding} from './IBuilding'

export interface IDocument {
    id: number | null
    name: string
    content?: string
    type: 'file' | 'link' | 'constructor'
    author_id?: number | null
    author?: IUser | null
    is_active?: number
    attachment_id?: number | null
    attachment?: IAttachment | null
    object_id?: number | null
    object_type?: string | null
    building_ids?: number[] | null
    buildings?: IBuilding[] | null
    created_at?: string | null
    updated_at?: string | null
    date_created?: string | null
    date_updated?: string | null
}
