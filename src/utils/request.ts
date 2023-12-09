import axios, { AxiosInstance, AxiosResponse } from "axios";
// 封装axios请求类
interface Config {// 定义 初始化axios实例参数
    baseURL: string// 基准路径
    timeout: number// 超时时间
}
class Request {
    private instance: AxiosInstance;// axios实例
    constructor(config: Config) {
        this.instance = axios.create(config)// 创建axios实例
        // 调用拦截方法
        this.beforeRequest()
        this.beforeResponse()
    }
    // 拦截
    protected beforeRequest() {// 请求拦截
        this.instance.interceptors.request.use((req: any) => {
            // token ... 
            return req
        })
    }
    protected beforeResponse() {
        this.instance.interceptors.response.use((res: AxiosResponse) => {
            return res.data
        })
    }
    // 请求方法 get post put delete .. patch options...
    get<T, K>(url: string, params?: K): Promise<T> {
        return this.instance.get(url, { params })
    }

    post<T, K>(url: string, params?: K): Promise<T> {
        return this.instance.post(url, params)
    }

}

export default Request