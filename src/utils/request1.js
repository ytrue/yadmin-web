import axios from 'axios'
import Cookie from 'js-cookie'

// 跨域认证信息 header 名
const xsrfHeaderName = 'Authorization'

axios.defaults.timeout = 30000
axios.defaults.withCredentials = true
axios.defaults.xsrfHeaderName = xsrfHeaderName
axios.defaults.xsrfCookieName = xsrfHeaderName

const BASE_URL = 'http://192.168.1.75:7000'

// 认证类型
const AUTH_TYPE = {
    BEARER: 'Bearer',
    BASIC: 'basic',
    AUTH1: 'auth1',
    AUTH2: 'auth2',
}

// http method
const METHOD = {
    GET: 'get',
    POST: 'post',
    PUT: 'put',
    DELETE: 'delete',
}

/**
 * axios请求
 * @param url 请求地址
 * @param method {METHOD} http method
 * @param params 请求参数
 * @param setting
 * @returns {Promise<AxiosResponse<T>>}
 */
async function request(url, method, params, setting) {
    if (!isUrl(url)) {
        url = BASE_URL + url;
    }
    //返回
    if (method === METHOD.GET) {
        url.indexOf('?') === -1 ? url = url + '?_=' + (new Date().getTime()) : url = url + '&_=' + (new Date().getTime())
    }
    return axios({
        url: url,
        method: method,
        data: params,
        headers: setting
    })
}


/**
 * 判断是否是url
 * @param str
 * @return {boolean}
 */
function isUrl(str) {
    var v = new RegExp('^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$', 'i');
    return v.test(str);
}


/**
 * 设置认证信息
 * @param auth {Object}
 * @param authType {AUTH_TYPE} 认证类型，默认：{AUTH_TYPE.BEARER}
 */
function setAuthorization(auth, authType = AUTH_TYPE.BEARER) {
    switch (authType) {
        case AUTH_TYPE.BEARER:
            Cookie.set(xsrfHeaderName, 'Bearer ' + auth.token, {expires: auth.expireAt})
            break
        case AUTH_TYPE.BASIC:
        case AUTH_TYPE.AUTH1:
        case AUTH_TYPE.AUTH2:
        default:
            break
    }
}

/**
 * 移出认证信息
 * @param authType {AUTH_TYPE} 认证类型
 */
function removeAuthorization(authType = AUTH_TYPE.BEARER) {
    switch (authType) {
        case AUTH_TYPE.BEARER:
            Cookie.remove(xsrfHeaderName)
            break
        case AUTH_TYPE.BASIC:
        case AUTH_TYPE.AUTH1:
        case AUTH_TYPE.AUTH2:
        default:
            break
    }
}

/**
 * 检查认证信息
 * @param authType
 * @returns {boolean}
 */
function checkAuthorization(authType = AUTH_TYPE.BEARER) {
    switch (authType) {
        case AUTH_TYPE.BEARER:
            if (Cookie.get(xsrfHeaderName)) {
                return true
            }
            break
        case AUTH_TYPE.BASIC:
        case AUTH_TYPE.AUTH1:
        case AUTH_TYPE.AUTH2:
        default:
            break
    }
    return false
}

/**
 * 加载 axios 拦截器
 * @param interceptors
 * @param options
 */
function loadInterceptors(interceptors, options) {
    const {request, response} = interceptors
    // 加载请求拦截器
    request.forEach(item => {
        let {onFulfilled, onRejected} = item
        if (!onFulfilled || typeof onFulfilled !== 'function') {
            onFulfilled = config => config
        }
        if (!onRejected || typeof onRejected !== 'function') {
            onRejected = error => Promise.reject(error)
        }
        axios.interceptors.request.use(
            config => onFulfilled(config, options),
            error => onRejected(error, options)
        )
    })

    // 加载响应拦截器
    response.forEach(item => {

        let {onFulfilled, onRejected} = item
        if (!onFulfilled || typeof onFulfilled !== 'function') {
            onFulfilled = response => response
        }
        if (!onRejected || typeof onRejected !== 'function') {
            onRejected = error => Promise.reject(error)
        }
        axios.interceptors.response.use(
            response => onFulfilled(response, options),
            error => onRejected(error, options)
        )
    })
}

/**
 * 解析 url 中的参数
 * @param ur
 * @returns {Object}
 */
function parseUrlParams(url) {
    const params = {}
    if (!url || url === '' || typeof url !== 'string') {
        return params
    }
    const paramsStr = url.split('?')[1]
    if (!paramsStr) {
        return params
    }
    const paramsArr = paramsStr.replace(/&|=/g, ' ').split(' ')
    for (let i = 0; i < paramsArr.length / 2; i++) {
        const value = paramsArr[i * 2 + 1]
        params[paramsArr[i * 2]] = value === 'true' ? true : (value === 'false' ? false : value)
    }
    return params
}

export {
    METHOD,
    AUTH_TYPE,
    request,
    setAuthorization,
    removeAuthorization,
    checkAuthorization,
    loadInterceptors,
    parseUrlParams
}
