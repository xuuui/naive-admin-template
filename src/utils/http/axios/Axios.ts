import type { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios'
import type {
  RequestOptions,
  CreateAxiosOptions,
  Result,
  UploadFileParams,
} from './types'
import { EContentType, ERequestMethods } from '@/enums/httpEnum'

import qs from 'qs'
import axios from 'axios'
import { AxiosCanceler } from './axiosCancel'
import { cloneDeep, isFunction } from 'lodash-es'

/**
 * @description:  axios模块
 */
export class VAxios {
  private axiosInstance: AxiosInstance
  private readonly options: CreateAxiosOptions

  constructor(options: CreateAxiosOptions) {
    this.options = options
    this.axiosInstance = axios.create(options)
    this.setupInterceptors()
  }

  /**
   * @description:  创建axios实例
   */
  private createAxios(config: CreateAxiosOptions): void {
    this.axiosInstance = axios.create(config)
  }

  getAxios(): AxiosInstance {
    return this.axiosInstance
  }

  /**
   * @description: 重新配置axios
   */
  configAxios(config: CreateAxiosOptions) {
    if (!this.axiosInstance) {
      return
    }
    this.createAxios(config)
  }

  /**
   * @description: 设置通用header
   */
  setHeader(headers: any): void {
    if (!this.axiosInstance) {
      return
    }
    Object.assign(this.axiosInstance.defaults.headers, headers)
  }

  // support form-data
  supportFormData(config: AxiosRequestConfig) {
    const headers = config.headers || this.options.headers
    const contentType = headers?.['Content-Type'] || headers?.['content-type']

    if (
      contentType !== EContentType.FORM_URLENCODED ||
      !Reflect.has(config, 'data') ||
      config.method?.toUpperCase() === ERequestMethods.GET
    ) {
      return config
    }

    return {
      ...config,
      data: qs.stringify(config.data, { arrayFormat: 'brackets' }),
    }
  }

  /**
   * @description:   请求方法
   */
  request<T = any>(
    config: AxiosRequestConfig,
    options?: RequestOptions,
  ): Promise<T> {
    let conf: CreateAxiosOptions = cloneDeep(config)
    const transform = this.getTransform()

    const { requestOptions } = this.options

    const opt: RequestOptions = Object.assign({}, requestOptions, options)

    const { beforeRequestHook, requestCatchHook, transformResponseHook } =
      transform || {}
    if (beforeRequestHook && isFunction(beforeRequestHook)) {
      conf = beforeRequestHook(conf, opt)
    }

    //这里重新 赋值成最新的配置
    conf.requestOptions = opt

    conf = this.supportFormData(conf)

    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request<any, AxiosResponse<Result>>(conf)
        .then((res: AxiosResponse<Result>) => {
          // 请求是否被取消
          const isCancel = axios.isCancel(res)
          if (
            transformResponseHook &&
            isFunction(transformResponseHook) &&
            !isCancel
          ) {
            try {
              const ret = transformResponseHook(res, opt)
              resolve(ret)
            } catch (err) {
              reject(err || new Error('request error!'))
            }
            return
          }
          resolve(res as unknown as Promise<T>)
        })
        .catch((e: Error) => {
          if (requestCatchHook && isFunction(requestCatchHook)) {
            reject(requestCatchHook(e, opt))
            return
          }
          if (axios.isAxiosError(e)) {
            // rewrite error message from axios in here
          }
          reject(e)
        })
    })
  }

  private getTransform() {
    const { transform } = this.options
    return transform
  }

  /**
   * @description:  文件上传
   */
  uploadFile<T = any>(config: AxiosRequestConfig, params: UploadFileParams) {
    const formData = new window.FormData()
    const customFilename = params.name || 'file'

    if (params.filename) {
      formData.append(customFilename, params.file, params.filename)
    } else {
      formData.append(customFilename, params.file)
    }

    if (params.data) {
      Object.keys(params?.data || {}).forEach((key) => {
        const value = params.data![key]
        if (Array.isArray(value)) {
          value.forEach((item) => {
            formData.append(`${key}[]`, item)
          })
          return
        }

        formData.append(key, params.data![key])
      })
    }

    return this.axiosInstance.request<T>({
      method: 'POST',
      data: formData,
      headers: {
        'Content-type': EContentType.FORM_DATA,
        ignoreCancelToken: true,
      },
      ...config,
    })
  }

  /**
   * @description: 拦截器配置
   */
  private setupInterceptors() {
    const transform = this.getTransform()
    if (!transform) {
      return
    }
    const {
      requestInterceptors,
      requestInterceptorsCatch,
      responseInterceptors,
      responseInterceptorsCatch,
    } = transform

    const axiosCanceler = new AxiosCanceler()

    // 请求拦截器配置处理
    this.axiosInstance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        const ignoreCancelToken = config?.headers?.ignoreCancelToken
        const ignoreCancel =
          ignoreCancelToken !== undefined
            ? ignoreCancelToken
            : this.options.requestOptions?.ignoreCancelToken

        !ignoreCancel && axiosCanceler.addPending(config)
        if (requestInterceptors && isFunction(requestInterceptors)) {
          config = requestInterceptors(config, this.options)
        }
        return config
      },
      undefined,
    )

    // 请求拦截器错误捕获
    requestInterceptorsCatch &&
      isFunction(requestInterceptorsCatch) &&
      this.axiosInstance.interceptors.request.use(
        undefined,
        requestInterceptorsCatch,
      )

    // 响应结果拦截器处理
    this.axiosInstance.interceptors.response.use((res: AxiosResponse<any>) => {
      res && axiosCanceler.removePending(res.config)
      if (responseInterceptors && isFunction(responseInterceptors)) {
        res = responseInterceptors(res)
      }
      return res
    }, undefined)

    // 响应结果拦截器错误捕获
    responseInterceptorsCatch &&
      isFunction(responseInterceptorsCatch) &&
      this.axiosInstance.interceptors.response.use(undefined, (error) => {
        return responseInterceptorsCatch(this.axiosInstance, error)
      })
  }

  get<T = any>(
    config: AxiosRequestConfig,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request({ ...config, method: 'GET' }, options)
  }

  post<T = any>(
    config: AxiosRequestConfig,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request({ ...config, method: 'POST' }, options)
  }

  put<T = any>(
    config: AxiosRequestConfig,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request({ ...config, method: 'PUT' }, options)
  }

  delete<T = any>(
    config: AxiosRequestConfig,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request({ ...config, method: 'DELETE' }, options)
  }
}
