import axios, {AxiosResponse} from 'axios'
import {IBusinessProcess} from '../@types/IBusinessProcess'
import {IFilter} from '../@types/IFilter'

export default class BusinessProcessService {
    static async fetchBusinessProcessById(businessProcessId: number): Promise<AxiosResponse> {
        return axios.get(`/business-process/${businessProcessId}`)
    }

    static async fetchBusinessProcesses(filter: IFilter): Promise<AxiosResponse> {
        return axios.get('/business-process', {params: filter})
    }

    static async saveBusinessProcess(businessProcess: IBusinessProcess): Promise<AxiosResponse> {
        if (businessProcess.id) {
            return axios.patch(`/business-process/${businessProcess.id}`, businessProcess)
        } else {
            return axios.post('/business-process', businessProcess)
        }
    }

    static async removeBusinessProcess(businessProcessId: number): Promise<AxiosResponse> {
        return axios.delete(`/business-process/${businessProcessId}`)
    }
}
