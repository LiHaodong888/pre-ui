<template>
  <div>
    <div class="register-wrapper">

      <div id="register">
        <div class="header">
          <img src="/favicon.ico">
          <p class="title">Pre系统平台注册</p>
        </div>
        <el-form
          ref="ruleForm2"
          :model="registerForm"
          status-icon
          :rules="rules2"
          label-width="0"
          class="demo-ruleForm"
        >
          <el-form-item prop="username">
            <el-input v-model="registerForm.username" auto-complete="off" placeholder="输入用户名" />
          </el-form-item>
          <el-form-item prop="phone">
            <el-input v-model="registerForm.phone" auto-complete="off" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item prop="smsCode" class="code">
            <el-input v-model="registerForm.smsCode" placeholder="验证码" style="width: 234px;" />
            <el-button type="primary" :disabled="isDisabled" @click="sendCode">{{ buttonText }}</el-button>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="registerForm.password" type="password" auto-complete="off" placeholder="输入密码" />
          </el-form-item>
          <el-form-item prop="checkPass">
            <el-input
              v-model="registerForm.checkPass"
              type="password"
              auto-complete="off"
              placeholder="确认密码"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width:100%;" @click="submitForm('ruleForm2')">注册</el-button>
            <p class="login" @click="gotoLogin">已有账号？立即登录</p>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { registerUser, sendSms } from '@/api/user'

export default {
  name: 'Register',
  data() {
    // 验证手机号是否合法
    const checkTel = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号码'))
      } else if (!this.checkMobile(value)) {
        callback(new Error('手机号码不合法'))
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
    // 验证密码
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.registerForm.checkPass !== '') {
          this.$refs.ruleForm2.validateField('checkPass')
        }
        callback()
      }
    }
    // 二次验证密码
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      registerForm: {
        username: '',
        password: '',
        checkPass: '',
        phone: '',
        smsCode: ''
      },
      rules2: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }, {
          pattern: /^[a-zA-Z0-9_]{4,8}$/,
          message: '以字母开头，长度在4-8之间， 只能包含字符、数字和下划线'
        }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }, {
          min: 6,
          message: '密码长度最少为6位',
          trigger: 'blur'
        }, { validator: validatePass, trigger: 'change' }],
        checkPass: [{ validator: validatePass2, trigger: 'change' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { validator: checkTel, trigger: 'change' }],
        smsCode: [{ validator: checkSmscode, trigger: 'change' }]
      },
      buttonText: '发送验证码',
      isDisabled: false, // 是否禁止点击发送验证码按钮
      flag: true
    }
  },
  methods: {
    // 发送验证码
    sendCode() {
      const phone = this.registerForm.phone
      if (this.checkMobile(phone)) {
        console.log(phone)
        sendSms(phone).then(res => {
          if (res.data.code === 200) {
            this.$message({
              showClose: true,
              message: '发送成功，验证码有效期2分钟',
              type: 'success'
            })
            let time = 60
            this.buttonText = '已发送'
            this.isDisabled = true
            if (this.flag) {
              this.flag = false
              const timer = setInterval(() => {
                time--
                this.buttonText = time + ' 秒'
                if (time === 0) {
                  clearInterval(timer)
                  this.buttonText = '重新获取'
                  this.isDisabled = false
                  this.flag = true
                }
              }, 1000)
            }
          }
        })
      }
    },
    // 提交注册
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          registerUser(this.registerForm).then(response => {
            if (response.data.code === 200) {
              this.$notify({
                title: '成功',
                message: '注册账号成功,2秒后返回登录页面',
                type: 'success'
              })
              setTimeout(() => {
                this.$router.push({
                  path: '/login'
                })
              }, 2000)
            } else {
              this.$message({
                type: 'error',
                message: response.data.msg
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 进入登录页
    gotoLogin() {
      this.$router.push({
        path: '/login'
      })
    },
    // 验证手机号
    checkMobile(str) {
      const reg = /^1[3456789]\d{9}$/
      return reg.test(str)
    }
  }
}
</script>

<style scoped lang="scss">
  .loading-wrapper {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: #aedff8;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .register-wrapper img {
    position: absolute;
    z-index: 1;
  }

  .register-wrapper {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
  }

  #register {
    max-width: 450px;
    margin: 60px auto;
    background: #fff;
    padding: 20px 40px;
    border-radius: 10px;
    position: relative;
    z-index: 9;
  }

  .title {
    font-size: 26px;
    line-height: 50px;
    font-weight: bold;
    margin: 10px;
    text-align: center;
  }

  .el-form-item {
    text-align: center;
  }

  .login {
    margin-top: 10px;
    font-size: 14px;
    line-height: 22px;
    color: #1ab2ff;
    cursor: pointer;
    text-align: left;
    text-indent: 8px;
    width: 160px;
  }

  .login:hover {
    color: #409EFF;
  }

  .code > > > .el-form-item__content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .code button {
    margin-left: 20px;
    /*width: 140px;*/
    text-align: center;
  }

  .el-button--primary:focus {
    background: #409EFF;
    border-color: #409EFF;
    color: #fff;
  }
</style>
