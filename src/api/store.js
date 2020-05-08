import axios from 'axios'
import { setLocalForage } from '../utils/localForage'
//做api请求,mockjs中有定义
export function home() {
    return axios({
        method: 'get',
        url: `${process.env.VUE_APP_BASE_URL}/book/home`
    })
}

export function shelf() {
    return axios({
        method: 'get',
        url: `${process.env.VUE_APP_BASE_URL}/book/shelf`
    })
}
//线上请求
export function detail(book) {
    return axios({
        method: 'get',
        url: `${process.env.VUE_APP_BOOK_URL}/book/detail`,
        params: {
            fileName: book.fileName
        }
    })
}
//模拟数据时mockjs中有定义，注意书城搜索功能也会请求这个接口
export function list() {
    return axios({
        method: 'get',
        url: `${process.env.VUE_APP_BASE_URL}/book/list`
    })
}
//缓存电子书
export function download(book, onSuccess, onError, onProgress) {
    if (!onProgress) {
        onProgress = onError
        onError = null
    }
    //create会返回一个function，然后我们调用这个function实现请求。axios.create()返回一个axios实例
    return axios.create({
        baseURL: process.env.VUE_APP_EPUB_URL,
        method: 'get',
        responseType: 'blob',
        timeout: 180 * 1000,
        //监听下载的进度
        onDownloadProgress: progressEvent => {
            if (onProgress) onProgress(progressEvent)
        }
    }).get(`${book.categoryText}/${book.fileName}.epub`).then(res => {
        //epubjs可以直接打开这个blob对象
        const blob = new Blob([res.data])
        setLocalForage(book.fileName, blob, () => {
            if (onSuccess) onSuccess(book)
        }, err => {
            if (onError) onError(err)
        })
    }).catch(err => {
        if (onError) onError(err)
    })
}