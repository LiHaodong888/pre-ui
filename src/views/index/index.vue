<template>
  <div class="wel-contailer">
    <div class="banner-text">
      <div style="text-align: center;">
        <img src="https://gitee.com/li_haodong/picture_management/raw/master/pic/WechatIMG9.png" height="256" width="256" alt="pre系统logo">
      </div>
      <span>
        <a href="https://gitee.com/li_haodong/pre" target="_blank">
          <img src="https://img.shields.io/badge/Pre-1.1-green.svg" alt="Build Status">
        </a>
        <img src="https://img.shields.io/badge/spring--boot-2.1.6.RELEASE-green.svg" alt="spring-boot">
        <img src="https://img.shields.io/badge/security-5.1.5-blue.svg" alt="security">
        <img src="https://img.shields.io/badge/mybatis--plus-3.1.2-blue.svg" alt="mybatis-plus">
      </span>
      <br>
      <span>
        <el-collapse v-model="activeNames">
          <el-collapse-item title="Pre RBAC权限管理系统" name="1">
            <div>基于Spring Boot 2.1.6.RELEASE</div>
            <div>基于Spring Security 5.1.5</div>
          </el-collapse-item>
          <el-collapse-item title="Pre 完美的容器化支持" name="2">
            <div>支持docker部署</div>
          </el-collapse-item>
          <el-collapse-item title="Pre 完美解决前后分离第三方登录" name="3">
            <div>支持第三方社交登录</div>
          </el-collapse-item>
          <el-collapse-item title="Pre 项目特点" name="4">
            <div>前后端分离架构</div>
            <div>Jwt Token 鉴权机制</div>
            <div>代码注释丰富，极其简洁风格，上手快易理解</div>
            <div>采用Restfull API 规范开发</div>
            <div>统一异常拦截，友好的错误提示</div>
            <div>基于注解 + Aop切面实现全方位日记记录系统</div>
            <div>基于Mybatis拦截器 + 策略模式实现数据权限控制</div>
          </el-collapse-item>
          <el-collapse-item title="基本功能" name="4">
            <div>用户管理 、角色管理 、角色管理 、菜单管理 、部门管理 、社交账号管理</div>
            <div>岗位管理 、字典管理 、操作日志 、异常日志 、代码生成</div>
            <div><a href="https://gitee.com/li_haodong/pre" target="_blank">详细介绍Pre </a></div>
          </el-collapse-item>
        </el-collapse>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      activeNames: ['1', '2', '3', '4'],
      DATA: [],
      text: '',
      actor: '',
      count: 0,
      isText: false
    }
  },

  methods: {
  }
}
</script>

<style scoped="scoped" lang="scss">
  .wel-contailer {
    position: relative;
  }

  .banner-text {
    position: relative;
    padding: 0 20px;
    font-size: 20px;
    text-align: center;
    color: #333;
  }

  .banner-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.8;
    display: none;
  }

  .actor {
    height: 250px;
    overflow: hidden;
    font-size: 18px;
    color: #333;
  }

  .actor:after {
    content: '';
    width: 3px;
    height: 25px;
    vertical-align: -5px;
    margin-left: 5px;
    background-color: #333;
    display: inline-block;
    animation: blink 0.4s infinite alternate;
  }

  .typeing:after {
    animation: none;
  }

  @keyframes blink {
    to {
      opacity: 0;
    }
  }
</style>
