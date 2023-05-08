import axios, {AxiosResponse} from 'axios'
import {INotification} from '../@types/INotification'
import {IFilter} from '../@types/IFilter'

export default class NotificationService {
    static async fetchNotifications(): Promise<AxiosResponse> {
        return axios.get('/notification')
    }

    static async saveNotification(notification: INotification): Promise<AxiosResponse> {
        return axios.post('/notification', notification)
    }

    static async readNotifications(notificationId?: number): Promise<AxiosResponse> {
        const filter: IFilter = {}

        if (notificationId) {
            filter.id = [notificationId]
        }

        return axios.get(`/notification/read`, {params: filter})
    }

    static async trashNotifications(notificationId?: number): Promise<AxiosResponse> {
        const filter: IFilter = {}

        if (notificationId) {
            filter.id = [notificationId]
        }

        return axios.get(`/notification/trash`, {params: filter})
    }
}
