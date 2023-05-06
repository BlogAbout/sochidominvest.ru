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
}
