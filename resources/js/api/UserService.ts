import axios, {AxiosResponse} from 'axios'
import {IUser, IUserExternal} from '../@types/IUser'
import {IAuth, ISignUp} from '../@types/IAuth'
import {IFilter} from '../@types/IFilter'

export default class UserService {
    static async authUser(auth: IAuth): Promise<AxiosResponse> {
        return axios.get('/sanctum/csrf-cookie')
            .then(() => {
                return axios.post('/auth', auth)
            })
    }

    static async registrationUser(signUp: ISignUp): Promise<AxiosResponse> {
        return axios.post('/registration', signUp)
    }

    static async logoutUser(): Promise<AxiosResponse> {
        return axios.get('/logout')
    }

    // static async forgotPasswordUser(email: string): Promise<AxiosResponse> {
    //     return axios.post('/forgot', {email: email})
    // }
    //
    // static async resetPasswordUser(email: string, password: string): Promise<AxiosResponse> {
    //     return axios.post('/reset', {email: email, password: password})
    // }

    static async fetchUserById(userId: number): Promise<AxiosResponse> {
        return axios.get(`/user/${userId}`)
    }

    static async fetchUsers(filter: IFilter): Promise<AxiosResponse> {
        return axios.get('/user', {params: filter})
    }

    static async saveUser(user: IUser): Promise<AxiosResponse> {
        if (user.id) {
            return axios.patch(`/user/${user.id}`, user)
        } else {
            return axios.post('/user', user)
        }
    }

    static async removeUser(userId: number): Promise<AxiosResponse> {
        return axios.delete(`/user/${userId}`)
    }

    // static async changeTariffUser(userId: number, tariff: string, tariffExpired: string): Promise<AxiosResponse> {
    //     return axios.patch(`/user/${userId}/tariff`, {tariff: tariff, tariffExpired: tariffExpired})
    // }

    static async fetchUserExternalById(userId: number): Promise<AxiosResponse> {
        return axios.get(`/external/${userId}`)
    }

    static async fetchUsersExternal(filter: IFilter): Promise<AxiosResponse> {
        return axios.get('/external', {params: filter})
    }

    static async saveUserExternal(user: IUserExternal): Promise<AxiosResponse> {
        if (user.id) {
            return axios.patch(`/external/${user.id}`, user)
        } else {
            return axios.post('/external', user)
        }
    }

    static async removeUserExternal(userId: number): Promise<AxiosResponse> {
        return axios.delete(`/external/${userId}`)
    }
}
