export interface ITariff {
    id: number
    name: string
    cost: number
    privileges: string[]
    created_at?: string | null
    updated_at?: string | null
}
