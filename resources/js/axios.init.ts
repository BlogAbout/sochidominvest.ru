import {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios'
import {RouteNames} from './helpers/routerHelper'

/**
 * <p>Обобщенная обработка запроса перед отправкой.</p>
 * @param config конфигурация Axios
 */
const onRequest = (config: AxiosRequestConfig): AxiosRequestConfig => {
    return config
}

/**
 * <p>Обобщенная обработка ошибок запроса.</p>
 * @param error - Объект ошибки запроса в Axios.
 */
const onRequestError = (error: AxiosError): Promise<AxiosError> => {
    // console.error(`[request error] [${JSON.stringify(error)}]`)

    return Promise.reject(error)
}

/**
 * <p>Обобщенная обработка ответа.</p>
 * @param response - Объект ответа из Axios.
 */
const onResponse = (response: AxiosResponse): AxiosResponse => {
    // console.info(`[response] [${JSON.stringify(response)}]`)

    return response
}

/**
 * <p>Обобщенная обработка ошибок ответа.</p>
 * @param error - Объект ошибки ответа из Axios.
 */
const onResponseError = (error: AxiosError): Promise<AxiosError> => {
    if (error.response && error.response.status === 401) {
        localStorage.clear()
        window.location.href = RouteNames.MAIN
    } else {
        // console.error(`[response error] [${JSON.stringify(error)}]`)
    }

    return error.response ? Promise.reject(error.response) : Promise.reject(error)
}

/**
 * <p>Внедряем хуки в interceptor.</p>
 * @param axiosInstance - Экспортируемый Axios.
 */
export function setupInterceptorsTo(axiosInstance: AxiosInstance): AxiosInstance {
    axiosInstance.interceptors.request.use(onRequest, onRequestError)
    axiosInstance.interceptors.response.use(onResponse, onResponseError)

    return axiosInstance
}
