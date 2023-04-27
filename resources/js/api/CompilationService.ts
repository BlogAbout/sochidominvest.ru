import axios, {AxiosResponse} from 'axios'
import {ICompilation} from '../@types/ICompilation'

export default class CompilationService {
    static async fetchCompilationById(compilationId: number): Promise<AxiosResponse> {
        return axios.get(`/compilation/${compilationId}`)
    }

    static async fetchCompilations(): Promise<AxiosResponse> {
        return axios.get('/compilation')
    }

    static async saveCompilation(compilation: ICompilation): Promise<AxiosResponse> {
        if (compilation.id) {
            return axios.patch(`/compilation/${compilation.id}`, compilation)
        } else {
            return axios.post('/compilation', compilation)
        }
    }

    static async removeCompilation(compilationId: number): Promise<AxiosResponse> {
        return axios.delete(`/compilation/${compilationId}`)
    }

    static async addBuildingInCompilation(compilationId: number, buildingId: number, compilationOldId?: number | null): Promise<AxiosResponse> {
        if (compilationOldId) {
            return axios.get(`/compilation/${compilationId}/${buildingId}/${compilationOldId}`)
        } else {
            return axios.get(`/compilation/${compilationId}/${buildingId}`)
        }
    }

    static async removeBuildingFromCompilation(compilationId: number, buildingId: number): Promise<AxiosResponse> {
        return axios.delete(`/compilation/${compilationId}/${buildingId}`)
    }
}
