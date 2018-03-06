import Vue from 'vue'
import VueI18n from 'vue-i18n'
import MessageFormat from 'messageformat'
import {en} from './lang/en'
import {zh} from './lang/zh'

Vue.use(VueI18n)

let currentLang = navigator.language === 'en-US' ? 'en-US' : 'zh-CN'
if (!currentLang) { // 判断IE
  currentLang = navigator.browserLanguage === 'en-US' ? 'en-US' : 'zh-CN'
}

class CustomFormatter {
  constructor (options = {}) {
    this._locale = options.locale || 'en-US'
    this._formatter = new MessageFormat(this._locale)
    this._formatter.setIntlSupport(true)
    this._caches = Object.create(null)
  }

  interpolate (message, values) {
    let fn = this._caches[message]
    if (!fn) {
      fn = this._formatter.compile(message, this._locale)
      this._caches[message] = fn
    }
    // 格式化处理
    if (en.common.alert === message) {
      values = values.map(item => item.toLowerCase())
    }
    return [fn(values)]
  }
}

export const i18n = new VueI18n({
  locale: currentLang,    // 语言标识 默认语言
  fallbackLocale: 'zh-CN', // 回退语言，如果locale指定的语言中没有某变量 则不翻译
  formatter: new CustomFormatter(), // 格式化处理
  messages: {
    'zh-CN': zh,   // 中文语言包
    'en-US': en    // 英文语言包
  }
})

