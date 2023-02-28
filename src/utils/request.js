import Vue from 'vue'
import axios from 'axios'
import { ACCESS_TOKEN } from '@/store/mutation-types.js'

import Router from '../router'
import store from '@/store'
import VueAxios from './axios.js'

const service = axios.create({
    baseURL: '',
    timeout: 6000
})

const err = (error) => {
    if (error.response) {
        const data = error.response.data
        if (error.response.status = 403) {
            // 禁止访问
        }
    }
    return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
    if (process.env.NODE_ENV === 'development') {
        console.log(config.url)
        config.url = '/proxy' + config.url
    }
    // 写入token等
    const token = Vue.ls.get(ACCESS_TOKEN)
    if (token) {
        config.headers['Authorization'] = token
    }
    return config
}, err)

// response interceptor
service.interceptors.response.use(response => {
    // 检测接口状态，满足相应条件，跳转相应页面

    return response.data
})

const installer = {
    vm: {},
    install(Vue) {
        Vue.use(VueAxios, service)
    }
}

export {
    installer as VueAxios,
    service as axios
}