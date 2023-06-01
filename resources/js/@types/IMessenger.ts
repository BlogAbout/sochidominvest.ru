import {IUser} from './IUser'

export interface IMessenger {
    id: number | null
    author_id?: number | null
    author?: IUser | null
    avatar_id?: number | null
    name: string
    type: string
    member_ids?: number[]
    members: IMessengerMember[]
    messages: IMessage[]
    created_at?: string | null
    updated_at?: string | null
    date_created?: string | null
    date_updated?: string | null
}

export interface IMessage {
    id: number | null
    messenger_id: number | null
    messenger?: IMessenger | null
    message_id?: number | null
    message?: IMessage
    is_active?: number
    type: 'welcome' | 'online' | 'notification' | 'message' | 'create' | 'read'
    text: string
    author_id?: number | null
    author?: IUser | null
    user_id?: number | null
    user?: IUser | null
    attendee_ids?: number[] | null
    attendees?: IUser[] | null
    created_at?: string | null
    updated_at?: string | null
    date_created?: string | null
    date_updated?: string | null
}

export interface IMessengerMember {
    userId: number
    readed: number | null
    deleted: number | null
    active: number
}
