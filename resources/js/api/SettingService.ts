import {AxiosResponse} from 'axios'
import API from '../axios.init'
import {ISetting} from '../@types/ISetting'

export default class SettingService {
    static async fetchSettings(): Promise<AxiosResponse> {
        return API.get('/setting')
    }

    static async saveSetting(setting: ISetting): Promise<AxiosResponse> {
        return API.post('/setting', {settings: setting})
    }
}
