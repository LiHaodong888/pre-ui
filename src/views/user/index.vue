<template>
  <div class="app-container">

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="个人信息" name="first">
        <div class="user" style="width: 600px">
          <el-form ref="form" :model="user" label-width="80px">

            <el-form-item label="用户名">
              <el-input v-model="user.username" />
            </el-form-item>
            <el-form-item label="头像">
              <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="user.avatar" :src="user.avatar" class="avatar" alt="">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="user.phone" />
            </el-form-item>
            <el-form-item label="用户邮箱">
              <el-input v-model="user.email" :disabled="true" />
            </el-form-item>
            <el-form-item label="所属部门">
              <el-input v-model="user.deptName" :disabled="true" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary">提交</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </div>

      </el-tab-pane>

      <el-tab-pane label="修改密码" name="second">

        <div style="width: 400px">
          <el-form
            ref="passForm"
            :model="passForm"
            status-icon
            :rules="rules"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="原密码" prop="oldPass">
              <el-input v-model="passForm.oldPass" type="password" autocomplete="off" />
            </el-form-item>
            <el-form-item label="密码" prop="newPass">
              <el-input v-model="passForm.newPass" type="password" autocomplete="off" />
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
              <el-input v-model="passForm.checkPass" type="password" autocomplete="off" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updatePass('passForm')">修改</el-button>
              <el-button @click="resetForm('passForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>

      </el-tab-pane>
      <el-tab-pane label="修改邮箱" name="third">

        <div style="width: 500px">
          <el-form ref="mailForm" :model="mailForm" label-width="100px" class="demo-ruleForm">
            <el-form-item
              prop="email"
              label="邮箱"
              :rules="[{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
                       { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]"
            >
              <el-input v-model="mailForm.email" style="width: 250px;" />
              <el-button :loading="codeLoading" :disabled="isDisabled" @click="sendCode">{{ buttonName }}</el-button>
            </el-form-item>

            <el-form-item
              label="验证码"
              prop="code"
              :rules="[{ required: true, message: '验证码不能为空'}]"
            >
              <el-input v-model="mailForm.code" type="age" autocomplete="off" />
            </el-form-item>
            <el-form-item
              label="密码"
              prop="pass"
              :rules="[{ required: true, message: '密码不能为空'}]"
            >
              <el-input v-model="mailForm.pass" type="age" autocomplete="off" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updateEmail('mailForm')">提交</el-button>
              <el-button @click="resetForm('mailForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getUserInfo, updatePass, resetEmail, updateEmail } from '@/api/user'
export default {
  name: 'Index',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.passForm.checkPass !== '') {
          this.$refs.passForm.validateField('checkPass')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.passForm.newPass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      user: {
        avatar: '',
        username: '',
        phone: 0,
        email: '',
        deptName: '',
        jobName: '',
        createTime: ''
      },
      activeName: 'first',
      passForm: {
        oldPass: '',
        newPass: '',
        checkPass: ''
      },
      rules: {
        oldPass: [{ required: true, message: '原密码不能为空', trigger: 'blur' }],
        newPass: [{ validator: validatePass, trigger: 'blur' }],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }]
      },
      mailForm: {
        email: '',
        code: '',
        pass: ''
      },
      buttonName: '发送验证码',
      isDisabled: false,
      codeLoading: false,
      time: 60
    }
  },

  created() {
    this.findUserInfo()
  },

  methods: {
    // parseTime,
    // formatEmail(mail) {
    //   return regEmail(mail)
    // },

    // 加载用户个人信息
    findUserInfo: function() {
      getUserInfo().then((res) => {
        this.user = res.data.data
      })
    },

    // 修改密码
    updatePass: function(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = new URLSearchParams()
          params.append('oldPass', this.passForm.oldPass)
          params.append('newPass', this.passForm.newPass)
          updatePass(params).then((res) => {
            if (res.data.code === 200) {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.activeName = 'second'
              this.$refs['passForm'].resetFields()
            } else {
              this.$message({
                type: 'error',
                message: res.data.msg
              })
            }
          })
        } else {
          return false
        }
      })
    },
    // 修改邮箱
    updateEmail: function(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = new URLSearchParams()
          params.append('mail', this.mailForm.email)
          params.append('code', this.mailForm.code)
          params.append('pass', this.mailForm.pass)
          updateEmail(params).then((res) => {
            if (res.data.code === 200) {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.activeName = 'third'
              this.$refs['mailForm'].resetFields()
            } else {
              this.$message({
                type: 'error',
                message: res.data.msg
              })
            }
          })
        } else {
          return false
        }
      })
    },

    // 发送邮箱验证码
    sendCode() {
      if (this.mailForm.email && this.mailForm.email !== '') {
        this.codeLoading = true
        this.buttonName = '验证码发送中'
        const params = new URLSearchParams()
        params.append('to', this.mailForm.email)
        const _this = this
        resetEmail(params).then(res => {
          if (res.data.code === 200) {
            this.$message({
              showClose: true,
              message: '发送成功，验证码有效期5分钟',
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
      }
    },
    // handleSuccess(response, file, fileList) {
    //   this.$notify({
    //     title: '头像修改成功',
    //     type: 'success',
    //     duration: 2500
    //   })
    //   store.dispatch('GetInfo').then(() => {
    //   })
    // },
    // 监听上传失败
    // handleError(e, file, fileList) {
    //   const msg = JSON.parse(e.message)
    //   this.$notify({
    //     title: msg.message,
    //     type: 'error',
    //     duration: 2500
    //   })
    // },
    refresh() {
      this.ico = 'el-icon-loading'
      this.$refs.log.init()
      setTimeout(() => {
        this.ico = 'el-icon-refresh'
      }, 300)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },

    // handleAvatarSuccess(res, file) {
    //   // this.imageUrl = URL.createObjectURL(file.raw)
    //   const data = new FormData()
    //   data.append('token', '')
    //   data.append('file', file[0])
    //   axiosInstance({
    //     method: 'POST',
    //     url: 'http://up.qiniu.com',
    //     data: data
    //   })
    //     .then(function(res) {
    //       // console.log('res',res)
    //       const { base_url, path } = res.data
    //       // 页面所用字段
    //       self.previewAvatar = `${base_url}${path}?imageView2/1/w/154/h/154`
    //       // 传给后台不完整
    //       self.formData.avatar = `${path}`
    //     })
    //     .catch(function(err) {
    //       console.log('err', err)
    //     })
    // },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">

</style>
