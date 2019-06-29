<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :default-active="$route.path"
      :collapse="isCollapse"
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      :active-text-color="variables.menuActiveText"
      :collapse-transition="false"
      :unique-opened="true"
      mode="vertical"
    >
      <!-- 修改logo -->
      <el-menu-item :class="{'submenu-title-noDropdown':isCollapse}" index="0" style="pointer-events: none;">
        <!-- 缩小时显示的logo，可以自定义，这里直接使用图标库中的 -->
        <div v-if="isCollapse" class="logo-con" style="width: 100%;height: 100%;text-align: center; padding-top: 10px">
          <img src="https://gitee.com/li_haodong/picture_management/raw/master/pic/WechatIMG9.png" alt="pre系统logo" style="max-width: 70%;max-height: 70%">
        </div>
        <!--正常状态下显示的，可以使用本地的logoImg-->
        <div class="logo-con" style="width: 100%;height: 100%;text-align: center; padding-top: 10px">
          <img src="https://gitee.com/li_haodong/picture_management/raw/master/pic/WechatIMG9.png" alt="pre系统logo" style="max-width: 100%;max-height: 100%">
          <span>后台管理系统</span>
        </div>
      </el-menu-item>
      <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
