import Cookie from 'js-cookie'

const respCommon = {
    /**
     * 响应数据之前做点什么
     * @param response 响应对象
     * @param options 应用配置 包含: {router, i18n, store, message}
     * @returns {*}
     */
    onFulfilled(response, options) {
        const {message} = options
        const {data} = response

        if (data.code === 400) {
            message.error('错误请求')
            return Promise.reject(new Error('错误请求'))
        }

        if (data.code !== 2000 && data.code !== 0) {
            message.error(data.message)
            return Promise.reject()
        }
        return response
    },
    /**
     * 响应出错时执行
     * @param error 错误对象
     * @param options 应用配置 包含: {router, i18n, store, message}
     * @returns {Promise<never>}
     */
    onRejected(error, options) {
        const {message} = options
        message.error(error.message)
        return Promise.reject(error)
    }
}

const reqCommon = {
    /**
     * 发送请求之前做些什么
     * @param config axios config
     * @param options 应用配置 包含: {router, i18n, store, message}
     * @returns {*}
     */
    onFulfilled(config) {
        //const {message} = options
        const {url, xsrfCookieName} = config
        if (url.indexOf('login') === -1 && xsrfCookieName && !Cookie.get(xsrfCookieName)) {
            //    message.warning('认证 token 已过期，请重新登录')
        }
        return config
    },
    /**
     * 请求出错时做点什么
     * @param error 错误对象
     * @param options 应用配置 包含: {router, i18n, store, message}
     * @returns {Promise<never>}
     */
    onRejected(error, options) {
        const {message} = options
        message.error(error.message)
        return Promise.reject(error)
    }
}

export default {
    request: [reqCommon], // 请求拦截
    response: [respCommon] // 响应拦截
}
