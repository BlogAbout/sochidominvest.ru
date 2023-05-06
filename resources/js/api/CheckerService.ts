import axios, {AxiosResponse} from 'axios'
import {IBuildingChecker} from '../@types/IBuilding'

export default class CheckerService {
    static async fetchCheckers(buildingId: number): Promise<AxiosResponse> {
        return axios.get(`/checker`, {params: {buildingId: [buildingId], active: [0, 1]}})
    }

    static async saveChecker(checker: IBuildingChecker): Promise<AxiosResponse> {
        if (checker.id) {
            return axios.patch(`/checker/${checker.id}`, checker)
        } else {
            return axios.post('/checker', checker)
        }
    }

    static async removeChecker(checkerId: number): Promise<AxiosResponse> {
        return axios.delete(`/checker/${checkerId}`)
    }
}
