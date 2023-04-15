import {AxiosResponse} from 'axios'
import API from '../axios.init'
import {IPayment} from '../@types/IPayment'
import {IFilter} from '../@types/IFilter'

export default class TransactionService {
    static async fetchPaymentById(paymentId: number): Promise<AxiosResponse> {
        return API.get(`/transaction/${paymentId}`)
    }

    static async fetchPayments(filter: IFilter): Promise<AxiosResponse> {
        return API.get('/transaction', {params: filter})
    }

    static async savePayment(payment: IPayment, sendLink: boolean): Promise<AxiosResponse> {
        if (payment.id) {
            return API.patch(`/transaction/${payment.id}`, {payment: payment, sendLink: sendLink})
        } else {
            return API.post('/transaction', {payment: payment, sendLink: sendLink})
        }
    }

    // static async fetchLinkPayment(paymentId: number): Promise<AxiosResponse> {
    //     return API.get(`/transaction/${paymentId}/link`)
    // }
}
