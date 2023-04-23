import {IUser} from './IUser'
import {IBuilding} from './IBuilding'

export interface ICompilation {
    id: number | null
    name: string
    description: string
    author_id?: number | null
    author?: IUser | null
    building_ids?: number[] | null
    buildings?: IBuilding[] | null
    is_active?: number
    created_at?: string | null
    updated_at?: string | null
    date_created?: string | null
    date_updated?: string | null
}
