import {AxiosResponse} from 'axios'
import API from '../axios.init'
import {IUser, IUserExternal} from '../@types/IUser'
import {IAuth, ISignUp} from '../@types/IAuth'
import {IFilter} from '../@types/IFilter'

export default class UserService {
    static async authUser(auth: IAuth): Promise<AxiosResponse> {
        return API.post('/auth', auth)
    }

    static async registrationUser(signUp: ISignUp): Promise<AxiosResponse> {
        return API.post('/registration', signUp)
    }

    // static async forgotPasswordUser(email: string): Promise<AxiosResponse> {
    //     return API.post('/forgot', {email: email})
    // }
    //
    // static async resetPasswordUser(email: string, password: string): Promise<AxiosResponse> {
    //     return API.post('/reset', {email: email, password: password})
    // }

    static async fetchUserById(userId: number): Promise<AxiosResponse> {
        return API.get(`/user/${userId}`)
    }

    static async fetchUsers(filter: IFilter): Promise<AxiosResponse> {
        return API.get('/user', {params: filter})
    }

    static async saveUser(user: IUser): Promise<AxiosResponse> {
        if (user.id) {
            return API.patch(`/user/${user.id}`, user)
        } else {
            return API.post('/user', user)
        }
    }

    static async removeUser(userId: number): Promise<AxiosResponse> {
        return API.delete(`/user/${userId}`)
    }

    // static async changeTariffUser(userId: number, tariff: string, tariffExpired: string): Promise<AxiosResponse> {
    //     return API.patch(`/user/${userId}/tariff`, {tariff: tariff, tariffExpired: tariffExpired})
    // }

    static async fetchUserExternalById(userId: number): Promise<AxiosResponse> {
        return API.get(`/external/${userId}`)
    }

    static async fetchUsersExternal(filter: IFilter): Promise<AxiosResponse> {
        return API.get('/external', {params: filter})
    }

    static async saveUserExternal(user: IUserExternal): Promise<AxiosResponse> {
        if (user.id) {
            return API.patch(`/external/${user.id}`, user)
        } else {
            return API.post('/external', user)
        }
    }

    static async removeUserExternal(userId: number): Promise<AxiosResponse> {
        return API.delete(`/external/${userId}`)
    }
}
