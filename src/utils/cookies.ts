import { merge } from 'lodash-es'
import cookies from 'js-cookie'
import { getStorageShortName } from './env'

class Cookies {
  private prefix: string

  constructor(prefix?: string) {
    this.prefix = prefix || getStorageShortName()
  }

  set(name = 'default', value = '', cookieSetting = {}) {
    const currentCookieSetting = {
      expires: 1,
    }
    merge(currentCookieSetting, cookieSetting)
    cookies.set(`${this.prefix}-${name}`, value, currentCookieSetting)
  }

  get(name = 'default') {
    return cookies.get(`${this.prefix}-${name}`)
  }

  getAll() {
    return cookies.get()
  }

  remove(name = 'default') {
    return cookies.remove(`${this.prefix}-${name}`)
  }
}

export const createCookies = (prefix?: string) => {
  return new Cookies(prefix)
}
export default createCookies()
