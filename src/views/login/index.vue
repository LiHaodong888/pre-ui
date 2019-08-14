<template>
  <div
    v-if="isShow"
    v-loading="socialLoading"
    class="login-container"
    :element-loading-text="'现在进行'+currentPath+'第三方登录,请稍等'"
  >
    <div class="login-left">
      <img src="https://gitee.com/li_haodong/picture_management/raw/master/pic/WechatIMG9.png" alt="" class="img">
      <p class="title">Pre 权限管理快速开发框架</p>
      <p>v 1.2</p>
    </div>
    <div class="login-right">
      <div class="title-container">
        <h3 class="title">
          {{ $t('login.title') }}
        </h3>
        <el-select
          v-model="active"
          placeholder="点击请选择租户"
          size="mini"
          class="login-select"
          @change="handleTenant"
        >
          <el-option v-for="tenant in tenantList" :key="tenant.id" :label="tenant.name" :value="tenant.id" />
        </el-select>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane name="loginForm">
          <span slot="label"><i slot="prefix" class=""><svg-icon icon-class="user" /></i> 用户名登录</span>
          <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            label-position="left"
          >
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                :placeholder="$t('login.username')"
                name="username"
                type="text"
                autocomplete="off"
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
              <el-col :span="12" style="overflow:hidden">
                <el-form-item prop="captcha">
                  <el-input
                    v-model="loginForm.code"
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
                  <img
                    style="width: 85%;height: 35px;float: right;"
                    class="pointer"
                    :src="src"
                    alt=""
                    @click="refreshCaptcha"
                  >
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
        </el-tab-pane>
        <el-tab-pane name="phoneForm" label="手机号登录">
          <span slot="label"><i slot="prefix" class=""><svg-icon icon-class="phone" /></i> 手机号登录</span>
          <el-form
            ref="phoneForm"
            :model="phoneForm"
            :rules="phoneRules"
            class="login-form"
            label-position="left"
          >
            <el-form-item prop="phone">
              <el-input
                v-model="phoneForm.phone"
                placeholder="请输入手机号"
                name="phone"
                type="text"
                autocomplete="off"
              >
                <i slot="prefix">
                  <svg-icon icon-class="phone" />
                </i>
              </el-input>
            </el-form-item>

            <el-form-item prop="code">
              <el-input
                v-model="phoneForm.code"
                placeholder="请输入验证码"
                name="code"
                style="width: 275px;"
                autocomplete="off"
              >
                <i slot="prefix">
                  <svg-icon icon-class="短信" />
                </i>
              </el-input>
              <el-button :loading="codeLoading" :disabled="isDisabled" @click="sendCode">{{ buttonName }}</el-button>
            </el-form-item>

            <el-button
              :loading="loading"
              type="primary"
              style="width:100%;"
              @click.native.prevent="phoneLogin"
            >登录
            </el-button>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <div class="other-login">
        <div class="other-way">
          <span>其他方式登录:</span>
          <span class="other-icon" @click="handleSocial('github')">
            <svg
              t="1562648902715"
              class="fa-icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="17.05"
              height="17.6"
              style="font-size: 1.1em;"
            >
              <path
                d="M950.930286 512q0 143.433143-83.748571 257.974857t-216.283429 158.573714q-15.433143 2.852571-22.601143-4.022857t-7.168-17.115429l0-120.539429q0-55.442286-29.696-81.115429 32.548571-3.437714 58.587429-10.313143t53.686857-22.308571 46.299429-38.034286 30.281143-59.977143 11.702857-86.016q0-69.12-45.129143-117.686857 21.138286-52.004571-4.534857-116.589714-16.018286-5.12-46.299429 6.290286t-52.589714 25.161143l-21.723429 13.677714q-53.174857-14.848-109.714286-14.848t-109.714286 14.848q-9.142857-6.290286-24.283429-15.433143t-47.689143-22.016-49.152-7.68q-25.161143 64.585143-4.022857 116.589714-45.129143 48.566857-45.129143 117.686857 0 48.566857 11.702857 85.723429t29.988571 59.977143 46.006857 38.253714 53.686857 22.308571 58.587429 10.313143q-22.820571 20.553143-28.013714 58.88-11.995429 5.705143-25.746286 8.557714t-32.548571 2.852571-37.449143-12.288-31.744-35.693714q-10.825143-18.285714-27.721143-29.696t-28.306286-13.677714l-11.410286-1.682286q-11.995429 0-16.603429 2.56t-2.852571 6.582857 5.12 7.972571 7.460571 6.875429l4.022857 2.852571q12.580571 5.705143 24.868571 21.723429t17.993143 29.110857l5.705143 13.165714q7.460571 21.723429 25.161143 35.108571t38.253714 17.115429 39.716571 4.022857 31.744-1.974857l13.165714-2.267429q0 21.723429 0.292571 50.834286t0.292571 30.866286q0 10.313143-7.460571 17.115429t-22.820571 4.022857q-132.534857-44.032-216.283429-158.573714t-83.748571-257.974857q0-119.442286 58.88-220.306286t159.744-159.744 220.306286-58.88 220.306286 58.88 159.744 159.744 58.88 220.306286z"
                p-id="1535"
              />
            </svg>
          </span>

          <span class="other-icon" @click="handleSocial('qq')">
            <svg aria-hidden="true" width="14" height="16" viewBox="0 0 448 512" focusable="false" class="fa-icon">
              <path
                d="M433.8 420.4c-11.5 1.4-44.9-52.7-44.9-52.7 0 31.3-16.1 72.2-51.1 101.8 16.8 5.2 54.8 19.2 45.8 34.4-7.3 12.3-125.5 7.9-159.6 4-34.1 3.8-152.3 8.3-159.6-4-9-15.3 28.9-29.2 45.8-34.4-34.9-29.5-51.1-70.4-51.1-101.8 0 0-33.3 54.1-44.9 52.7-5.4-0.7-12.4-29.6 9.3-99.7 10.3-33 22-60.5 40.1-105.8-3.1-116.9 45.2-215 160.3-215 113.7 0 163.2 96.1 160.3 215 18.1 45.2 29.9 72.9 40.1 105.8 21.8 70.1 14.7 99.1 9.3 99.7z"
              />
            </svg>
          </span>

          <span class="other-icon" @click="handleSocial('gitee')">
            <!--<a href='http://localhost:8081/auth/gitee'>-->
            <svg
              t="1563366479009"
              class="fa-icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="1418"
              width="14"
              height="16"
            >
              <path
                d="M891 428.8H465.8c-20.4 0-37 16.5-37 37v92.4c0 20.4 16.5 37 37 37h258.9c20.4 0 37 16.6 37 37v18.4c0 61.3-49.7 110.9-110.9 110.9H299.4c-20.4 0-37-16.6-37-37V373.2c0-61.3 49.7-110.9 110.9-110.9h517.6c20.4 0 37-16.5 37-37l0.1-92.3c0-20.4-16.5-37-37-37H373.3C220.2 96 96 220.2 96 373.3V891c0 20.4 16.6 37 37 37h545.4C816.2 928 928 816.3 928 678.4V465.8c0-20.4-16.6-37-37-37z"
                fill="#d81e06"
                p-id="1419"
              />
            </svg>
            <!--</a>-->
          </span>
        </div>
        <div class="register">
          <span class="" @click="gotoRegister()">注册账户</span>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import { formatData, getUrlKey } from '@/utils/webUtils'
