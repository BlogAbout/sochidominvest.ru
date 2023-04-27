import axios, {AxiosResponse} from 'axios'
import {ITag} from '../@types/ITag'

export default class TagService {
    static async fetchTagById(tagId: number): Promise<AxiosResponse> {
        return axios.get(`/tag/${tagId}`)
    }

    static async fetchTags(): Promise<AxiosResponse> {
        return axios.get('/tag')
    }

    static async saveTag(tag: ITag): Promise<AxiosResponse> {
        if (tag.id) {
            return axios.patch(`/tag/${tag.id}`, tag)
        } else {
            return axios.post('/tag', tag)
        }
    }

    static async removeTag(tagId: number): Promise<AxiosResponse> {
        return axios.delete(`/tag/${tagId}`)
    }
}
