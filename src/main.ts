import './styles/tailwind.css'
import 'virtual:svg-icons-register'

import App from './App.vue'
import { NaiveProvider } from './components/App'
import { createApp } from 'vue'
import { initApp } from './logics/app'
import { setGlobalOptions } from 'vue-request'
import { setupRouter } from './router'
import { setupStore } from './store'
import setupFastCrud from './setup-fast-crud'
import Naive from 'naive-ui'

setGlobalOptions({
  loadingDelay: 300,
  loadingKeep: 800,
})

async function bootstrap() {
  const naiveProvider = createApp(NaiveProvider)
  const app = createApp(App)

  // 配置 store
  setupStore(app)

  // 初始化设置
  initApp()

  app.use(Naive)
  setupFastCrud(app)

  //优先挂载一下 naive-ui Provider 解决路由守卫，Axios中可使用，Dialog，Message 等之类组件
  naiveProvider.mount('#naiveProvider', true)

  // 配置路由
  await setupRouter(app)

  app.mount('#app', true)
}
bootstrap()
