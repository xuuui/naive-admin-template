import type { DialogOptions } from 'naive-ui'

export const useWeb = () => {
  const message = window.$NMessage
  const dialog = window.$NDialog
  const notification = window.$NNotification
  const loadingBar = window.$NLoadingBar

  const createConfirm = (options: DialogOptions) => {
    return dialog.info({
      title: '温馨提醒',
      positiveText: '确定',
      negativeText: '取消',
      ...options,
    })
  }

  const createErrorDialog = (options: DialogOptions) => {
    return dialog.error({
      title: '错误提示',
      positiveText: '确定',
      ...options,
    })
  }
  return {
    message,
    dialog,
    notification,
    loadingBar,
    createConfirm,
    createErrorDialog,
  }
}
