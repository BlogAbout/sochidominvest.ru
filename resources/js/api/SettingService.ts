import axios, {AxiosResponse} from 'axios'
import {ISetting} from '../@types/ISetting'

export default class SettingService {
    static async fetchSettings(): Promise<AxiosResponse> {
        return axios.get('/setting')
    }

    static async saveSetting(setting: ISetting): Promise<AxiosResponse> {
        return axios.post('/setting', {settings: setting})
    }
}
