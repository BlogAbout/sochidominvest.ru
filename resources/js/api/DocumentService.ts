import axios, {AxiosResponse} from 'axios'
import {IDocument} from '../@types/IDocument'
import {IFilter} from '../@types/IFilter'

export default class DocumentService {
    static async fetchDocumentById(documentId: number): Promise<AxiosResponse> {
        return axios.get(`/document/${documentId}`)
    }

    static async fetchDocuments(filter: IFilter): Promise<AxiosResponse> {
        return axios.get('/document', {params: filter})
    }

    static async saveDocument(document: IDocument): Promise<AxiosResponse> {
        if (document.id) {
            return axios.patch(`/document/${document.id}`, document)
        } else {
            return axios.post('/document', document)
        }
    }

    static async removeDocument(documentId: number): Promise<AxiosResponse> {
        return axios.delete(`/document/${documentId}`)
    }
}
