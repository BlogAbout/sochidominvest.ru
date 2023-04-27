import axios, {AxiosResponse} from 'axios'
import {ICategory, IProduct} from '../@types/IStore'
import {IFilter} from '../@types/IFilter'

export default class StoreService {
    static async fetchCategoryById(categoryId: number): Promise<AxiosResponse> {
        return axios.get(`/store/category/${categoryId}`)
    }

    static async fetchCategories(filter: IFilter): Promise<AxiosResponse> {
        return axios.get('/store/category', {params: filter})
    }

    static async saveCategory(category: ICategory): Promise<AxiosResponse> {
        if (category.id) {
            return axios.patch(`/store/category/${category.id}`, category)
        } else {
            return axios.post('/store/category', category)
        }
    }

    static async removeCategory(categoryId: number): Promise<AxiosResponse> {
        return axios.delete(`/store/category/${categoryId}`)
    }

    static async fetchProductById(productId: number): Promise<AxiosResponse> {
        return axios.get(`/store/product/${productId}`)
    }

    static async fetchProducts(filter: IFilter): Promise<AxiosResponse> {
        return axios.get('/store/product', {params: filter})
    }

    static async saveProduct(product: IProduct): Promise<AxiosResponse> {
        if (product.id) {
            return axios.patch(`/store/product/${product.id}`, product)
        } else {
            return axios.post('/store/product', product)
        }
    }

    static async removeProduct(productId: number): Promise<AxiosResponse> {
        return axios.delete(`/store/product/${productId}`)
    }
}
