// themes.js
import config from '@/config'

const createLink = (() => {
  let $link:any = null
  return () => {
    if ($link) {
      return $link
    }
    $link = document.createElement('link')
    $link.rel = 'stylesheet'
    $link.type = 'text/css'
    document.querySelector('head')?.appendChild($link)
    return $link
  }
})()

/**
 * 主题切换函数
 * @param {string} theme - 主题名称, 默认default
 * @return {string} 主题名称
 */
const toggleTheme = (theme = 'light') => {
  const $link = createLink()
  $link.href = `${config.routeBasename}themes/${theme}.css`
  return theme
}

export default toggleTheme
