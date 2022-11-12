import { FastCrud, useTypes } from '@fast-crud/fast-crud'
import '@fast-crud/fast-crud/dist/style.css'
import { FsExtendsEditor } from '@fast-crud/fast-extends'
import { FsExtendsUploader } from '@/FastExtends'
import '@fast-crud/fast-extends/dist/style.css'
import { GET_ITEMS_BY_CODE } from './api/sys/dict'
import { getToken } from './utils/auth'
import { HTTP_HEADER_TOKEN } from './enums/sysEnum'
import { type App } from 'vue'
import { defHttp } from './utils/http/axios'
import { getGlobEnvConfig } from './utils/env'
import ui from '@fast-crud/ui-naive'

// 导出 setupFastCrud
export default function (app: App<Element>) {
  app.use(ui)
  //再安装fast-crud
  app.use(FastCrud, {
    async dictRequest({ url }) {
      return await GET_ITEMS_BY_CODE({ code: url })
    },
    commonOptions() {
      return {
        toolbar: {
          compact: true,
          buttons: {
            refresh: {
              size: 'small',
              icon: 'ant-design:sync-outlined',
            },
            search: {
              show: false,
              icon: 'ant-design:search-outlined',
              size: 'small',
            },
            compact: {
              show: false,
              icon: 'ant-design:drag-outlined',
              size: 'small',
            },
            // 导出按钮
            export: {
              show: true,
              icon: 'ant-design:export-outlined',
              size: 'small',
            },
            // 列设置按钮
            columns: {
              icon: 'ant-design:control-outlined',
              size: 'small',
              show: false,
            },
          },
        },
        search: {
          show: false,
          component: { size: 'small' },
          buttons: {
            reset: {
              size: 'small',
            },
            search: {
              size: 'small',
            },
          },
        },
        actionbar: {
          buttons: {
            add: {
              icon: 'ant-design:plus-outlined',
              size: 'small',
            },
          },
        },
        rowHandle: {
          width: 130,
          align: 'center',
          // 固定右侧 不建议设置成全局
          fixed: 'right',
          buttons: {
            view: {
              size: 'tiny',
              type: 'info',
              text: null,
              icon: 'ant-design:eye-outlined',
              secondary: true,
            },
            edit: {
              size: 'tiny',
              type: 'success',
              text: null,
              icon: 'ant-design:edit-outlined',
              secondary: true,
            },
            remove: {
              size: 'tiny',
              type: 'error',
              text: null,
              icon: 'ant-design:delete-outlined',
              secondary: true,
            },
          },
          dropdown: {
            more: {
              type: 'link',
            },
          },
        },
        request: {
          transformQuery: ({ page, form, sort }) => {
            return {
              page: page?.currentPage ?? 1,
              limit: page.pageSize,
              ...form,
              sort,
            }
          },
          transformRes: ({ res }) => {
            return {
              currentPage: res.page,
              pageSize: res.limit,
              total: res.total,
              records: res.result,
            }
          },
        },
        form: {
          display: 'flex',
          wrapper: {
            width: '50%',
          },
        },
        table: {
          rowKey: (item) => item.id,
          size: 'small',
          paginateSinglePage: false,
          maxHeight: null,
        },
        pagination: {
          pageSize: 10,
          pageSizeOptions: ['10', '15', '30', '50'],
        },
        container: {
          fixedHeight: false,
        },
      }
    },
  })

  app.use(FsExtendsEditor)
  //配置uploader 公共参数
  app.use(FsExtendsUploader, {
    defaultType: 'form',
    cos: {
      domain: 'https://d2p-demo-1251260344.cos.ap-guangzhou.myqcloud.com',
      bucket: 'd2p-demo-1251260344',
      region: 'ap-guangzhou',
      secretId: '', //
      secretKey: '', // 传了secretKey 和secretId 代表使用本地签名模式（不安全，生产环境不推荐）
      async getAuthorization() {
        // 不传secretKey代表使用临时签名模式,此时此参数必传（安全，生产环境推荐）
        return await defHttp.request(
          {
            url: '/upload/cos/getAuthorization',
            method: 'get',
          },
          { apiUrl: 'http://www.docmirror.cn:7070/api' },
        )
      },
      successHandle(ret) {
        // 上传完成后可以在此处处理结果，修改url什么的
        console.log('success handle:', ret)
        return ret
      },
    },
    alioss: {
      domain: 'https://d2p-demo.oss-cn-shenzhen.aliyuncs.com',
      bucket: 'd2p-demo',
      region: 'oss-cn-shenzhen',
      accessKeyId: '',
      accessKeySecret: '',
      async getAuthorization() {
        // 不传accessKeySecret代表使用临时签名模式,此时此参数必传（安全，生产环境推荐）
        return defHttp.request(
          {
            url: '/upload/alioss/getAuthorization',
            method: 'get',
          },
          { apiUrl: 'http://www.docmirror.cn:7070/api' },
        )
      },
      sdkOpts: {
        // sdk配置
        secure: true, // 默认为非https上传,为了安全，设置为true
      },
      successHandle(ret) {
        // 上传完成后可以在此处处理结果，修改url什么的
        console.log('success handle:', ret)
        return ret
      },
    },
    qiniu: {
      bucket: 'd2p-demo',
      async getToken() {
        // return  {token:xxx,expires:xxx}
        return defHttp.request(
          {
            url: '/upload/qiniu/getToken',
            method: 'get',
          },
          { apiUrl: 'http://www.docmirror.cn:7070/api' },
        )
      },
      successHandle(ret) {
        // 上传完成后可以在此处处理结果，修改url什么的
        console.log('success handle:', ret)
        return ret
      },
      domain: 'http://d2p.file.veryreader.com',
    },
    form: {
      action: getGlobEnvConfig().VITE_GLOB_UPLOAD_URL,
      name: 'file',
      withCredentials: false,
      headers: {
        [HTTP_HEADER_TOKEN]: getToken(),
      },
      successHandle({ result }) {
        // 上传完成后的结果处理， 此处后台返回的结果应该为 ret = {code:0,msg:'',data:fileUrl}
        if (!result) {
          throw new Error('上传失败')
        }
        return { url: result } // data是该文件的url
      },
    },
  })

  const { getType } = useTypes()
  getType('text').form.component.autocomplete = 'off'
  getType('dict-select').column.component.color = 'auto'
  getType('dict-radio').column.component.color = 'auto'
}
