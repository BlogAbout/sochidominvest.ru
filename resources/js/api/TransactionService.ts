import axios, {AxiosResponse} from 'axios'
import {ITransaction} from '../@types/ITransaction'
import {IFilter} from '../@types/IFilter'

export default class TransactionService {
    static async fetchPaymentById(paymentId: number): Promise<AxiosResponse> {
        return axios.get(`/transaction/${paymentId}`)
    }

    static async fetchPayments(filter: IFilter): Promise<AxiosResponse> {
        return axios.get('/transaction', {params: filter})
    }

    static async savePayment(payment: ITransaction, sendLink: boolean): Promise<AxiosResponse> {
        if (payment.id) {
            return axios.patch(`/transaction/${payment.id}`, {payment: payment, sendLink: sendLink})
        } else {
            return axios.post('/transaction', {payment: payment, sendLink: sendLink})
        }
    }

    // static async fetchLinkPayment(paymentId: number): Promise<AxiosResponse> {
    //     return axios.get(`/transaction/${paymentId}/link`)
    // }
}
