// 实例axios类

import Request from "./request";

const http = new Request({
    baseURL: '/api',
    timeout: 5000
})

export default http