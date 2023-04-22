import {IUser} from './IUser'
import {IBuilding} from './IBuilding'
import {IFeed} from './IFeed'

export interface IBusinessProcess {
    id: number | null
    name: string
    description: string
    type: string
    step: string
    author_id?: number | null
    author?: IUser | null
    responsible_id?: number | null
    responsible?: IUser | null
    attendee_ids?: number[] | null
    attendees?: IUser[] | null
    feeds?: IFeed[] | null
    buildings?: IBuilding[] | null
    is_active?: number
    created_at?: string | null
    updated_at?: string | null
    date_created?: string | null
    date_updated?: string | null
    relations?: IBusinessProcessRelation[] | null
}

export interface IBusinessProcessRelation {
    objectId: number
    objectType: string
}

export interface IBusinessProcessStep {
    [key: string]: string
}

export interface IBusinessProcessesBySteps {
    [key: string]: IBusinessProcess[]
}