import { isvalidPhone } from '@/utils/validate'
import { github } from '@/api/login'
import { sendSms } from '@/api/user'
import { setTenant } from '@/utils/tenant'
import { getTenantList } from '@/api/tenant'

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
    // 验证手机号格式
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入电话号码'))
      } else if (!isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
    // 验证码是否为空
    const checkSmscode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机验证码'))
      } else {
        callback()
      }
    }
    return {
      tenantList: [],
      loginForm: {
        username: 'admin',
        password: '123456',
        code: '',
        token: '',
        t: ''
      },
      src: '',
      phoneForm: {
        phone: '',
        code: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      phoneRules: {
        phone: [{ required: true, trigger: 'blur', validator: validPhone }],
        code: [{ validator: checkSmscode, trigger: 'change' }]

      },
      passwordType: 'password',
      loading: false,
      showDialog: false,
      redirect: undefined,
      token: '',
      isShow: true,
      activeName: 'loginForm',
      buttonName: '发送验证码',
      isDisabled: false,
      codeLoading: false,
      time: 60,
      socialLoading: false,
      currentPath: '',
      active: ''
    }
  },
  // watch: {
  //   $route: {
  //     handler: function(route) {
  //       this.redirect = route.query && route.query.redirect
  //     },
  //     immediate: true,
  //
  //   }
  // },
  created() {
    this.getTenantList()
    this.refreshCaptcha()
    this.socialLogin()
  },
  mounted() {
    // 自动加载indexs方法

  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    // 用户名 密码登录
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

    // 手机号短信登录
    phoneLogin() {
      this.$refs.phoneForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('LoginByUserPhone', this.phoneForm).then(() => {
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
      this.loginForm.code = ''
      this.loginForm.t = new Date().getTime()
      // this.loginForm.src = process.env.BASE_API + '/captcha.jpg?t=' + this.loginForm.t
      this.src = 'http://localhost:8081/captcha.jpg?t=' + this.loginForm.t
    },
    // 社交登录
    socialLogin() {
      const _this = this
      _this.loginForm.token = getUrlKey('token')
      if (this.loginForm.token != null && this.loginForm.token !== '') {
        _this.isShow = false
        this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
          this.loading = false
          this.$router.push({ path: this.redirect || '/' })
        }).catch(() => {
          this.loading = false
          this.refreshCaptcha()
        })
      }
    },
    // 发送短信验证码
    sendCode() {
      if (this.phoneForm.phone !== '' && isvalidPhone(this.phoneForm.phone)) {
        this.codeLoading = true
        this.buttonName = '验证码发送中'
        const _this = this
        sendSms(this.phoneForm.phone).then(res => {
          if (res.data.code === 200) {
            this.$message({
              showClose: true,
              message: '发送成功，验证码有效期2分钟',
              type: 'success'
            })
            this.codeLoading = false
            this.isDisabled = true
            this.buttonName = this.time-- + '秒后重新发送'
            this.timer = window.setInterval(function() {
              _this.buttonName = _this.time + '秒后重新发送'
              --_this.time
              if (_this.time < 0) {
                _this.buttonName = '重新发送'
                _this.time = 60
                _this.isDisabled = false
                window.clearInterval(_this.timer)
              }
            }, 1000)
          }
        }).catch(err => {
          this.resetForm()
          this.codeLoading = false
          console.log(err.data.message)
        })
      } else {
        this.$message({
          showClose: true,
          message: '请输入手机号',
          type: 'error'
        })
      }
    },
    handleClick(tab, event) {
      this.$refs[tab.paneName].resetFields()
    },
    handleSocial(path) {
      this.currentPath = path
      this.socialLoading = true
      window.location.href = 'http://localhost:8081/auth/' + path
    },
    gotoRegister() {
      this.$router.push({
        path: '/register'
      })
    },
    handleTenant(tenantId) {
      setTenant(tenantId)
    },
    getTenantList() {
      getTenantList().then(res => {
        this.tenantList = res.data.data
      })
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
      padding-top: 90px;
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

      .other-login {
        margin-top: 3vh;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
      }

      .other-icon {
        cursor: pointer;
        margin-left: 5px;
        fill: rgba(0, 0, 0, .2);
      }

      .other-icon:hover {
        fill: rebeccapurple;
      }

      .other-login .other-way {
        font-size: 14px;
        color: #515a6e;
      }

      .register {
        float: right;
        color: #1ab2ff;
        font-size: 14px;
        cursor: pointer;
        width: calc(100% - 160px);
        text-align: right;
      }

      .login-select {
        margin-left: 100px;
        margin-bottom: 13px;

        input {
          color: #333;
          font-size: 14px;
          font-weight: 400;
          border: none;
          text-align: center;
        }
      }
    }

  }
</style>
