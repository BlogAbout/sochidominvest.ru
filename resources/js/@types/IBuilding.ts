import {IAttachment} from './IAttachment'
import {IUser} from './IUser'
import {IDeveloper} from './IDeveloper'
import {IAgent, IContact} from './IAgent'
import {IDocument} from './IDocument'
import {IArticle} from './IArticle'
import {ITag} from './ITag'

export interface IBuilding {
    id: number | null
    name: string
    description: string
    address?: string | null
    coordinates?: string | null
    type: 'building' | 'apartment' | 'house' | 'land' | 'commerce' | 'garage'
    status?: string | null
    author_id?: number | null
    author?: IUser | null
    is_active?: number
    is_publish?: number
    is_rent?: number
    area?: number | null
    area_min?: number | null
    area_max?: number | null
    cost?: number | null
    cost_min?: number | null
    cost_max?: number | null
    cost_min_unit?: number | null
    meta_title?: string | null
    meta_description?: string | null
    views?: number | null
    info: IBuildingInfo
    image_ids?: number[] | null
    images?: IAttachment[] | null
    video_ids?: number[] | null
    videos?: IAttachment[] | null
    developer_ids?: number[] | null
    developers?: IDeveloper[] | null
    agent_ids?: number[] | null
    agents?: IAgent[] | null
    contact_ids?: number[] | null
    contacts?: IContact[] | null
    document_ids?: number[] | null
    documents?: IDocument[] | null
    article_ids?: number[] | null
    articles?: IArticle[] | null
    tag_ids?: number[] | null
    tags?: ITag[] | null
    checkers?: IBuildingChecker[] | null
    rentData?: IBuildingRent
    created_at?: string | null
    updated_at?: string | null
    date_created?: string | null
    date_updated?: string | null
}

export interface IBuildingInfo {
    id: number | null
    district?: string | null
    district_zone?: string | null
    house_class?: string | null
    material?: string | null
    house_type?: string | null
    entrance_house?: string | null
    parking?: string | null
    territory?: string | null
    ceiling_height?: number | null
    maintenance_cost?: number | null
    distance_sea?: number | null
    gas?: string | null
    heating?: string | null
    electricity?: string | null
    sewerage?: string | null
    water_supply?: string | null
    advantages?: string[]
    payments?: string[]
    formalization?: string[]
    amount_contract?: string | null
    surcharge_doc?: number | null
    surcharge_gas?: number | null
    is_sale_no_resident?: number | null
    passed?: IBuildingPassed
    cadastral_number?: string | null
    cadastral_cost?: number | null
    avatar_id?: number | null
    avatar?: IAttachment | null
}

export interface IBuildingPassed {
    is: number | null
    quarter: number | null
    year: number | null
}

export interface IBuildingChecker {
    id: number | null
    building_id: number | null
    building?: IBuilding | null
    name: string
    author_id?: number | null
    author?: IUser | null
    area: number | null
    cost: number | null
    furnish: string | null
    housing: number
    stage: string | null
    rooms: number | null
    status: string | null
    is_active?: number
    meta_title?: string | null
    meta_description?: string | null
    created_at?: string | null
    updated_at?: string | null
    date_created?: string | null
    date_updated?: string | null
}

export interface IBuildingHousing {
    [key: number]: IBuildingChecker[]
}

export interface IBuildingRent {
    description: string
    type: string
    deposit: number
    commission: number
    cost?: number | null
    costDeposit?: number | null
    costCommission?: number | null
}
