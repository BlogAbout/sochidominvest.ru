import axios, {AxiosResponse} from 'axios'
import {IQuestion} from '../@types/IQuestion'
import {IFilter} from '../@types/IFilter'

export default class QuestionService {
    static async fetchQuestionById(questionId: number): Promise<AxiosResponse> {
        return axios.get(`/question/${questionId}`)
    }

    static async fetchQuestions(filter: IFilter): Promise<AxiosResponse> {
        return axios.get('/question', {params: filter})
    }

    static async saveQuestion(question: IQuestion): Promise<AxiosResponse> {
        if (question.id) {
            return axios.patch(`/question/${question.id}`, question)
        } else {
            return axios.post('/question', question)
        }
    }

    static async removeQuestion(questionId: number): Promise<AxiosResponse> {
        return axios.delete(`/question/${questionId}`)
    }
}
