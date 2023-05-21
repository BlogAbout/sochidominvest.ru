import axios, {AxiosResponse} from 'axios'
import {IBuilding} from '../@types/IBuilding'
import {IFilter} from '../@types/IFilter'

export default class BuildingService {
    static async fetchBuildingById(buildingId: number): Promise<AxiosResponse> {
        return axios.get(`/building/${buildingId}`)
    }

    static async fetchBuildings(filter: IFilter): Promise<AxiosResponse> {
        return axios.get('/building', {params: filter})
    }

    static async saveBuilding(building: IBuilding): Promise<AxiosResponse> {
        if (building.id) {
            return axios.patch(`/building/${building.id}`, building)
        } else {
            return axios.post('/building', building)
        }
    }

    static async removeBuilding(buildingId: number): Promise<AxiosResponse> {
        return axios.delete(`/building/${buildingId}`)
    }
}
