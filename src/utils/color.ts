const addLight = (color: string, amount: number) => {
  const cc = parseInt(color, 16) + amount
  const c = cc > 255 ? 255 : cc
  return c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`
}

export const lighten = (color: string, amount: number) => {
  color = color.indexOf('#') >= 0 ? color.substring(1, color.length) : color
  amount = Math.trunc((255 * amount) / 100)
  return `#${addLight(color.substring(0, 2), amount)}${addLight(
    color.substring(2, 4),
    amount,
  )}${addLight(color.substring(4, 6), amount)}`
}

export const rgbToHex = (rgb: string) => {
  const _this = rgb
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  if (/^(rgb|RGB)/.test(_this)) {
    const aColor = _this.replace(/(?:\(|\)|rgb|RGB)*/g, '').split(',')
    let strHex = '#'
    for (let i = 0; i < aColor.length; i++) {
      let hex = Number(aColor[i]).toString(16)
      hex = String(hex).length == 1 ? 0 + '' + hex : hex // 保证每个rgb的值为2位
      if (hex === '0') {
        hex += hex
      }
      strHex += hex
    }
    if (strHex.length !== 7) {
      strHex = _this
    }
    return strHex
  } else if (reg.test(_this)) {
    const aNum = _this.replace(/#/, '').split('')
    if (aNum.length === 6) {
      return _this
    } else if (aNum.length === 3) {
      let numHex = '#'
      for (let i = 0; i < aNum.length; i += 1) {
        numHex += aNum[i] + aNum[i]
      }
      return numHex
    }
  } else {
    return _this
  }
}

export const colorToRgba = (color: string, alpha = 0.3) => {
  color = rgbToHex(color)!
  // 十六进制颜色值的正则表达式
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  /* 16进制颜色转为RGB格式 */
  let sColor = color.toLowerCase()
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
      }
      sColor = sColorNew
    }
    // 处理六位的颜色值
    const sColorChange: number[] = []
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
    }
    // return sColorChange.join(',')
    return 'rgba(' + sColorChange.join(',') + ',' + alpha + ')'
  } else {
    return sColor
  }
}
