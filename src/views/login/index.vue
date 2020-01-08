<template>
  <div
    v-if="isShow"
    v-loading="socialLoading"
    class="login-container"
    :element-loading-text="'现在进行'+currentPath+'第三方登录,请稍等'"
  >
    <div class="login-right">
      <div class="title-container">
        <h3 class="title">
          PRE 权限后台系统登录
        </h3>
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
                placeholder="账号"
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
                placeholder="密码"
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
                    placeholder="请输入验证码"
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
              登录
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
                style="width: 65%;"
                autocomplete="off"
              >
                <i slot="prefix">
                  <svg-icon icon-class="短信" />
                </i>
              </el-input>
              <el-button :loading="codeLoading" style="width: 33%;" :disabled="isDisabled" @click="sendCode">{{
                buttonName }}
              </el-button>
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
          <span class="other-icon" @click="handleSocial('weixin')">
            <!--<a href='http://localhost:8081/auth/gitee'>-->
            <svg
              t="1566549849419"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="2078"
              width="19"
              height="20"
            ><path
              d="M401.135 660.548c-35.499 0-61.167-6.007-94.481-15.292l-96.666 48.606 27.853-82.466c-68.267-47.514-108.134-107.588-108.134-181.316 0-129.98 122.334-229.376 271.428-229.376 131.618 0 249.583 78.097 272.521 189.508-9.83-1.638-18.022-2.731-25.668-2.731-129.98 0-230.468 97.758-230.468 215.177 0 20.207 2.731 38.229 7.646 57.344-7.646 0.546-16.384 0.546-24.03 0.546z"
              fill="#0ABB07"
              p-id="2079"
            /><path
              d="M799.812 754.483l19.115 68.813-72.636-40.96c-27.853 6.007-54.613 14.199-82.466 14.199-128.341 0-229.376-87.927-229.376-196.608 0-109.227 101.035-197.154 229.376-197.154 121.242 0 230.468 87.927 230.468 197.154 0 60.621-40.96 115.234-94.481 154.556z"
              fill="#0ABB07"
              p-id="2080"
            /><path
              d="M589.551 511.454c-13.107 0-26.761 12.561-26.761 27.853 0 12.561 13.107 24.576 26.761 24.576 20.207 0 34.406-12.561 34.406-24.576 0-15.292-14.199-27.853-34.406-27.853z m-87.928-128.888c21.299 0 34.406-13.107 34.406-33.314 0-21.299-13.107-33.314-34.406-33.314-20.207 0-39.322 12.561-39.322 33.314 0 20.207 19.115 33.314 39.322 33.314z m-189.508-66.628c-20.207 0-40.96 12.561-40.96 33.314 0 20.207 21.299 33.314 40.96 33.314 19.115 0 34.406-13.107 34.406-33.314 0-21.299-15.292-33.314-34.406-33.314z m427.623 195.516c-14.199 0-26.761 12.561-26.761 27.853 0 12.561 12.561 24.576 26.761 24.576 19.115 0 33.314-12.561 33.314-24.576 0-15.292-14.746-27.853-33.314-27.853z"
              fill="#FFFFFF"
              p-id="2081"
            /></svg>
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
import { getImgCode } from '@/api/login'
import { sendSms } from '@/api/user'

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
        callback(new Error('请输入手机号'))
      } else if (!isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
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
        key: ''
      },
      src: '',
      phoneForm: {
        phone: '',
        code: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      phoneRules: {
        phone: [{ required: true, trigger: 'blur', validator: validPhone }],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]

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
  created() {
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
      getImgCode().then(res => {
        console.log(res)
        this.src = res.data.data.img
        this.loginForm.key = res.data.data.key
      })
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
        this.buttonName = '发送中'
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
            this.buttonName = this.time-- + '秒'
            this.timer = window.setInterval(function() {
              _this.buttonName = _this.time + '秒'
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
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    /*background-image: url(https://img2018.cnblogs.com/blog/1211637/201908/1211637-20190809112720089-1507550740.png);*/
    background-image: url('../../assets/63048029b07252112f0033e8e3c52865.jpg');
    /*background: red;*/
    background-size: cover;

    .login-right {
      width: 30%;
      padding: 50px;
      border-radius: 6px;
      background: #ffffff;

      .title {
        margin: 0 auto 30px auto;
        text-align: center;
        color: #505458;
      }

      .login-form {
        height: 50%;
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
        width: calc(100% - 56px)
      }

      .register {
        float: right;
        color: #1ab2ff;
        font-size: 14px;
        cursor: pointer;
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
        }
      }
    }

  }
</style>
