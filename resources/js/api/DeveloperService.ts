import axios, {AxiosResponse} from 'axios'
import {IDeveloper} from '../@types/IDeveloper'
import {IFilter} from '../@types/IFilter'

export default class DeveloperService {
    static async fetchDeveloperById(developerId: number): Promise<AxiosResponse> {
        return axios.get(`/developer/${developerId}`)
    }

    static async fetchDevelopers(filter: IFilter): Promise<AxiosResponse> {
        return axios.get('/developer', {params: filter})
    }

    static async saveDeveloper(developer: IDeveloper): Promise<AxiosResponse> {
        if (developer.id) {
            return axios.patch(`/developer/${developer.id}`, developer)
        } else {
            return axios.post('/developer', developer)
        }
    }

    static async removeDeveloper(developerId: number): Promise<AxiosResponse> {
        return axios.delete(`/developer/${developerId}`)
    }
}
