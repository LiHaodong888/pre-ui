import Vue from 'vue'
// svg组件
import SvgIcon from '@/components/SvgIcon'
// 注册图标
Vue.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
