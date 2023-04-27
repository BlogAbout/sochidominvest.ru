import axios, {AxiosResponse} from 'axios'
import {IFeed} from '../@types/IFeed'
import {IFilter} from '../@types/IFilter'

export default class FeedService {
    static async fetchFeedById(feedId: number): Promise<AxiosResponse> {
        return axios.get(`/feed/${feedId}`)
    }

    static async fetchFeeds(filter: IFilter): Promise<AxiosResponse> {
        return axios.get('/feed', {params: filter})
    }

    static async saveFeed(feed: IFeed): Promise<AxiosResponse> {
        if (feed.id) {
            return axios.patch(`/feed/${feed.id}`, feed)
        } else {
            return axios.post('/feed', feed)
        }
    }

    static async removeFeed(feedId: number): Promise<AxiosResponse> {
        return axios.delete(`/feed/${feedId}`)
    }
}
