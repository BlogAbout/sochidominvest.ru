import axios, {AxiosResponse} from 'axios'
import {INotification} from '../@types/INotification'

export default class NotificationService {
    // static async fetchCountNewNotifications(): Promise<AxiosResponse> {
    //     return axios.get(`/notification/count`)
    // }

    static async fetchNotificationById(notificationId: number): Promise<AxiosResponse> {
        return axios.get(`/notification/${notificationId}`)
    }

    static async fetchNotifications(): Promise<AxiosResponse> {
        return axios.get('/notification')
    }

    static async saveNotification(notification: INotification): Promise<AxiosResponse> {
        return axios.post('/notification', notification)
    }

    static async removeNotification(notificationId: number): Promise<AxiosResponse> {
        return axios.delete(`/notification/${notificationId}`)
    }

    static async readNotification(notificationId: number): Promise<AxiosResponse> {
        return axios.get(`/notification/${notificationId}/read`)
    }

    static async readNotificationAll(): Promise<AxiosResponse> {
        return axios.get('/notification/read')
    }
}
