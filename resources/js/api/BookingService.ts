import axios, {AxiosResponse} from 'axios'
import {IBooking} from '../@types/IBooking'
import {IFilter} from '../@types/IFilter'

export default class BookingService {
    static async fetchBookingById(bookingId: number): Promise<AxiosResponse> {
        return axios.get(`/booking/${bookingId}`)
    }

    static async fetchBookings(filter: IFilter): Promise<AxiosResponse> {
        return axios.get('/booking', {params: filter})
    }

    static async saveBooking(booking: IBooking): Promise<AxiosResponse> {
        if (booking.id) {
            return axios.patch(`/booking/${booking.id}`, booking)
        } else {
            return axios.post('/booking', booking)
        }
    }
}
