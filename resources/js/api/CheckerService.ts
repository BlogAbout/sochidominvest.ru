import {AxiosResponse} from 'axios'
import API from '../axios.init'
import {IBuildingChecker} from '../@types/IBuilding'

export default class CheckerService {
    static async fetchCheckerById(checkerId: number): Promise<AxiosResponse> {
        return API.get(`/checker/${checkerId}`)
    }

    static async fetchCheckers(buildingId: number): Promise<AxiosResponse> {
        return API.get(`/${buildingId}/checker`)
    }

    static async saveChecker(checker: IBuildingChecker): Promise<AxiosResponse> {
        if (checker.id) {
            return API.patch(`/checker/${checker.id}`, checker)
        } else {
            return API.post('/checker', checker)
        }
    }

    static async removeChecker(checkerId: number): Promise<AxiosResponse> {
        return API.delete(`/checker/${checkerId}`)
    }
}
