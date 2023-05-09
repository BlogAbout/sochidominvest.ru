import axios, {AxiosResponse} from 'axios'
import {IWidget} from '../@types/IWidget'
import {IFilter} from '../@types/IFilter'

export default class WidgetService {
    static async fetchWidgetById(widgetId: number): Promise<AxiosResponse> {
        return axios.get(`/widget/${widgetId}`)
    }

    static async fetchWidgets(filter: IFilter): Promise<AxiosResponse> {
        return axios.get('/widget', {params: filter})
    }

    static async saveWidget(widget: IWidget): Promise<AxiosResponse> {
        if (widget.id) {
            return axios.patch(`/widget/${widget.id}`, widget)
        } else {
            return axios.post('/widget', widget)
        }
    }

    static async removeWidget(widgetId: number): Promise<AxiosResponse> {
        return axios.delete(`/widget/${widgetId}`)
    }

    // static async updateWidgetOrdering(ids: number[], filter: IFilter): Promise<AxiosResponse> {
    //     return axios.post('/widget/ordering', {ids: ids, filter: filter})
    // }
}
