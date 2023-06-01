import axios, {AxiosResponse} from 'axios'
import {IFilter} from '../@types/IFilter'
import {IMessage} from '../@types/IMessenger'

export default class MessengerService {
    static async fetchMessengers(filter: IFilter): Promise<AxiosResponse> {
        return axios.get('/messenger', {params: filter})
    }

    static async removeMessenger(messengerId: number): Promise<AxiosResponse> {
        return axios.delete(`/messenger/${messengerId}`)
    }

    static async fetchMessages(messengerId: number): Promise<AxiosResponse> {
        return axios.get(`/messenger/${messengerId}`)
    }

    static async sendMessage(message: IMessage): Promise<AxiosResponse> {
        return axios.post('/messenger/message', message)
    }

    static async editMessage(message: IMessage): Promise<AxiosResponse> {
        return axios.patch(`/messenger/message/${message.id}`, message)
    }

    static async removeMessage(messageId: number): Promise<AxiosResponse> {
        return axios.delete(`/messenger/message/${messageId}`)
    }
}
