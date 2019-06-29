<template>
  <div class="login-container">
    <div class="login-left">
      <img src="https://gitee.com/li_haodong/picture_management/raw/master/pic/WechatIMG9.png" alt="" class="img">
      <p class="title">Pre 权限管理快速开发框架</p>
      <p>v 1.0</p>
    </div>
    <div class="login-right">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="left"
      >
        <div class="title-container">
          <h3 class="title">
            {{ $t('login.title') }}
          </h3>
        </div>
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            :placeholder="$t('login.username')"
            name="username"
            type="text"
          >
            <i slot="prefix" class="">
              <svg-icon icon-class="user1" />
            </i>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            :placeholder="$t('login.password')"
            name="password"
            type="password"
          >
            <i slot="prefix" class="">
              <svg-icon icon-class="密码" />
            </i>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-col :span="12">
            <el-form-item prop="captcha">
              <el-input
                v-model="loginForm.captcha"
                type="test"
                auto-complete="off"
                placeholder="验证码, 单击图片刷新"
                style="width: 100%;"
                @keyup.enter.native="handleLogin"
              />
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1">&nbsp;</el-col>
          <el-col :span="11">
            <el-form-item>
              <img style="width: 100%;" class="pointer" :src="loginForm.src" alt="" @click="refreshCaptcha">
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >
          {{ $t('login.logIn') }}
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import { formatData } from '@/utils/webUtils'

export default {
  name: 'Login',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 2) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: '123456',
        captcha: '',
        src: ''

      },
      loginRules: {
        username: [{ required: true, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      loading: false,
      showDialog: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.refreshCaptcha()
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: this.redirect || '/' })
          }).catch(() => {
            this.loading = false
            this.refreshCaptcha()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    refreshCaptcha: function() {
      this.loginForm.src = process.env.BASE_API + '/captcha.jpg?t=' + new Date().getTime()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .login-container {
    width: 1000px;
    display: flex;
    border-radius: 5px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 0 25px #cac6c6;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 40px 0;

    .login-left {
      width: 50%;
      /*background: #1F79D6;*/
      text-align: center;
      padding-top: 60px;
      border-right: 1px solid #00000055;

      img {
        width: 140px;
      }
    }

    .login-right {
      width: 50%;
      padding: 35px;

      .title {
        margin: 0 auto 30px auto;
        text-align: center;
        color: #505458;
      }

      .remember {
        margin: 0 0 35px 0;
      }

      .el-form-item {
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 5px;
        color: #454545;
      }
    }
  }
</style>
