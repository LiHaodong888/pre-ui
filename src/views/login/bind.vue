<template>
  <div class="login-container">
    <div class="login-right">
      <div class="title-container">
        <h3 class="title">
          系统登录
        </h3>
      </div>
      <el-tabs v-model="activeName">
        <el-tab-pane name="bind">
          <span slot="label"><i slot="prefix" class=""><svg-icon icon-class="user" /></i> 绑定Pre账号</span>
          <el-form
            ref="bindForm"
            :model="bindForm"
            :rules="loginRules"
            class="login-form"
            label-position="left"
          >
            <el-form-item prop="username">
              <el-input
                v-model="bindForm.username"
                placeholder="请输入账号"
                type="text"
                autocomplete="off"
                value=""
              >
                <i slot="prefix" class="">
                  <svg-icon icon-class="user1" />
                </i>
              </el-input>
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="bindForm.password"
                placeholder="请输入密码"
                type="password"
              >
                <i slot="prefix" class="">
                  <svg-icon icon-class="密码" />
                </i>
              </el-input>
            </el-form-item>

            <el-button
              :loading="loading"
              type="primary"
              style="width:100%;"
              @click.native.prevent="bindUser"
            >
              绑定
            </el-button>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <el-button type="text" @click="jump">返回登录</el-button>
    </div>
  </div>
</template>

<script>
import { getUrlKey } from '@/utils/webUtils'
import { bindUser } from '@/api/user'

export default {
  name: 'Index',
  data() {
    return {
      activeName: 'bind',
      loading: false,
      bindForm: {
        username: '',
        password: '',
        key: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
        password: [{ required: true, trigger: 'blur', message: '请输入密码' }]
      }

    }
  },
  mounted() {
    this.$refs['bindForm'].resetFields()
  },
  methods: {
    // 手机号短信登录
    bindUser() {
      const _this = this
      _this.bindForm.key = getUrlKey('key')

      this.$refs.bindForm.validate(valid => {
        if (valid) {
          this.loading = true
          bindUser(_this.bindForm).then(res => {
            if (res.data.code === 200) {
              this.$notify({
                title: '成功',
                message: '社交账号绑定成功,2秒后返回登录页面',
                type: 'success'
              })
              setTimeout(() => {
                this.$router.push({
                  path: '/login'
                })
              }, 2000)
            }
          }).catch(err => {
            this.loading = false
            console.log(err.data.message)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    jump() {
      this.$router.push({ path: '/login' })
    }
  }
}
</script>

<style scoped lang="scss">
  .login-container {
    width: 500px;
    display: flex;
    border-radius: 5px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 0 25px #cac6c6;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    /*padding: 10px 0;*/

  .login-right {
    width: 100%;
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
  }
  }
</style>
