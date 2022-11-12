import { EThemeMode } from '@/enums/appEnum'

export function setHtmlRootTheme(mode: EThemeMode) {
  const htmlRoot = document.getElementById('htmlRoot')
  if (!htmlRoot) {
    return
  }
  htmlRoot.setAttribute(
    'data-theme',
    mode === EThemeMode.DARK ? 'dark' : 'light',
  )
}

export const syncNaiveElToHtml = (value?: string) => {
  console.log('同步主题')
  if (value) {
    document.documentElement.style.cssText += value
    return
  }
  const el = document.getElementById('app-el')
  const cssText = el?.style?.cssText ?? ''
  document.documentElement.style.cssText += cssText
}
