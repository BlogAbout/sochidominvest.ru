import axios, {AxiosResponse} from 'axios'

export default class TariffService {
    static async fetchTariffById(tariffId: number): Promise<AxiosResponse> {
        return axios.get(`/tariff/${tariffId}`)
    }

    static async fetchTariffs(): Promise<AxiosResponse> {
        return axios.get('/tariff')
    }
}
