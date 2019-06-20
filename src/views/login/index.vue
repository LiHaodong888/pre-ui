<template>
  <div class="login-container">
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
        <lang-select class="set-language" />
      </div>
      <!--<el-card class="box-card">-->
      <el-form-item prop="username">
        <!--<span class="svg-container">-->
        <!--<svg-icon icon-class="user" />-->
        <!--</span>-->
        <el-input
          v-model="loginForm.username"
          :placeholder="$t('login.username')"
          name="username"
          type="text"
        />
      </el-form-item>

      <el-form-item prop="password">
        <!--<span class="svg-container">-->
        <!--<svg-icon icon-class="password" />-->
        <!--</span>-->
        <el-input
          v-model="loginForm.password"
          :placeholder="$t('login.password')"
          name="password"
          type="password"
          @keyup.enter.native="handleLogin"
        >
          <i slot="prefix" class="el-input__icon el-icon-search" />

        </el-input>
        <!--<span class="show-pwd" @click="showPwd">-->
        <!--<svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" @keyup.enter.native="handleLogin"/>-->
        <!--</span>-->
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
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >
        {{ $t('login.logIn') }}
      </el-button>
      <!--</el-card>-->
    </el-form>
  </div>
</template>

<script>
import LangSelect from '@/components/LangSelect'
import { formatData } from '@/utils/webUtils'

export default {
  name: 'Login',
  components: { LangSelect },
  data() {
    // const validateUsername = (rule, value, callback) => {
    //   if (!validUsername(value)) {
    //     callback(new Error('Please enter the correct user name'))
    //   } else {
    //     callback()
    //   }
    // }
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
        password: 'admin',
        captcha: '',
        src: ''

      },
      loginRules: {
        // username: [{ required: true, trigger: 'blur', validator: validateUsername }],
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
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
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
      this.loginForm.src = 'http://localhost:8081/captcha.jpg?t=' + new Date().getTime()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 100px auto;
    width:400px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
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
  .login-container {

  }
</style>
