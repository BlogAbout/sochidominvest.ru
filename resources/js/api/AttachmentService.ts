import axios, {AxiosResponse} from 'axios'
import {IAttachment} from '../@types/IAttachment'
import {IFilter} from '../@types/IFilter'

export default class AttachmentService {
    static async fetchAttachmentById(attachmentId: number): Promise<AxiosResponse> {
        return axios.get(`/attachment/${attachmentId}`)
    }

    static async fetchAttachments(filter: IFilter): Promise<AxiosResponse> {
        return axios.get('/attachment', {params: filter})
    }

    static async updateAttachment(attachment: IAttachment): Promise<AxiosResponse> {
        return axios.patch(`/attachment/${attachment.id}`, attachment)
    }

    static async removeAttachment(attachmentId: number): Promise<AxiosResponse> {
        return axios.delete(`/attachment/${attachmentId}`)
    }

    static async uploadAttachment(file: any, type: 'image' | 'video' | 'document', onUploadProgress: any): Promise<AxiosResponse> {
        let formData = new FormData()

        formData.append('file', file)
        formData.append('type', type)

        return axios.post('/attachment', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress
        })
    }
}
