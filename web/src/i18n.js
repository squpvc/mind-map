import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from './lang'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'en',
  messages,
  fallbackLocale: 'en'
})

export default i18n
