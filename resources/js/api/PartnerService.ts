import axios, {AxiosResponse} from 'axios'
import {IPartner} from '../@types/IPartner'
import {IFilter} from '../@types/IFilter'

export default class PartnerService {
    static async fetchPartnerById(partnerId: number): Promise<AxiosResponse> {
        return axios.get(`/partner/${partnerId}`)
    }

    static async fetchPartners(filter: IFilter): Promise<AxiosResponse> {
        return axios.get('/partner', {params: filter})
    }

    static async savePartner(partner: IPartner): Promise<AxiosResponse> {
        if (partner.id) {
            return axios.patch(`/partner/${partner.id}`, partner)
        } else {
            return axios.post('/partner', partner)
        }
    }

    static async removePartner(partnerId: number): Promise<AxiosResponse> {
        return axios.delete(`/partner/${partnerId}`)
    }
}
