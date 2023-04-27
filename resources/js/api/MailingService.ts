import axios, {AxiosResponse} from 'axios'
import {IMailing, IMailingRecipient} from '../@types/IMailing'
import {IFilter} from '../@types/IFilter'

export default class FeedService {
    static async fetchMailingById(mailingId: number): Promise<AxiosResponse> {
        return axios.get(`/mailing/${mailingId}/info`)
    }

    static async fetchMailings(filter: IFilter): Promise<AxiosResponse> {
        return axios.get('/mailing', {params: filter})
    }

    static async saveMailing(mailing: IMailing): Promise<AxiosResponse> {
        if (mailing.id) {
            return axios.patch(`/mailing/${mailing.id}`, mailing)
        } else {
            return axios.post('/mailing', mailing)
        }
    }

    static async removeMailing(mailingId: number): Promise<AxiosResponse> {
        return axios.delete(`/mailing/${mailingId}`)
    }

    static async removeMailingRecipient(recipient: IMailingRecipient): Promise<AxiosResponse> {
        return axios.delete(`/mailing/${recipient.mailingId}/${recipient.userType}/${recipient.userId}`)
    }
}
