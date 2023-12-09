//封装本地存储
const KEY: any = "Ty_"
export const set = (key: string, val: any) => {// 设置存储
    sessionStorage.setItem(KEY + key, JSON.stringify(val))
}
export const get = (key: string = '') => {// 获取存储
    return sessionStorage.getItem(KEY + key) ?
        JSON.parse(sessionStorage.getItem(KEY + key) || '') : null
}
export const remove = (key: string) => {// 移除存储
    sessionStorage.removeItem(KEY + key)
}
export const clear = () => {// 清空存储
    sessionStorage.clear()
}