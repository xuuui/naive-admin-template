import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'

export const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
export const DATE_FORMAT = 'YYYY-MM-DD'

export const formatToDateTime = (
  date: string | number | Dayjs | Date | null | undefined = undefined,
  format = DATE_TIME_FORMAT,
): string => {
  return dayjs(date).format(format)
}

export const formatToDate = (
  date: string | number | Dayjs | Date | null | undefined = undefined,
  format = DATE_FORMAT,
): string => {
  return dayjs(date).format(format)
}

export const dateUtil = dayjs
