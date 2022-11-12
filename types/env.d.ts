declare global {
  declare interface ViteEnv {
    // 端口号
    VITE_PORT: number
    // 是否开启mock
    VITE_USE_MOCK: boolean
    // 网站根目录，需要以 /开头和结尾
    VITE_PUBLIC_PATH: string
    // 本地开发代理，可以解决跨域及多地址代理
    //  [["/api","http://localhost:3000"]]
    // 如果接口地址匹配到，则会转发到 http://localhost:3000，防止本地出现跨域问题
    // 可以有多个，注意多个不能换行，否则代理将会失效
    VITE_PROXY: [string, string][]
    // 是否删除console.log
    VITE_DROP_CONSOLE: boolean
    // 打包是否输出gz｜br文件
    // 可选: gzip | brotli | none
    // 也可以有多个，例如 'gzip'|'brotli'，这样会同时生成 .gz和.br文件
    VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'none'
    // 使用压缩时是否删除原始文件，默认为false
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean
    // 网站标题
    VITE_GLOB_APP_TITLE: string
    // 简称，用于配置文件名字 不要出现空格、数字开头等特殊字符
    VITE_GLOB_APP_SHORT_NAME: string
    // 接口地址
    // 如果没有跨域问题，直接在这里配置即可
    VITE_GLOB_API_URL: string
    // 接口地址前缀
    VITE_GLOB_API_URL_PREFIX: string
    // 文件上传地址 可选
    VITE_GLOB_UPLOAD_URL: string
    // 图片资源地址 可选
    VITE_GLOB_IMG_URL: string
    // 地图key
    VITE_GLOB_MAP_KEY: string
    // 租户模式
    VITE_GLOB_TENANT_MODE: boolean
  }
}

export type GlobEnvConfig = Pick<
  ViteEnv,
  | 'VITE_GLOB_APP_TITLE'
  | 'VITE_GLOB_APP_SHORT_NAME'
  | 'VITE_GLOB_API_URL'
  | 'VITE_GLOB_API_URL_PREFIX'
  | 'VITE_GLOB_UPLOAD_URL'
  | 'VITE_GLOB_IMG_URL'
  | 'VITE_GLOB_MAP_KEY'
  | 'VITE_GLOB_TENANT_MODE'
>
