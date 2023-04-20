import {AxiosResponse} from 'axios'
import API from '../axios.init'
import {IBooking} from '../@types/IBooking'
import {IFilter} from '../@types/IFilter'

export default class BookingService {
    static async fetchBookingById(bookingId: number): Promise<AxiosResponse> {
        return API.get(`/booking/${bookingId}`)
    }

    static async fetchBookings(filter: IFilter): Promise<AxiosResponse> {
        return API.get('/booking', {params: filter})
    }

    static async saveBooking(booking: IBooking): Promise<AxiosResponse> {
        if (booking.id) {
            return API.patch(`/booking/${booking.id}`, booking)
        } else {
            return API.post('/booking', booking)
        }
    }
}
