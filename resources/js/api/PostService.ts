import axios, {AxiosResponse} from 'axios'
import {IPost} from '../@types/IPost'
import {IFilter} from '../@types/IFilter'

export default class PostService {
    static async fetchPostById(postId: number): Promise<AxiosResponse> {
        return axios.get(`/post/${postId}`)
    }

    static async fetchPosts(filter: IFilter): Promise<AxiosResponse> {
        return axios.get('/post', {params: filter})
    }

    static async savePost(post: IPost): Promise<AxiosResponse> {
        if (post.id) {
            return axios.patch(`/post/${post.id}`, post)
        } else {
            return axios.post('/post', post)
        }
    }

    static async removePost(postId: number): Promise<AxiosResponse> {
        return axios.delete(`/post/${postId}`)
    }
}
