import axios, {AxiosResponse} from 'axios'
import {IAgent, IContact} from '../@types/IAgent'
import {IFilter} from '../@types/IFilter'

export default class AgentService {
    static async fetchAgentById(agentId: number): Promise<AxiosResponse> {
        return axios.get(`/agent/${agentId}`)
    }

    static async fetchAgents(filter: IFilter): Promise<AxiosResponse> {
        return axios.get('/agent', {params: filter})
    }

    static async saveAgent(agent: IAgent): Promise<AxiosResponse> {
        if (agent.id) {
            return axios.patch(`/agent/${agent.id}`, agent)
        } else {
            return axios.post('/agent', agent)
        }
    }

    static async removeAgent(agentId: number): Promise<AxiosResponse> {
        return axios.delete(`/agent/${agentId}`)
    }

    static async fetchContactById(contactId: number): Promise<AxiosResponse> {
        return axios.get(`/contact/${contactId}`)
    }

    static async fetchContacts(filter: IFilter): Promise<AxiosResponse> {
        return axios.get('/contact', {params: filter})
    }

    static async saveContact(contact: IContact): Promise<AxiosResponse> {
        if (contact.id) {
            return axios.patch(`/contact/${contact.id}`, contact)
        } else {
            return axios.post('/contact', contact)
        }
    }

    static async removeContact(contactId: number): Promise<AxiosResponse> {
        return axios.delete(`/contact/${contactId}`)
    }
}
