import axios, {AxiosResponse} from 'axios'
import {IArticle} from '../@types/IArticle'
import {IFilter} from '../@types/IFilter'

export default class ArticleService {
    static async fetchArticleById(articleId: number): Promise<AxiosResponse> {
        return axios.get(`/article/${articleId}`)
    }

    static async fetchArticles(filter: IFilter): Promise<AxiosResponse> {
        return axios.get('/article', {params: filter})
    }

    static async saveArticle(article: IArticle): Promise<AxiosResponse> {
        if (article.id) {
            return axios.patch(`/article/${article.id}`, article)
        } else {
            return axios.post('/article', article)
        }
    }

    static async removeArticle(articleId: number): Promise<AxiosResponse> {
        return axios.delete(`/article/${articleId}`)
    }
}
