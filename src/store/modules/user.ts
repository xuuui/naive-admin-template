import type { ErrorMessageMode } from '@/utils/http/axios/types'
import { ROLES_KEY, TOKEN_KEY, USER_INFO_KEY } from '@/enums/cacheEnum'
import { EPageRoute } from '@/enums/pageEnum'
import { EAccountType, ERole } from '@/enums/sysEnum'
import { defineStore } from 'pinia'
import { router } from '@/router'
import { store } from '@/store'
import { usePermissionStore } from '@/store/modules/permission'
import { useWeb } from '@/hooks/web/useWeb'
import {
  clearAuthCache,
  getAuthCache,
  getToken,
  setAuthCache,
  setUuid,
} from '@/utils/auth'
import type { AccountModel } from '@/models/sys/account.model'
import { GET_LOGIN_ACCOUNT, LOGIN, LoginParams } from '@/api/sys/auth'

interface UserState {
  userInfo: Nullable<AccountModel>
  token?: string
  roleList: ERole[]
  sessionTimeout?: boolean
  lastUpdateTime: number
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    userInfo: null,
    token: getToken() || undefined,
    roleList: [],
    sessionTimeout: false,
    lastUpdateTime: 0,
  }),
  getters: {
    getUserInfo(state) {
      return state.userInfo || getAuthCache(USER_INFO_KEY)
    },
    getToken(state) {
      return state.token || getToken()
    },
    isLogin() {
      return !!this.getToken
    },
    getRoleList(state) {
      return state.roleList.length > 0
        ? state.roleList
        : getAuthCache(ROLES_KEY) || []
    },
    getSessionTimeout(state) {
      return !!state.sessionTimeout
    },
    getLastUpdateTime(state) {
      return state.lastUpdateTime
    },
    getIsSuperAdmin(state): boolean {
      return !!state.userInfo?.identity?.isSuperAdmin
    },
    getAccountType(state): EAccountType {
      return state.userInfo!.accountType
    },
    getTenantId(state): string | undefined {
      return state.userInfo?.tenantId
    },
  },
  actions: {
    setToken(token = '') {
      this.token = token
      setAuthCache(TOKEN_KEY, token)
    },
    setRoleList(roleList: ERole[] = []) {
      this.roleList = roleList
      setAuthCache(ROLES_KEY, roleList)
    },
    setUserInfo(info: Nullable<AccountModel> = null) {
      this.userInfo = info
      this.lastUpdateTime = new Date().getTime()
      setAuthCache(USER_INFO_KEY, info)
    },
    setSessionTimeout(sessionTimeout = false) {
      this.sessionTimeout = sessionTimeout
    },
    async login(
      params: LoginParams & {
        goHome?: boolean
        mode?: ErrorMessageMode
      },
    ): Promise<Nullable<AccountModel>> {
      const { goHome = true, mode, ...loginParams } = params
      const data = await LOGIN(loginParams, mode)
      const { token, account } = data
      this.setToken(token)
      this.setUserInfo(account)
      return this.afterLoginAction(goHome)
    },
    async afterLoginAction(goHome?: boolean): Promise<AccountModel | null> {
      if (!this.isLogin) return null

      const userInfo = this.userInfo
        ? this.userInfo
        : await this.getUserInfoAction()
      setUuid(userInfo?.id || '')
      const sessionTimeout = this.sessionTimeout

      if (sessionTimeout) {
        this.setSessionTimeout(false)
      } else {
        const permissionStore = usePermissionStore()
        if (!permissionStore.isDynamicAddedRoute) {
          await permissionStore.buildRoutesAction()
        }
        if (goHome) {
          await router.replace(EPageRoute.BASE_HOME)
        }
      }
      return userInfo
    },
    async getUserInfoAction(): Promise<AccountModel | null> {
      if (!this.isLogin) return null
      const userInfo = await GET_LOGIN_ACCOUNT()
      this.setUserInfo(userInfo)
      return userInfo
    },
    async logout(goLogin = false) {
      this.setToken(undefined)
      this.setSessionTimeout(false)
      this.setUserInfo(null)
      clearAuthCache()
      goLogin && router.push(EPageRoute.BASE_LOGIN)
    },
    resetState() {
      this.userInfo = null
      this.token = ''
      this.roleList = []
      this.sessionTimeout = false
    },
    confirmLoginOut() {
      const { createConfirm } = useWeb()
      const confirm = createConfirm({
        content: '是否确认退出系统?',
        onPositiveClick: async () => {
          confirm.loading = true
          await this.logout(true)
        },
      })
    },
  },
})

export function useUserStoreWithOut() {
  return useUserStore(store)
}
