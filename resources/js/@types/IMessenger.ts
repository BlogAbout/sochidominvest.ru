import {IUser} from "./IUser";

export interface IMessenger {
    id: number | null
    author_id?: number | null
    author?: IUser | null
    avatarId?: number | null
    name: string
    type: string
    members: IMessengerMember[]
    messages: IMessage[]

    created_at?: string | null
    updated_at?: string | null
    date_created?: string | null
    date_updated?: string | null
}

export interface IMessage {
    id: number | null
    messengerId: number | null
    active: number
    type: 'welcome' | 'online' | 'notification' | 'message' | 'create' | 'read'
    text: string
    author: number | null
    userId?: number | null
    dateUpdate?: string | null
    parentMessageId: number | null
    attendees: number[]

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
