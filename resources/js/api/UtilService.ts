import axios, {AxiosResponse} from 'axios'
import {IFilter} from '../@types/IFilter'

export default class UtilService {
    static async fetchSearchGlobal(filter: IFilter): Promise<AxiosResponse> {
        return axios.get(`/search`, {params: filter})
    }
}
