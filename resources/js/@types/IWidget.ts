import {IUser} from './IUser'

export interface IWidget {
    id: number | null
    name: string
    type: string
    style: string
    page: string
    ordering: number
    author_id: number
    author: IUser | null
    is_active: number
    items: IWidgetData[]
    created_at: string
    updated_at: string
    date_created: string
    date_updated: string
}

export interface IWidgetData {
    widget_id: number | null
    object_id: number
    object_type: string
    ordering: number
}
