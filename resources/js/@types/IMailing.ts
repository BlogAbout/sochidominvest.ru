import {IUser} from './IUser'

export interface IMailing {
    id: number | null
    name: string
    content: string
    content_html: string
    type: string
    status: number
    author_id?: number | null
    author?: IUser | null
    is_active?: number
    recipients?: IUser[] | null
    created_at?: string | null
    updated_at?: string | null
    date_created?: string | null
    date_updated?: string | null
}

export interface IMailingRecipient {
    mailingId: number
    userId: number
    userType: string
    email?: string
}
