import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'
import db from '@/utils/localstorage'

const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings

const setting = {
  state: {
    theme: variables.theme,
    showSettings: showSettings,
    tagsView: db.get('TAGSVIEW', tagsView),
    fixedHeader: fixedHeader,
    sidebarLogo: sidebarLogo
  },
  mutations: {
    CHANGE_SETTING: (state, { key, value }) => {
      if (state.hasOwnProperty(key)) {
        state[key] = value
      }
    },
    SHOW_SETTINGS(state, val) {
      state.showSettings = val
    },
    openSettingBar(state, val) {
      state.showSettings = val
    },
    setTagsView(state, val) {
      db.save('TAGSVIEW', val)
      state.tagsView = val
    },
    setSidebarLogo(state, val) {
      db.save('SIDEBAR_LOGO', val)
      state.sidebarLogo = val
    },
    fixHeader(state, val) {
      db.save('FIX_HEADER', val)
      state.fixedHeader = val
    }
  }
}

export default setting
