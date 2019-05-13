<template>
  <el-tabs v-model="activeName" style="padding-left: 5px;">
    <el-tab-pane label="邮箱配置" name="first">
      <el-form ref="form" :model="form" :rules="rules" style="margin-top: 6px;" size="small" label-width="100px">
        <el-form-item label="发件人邮箱" prop="fromUser">
          <el-input v-model="form.fromUser" style="width: 40%" />
          <span style="color: #C0C0C0;margin-left: 10px;">Sender mailbox</span>
        </el-form-item>
        <el-form-item label="发件用户名" prop="user">
          <el-input v-model="form.user" style="width: 40%;" />
          <span style="color: #C0C0C0;margin-left: 10px;">Sender usernamex</span>
        </el-form-item>
        <el-form-item label="邮箱密码" prop="pass">
          <el-input v-model="form.pass" type="password" style="width: 40%;" />
          <span style="color: #C0C0C0;margin-left: 10px;">email Password</span>
        </el-form-item>
        <el-form-item label="SMTP地址" prop="host">
          <el-input v-model="form.host" style="width: 40%;" />
          <span style="color: #C0C0C0;margin-left: 10px;">SMTP address</span>
        </el-form-item>
        <el-form-item label="SMTP端口" prop="port">
          <el-input v-model="form.port" style="width: 40%;" />
          <span style="color: #C0C0C0;margin-left: 10px;">SMTP port</span>
        </el-form-item>
        <el-button :loading="loading" style="margin-left:5%;" size="medium" type="success" @click="doSubmit">保存配置
        </el-button>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="发送邮件" name="second">
      <div>
        <el-form ref="form" :model="form" :rules="rules" style="margin-top: 6px;" size="small" label-width="100px">
          <el-form-item label="邮件标题" prop="subject">
            <el-input v-model="form.subject" style="width: 40%" />
          </el-form-item>
          <el-form-item
            v-for="(domain, index) in tos"
            :key="domain.key"
            :label="'收件邮箱' + (index === 0 ? '': index)"
          >
            <el-input v-model="domain.value" style="width: 31%" />
            <el-button icon="el-icon-plus" @click="addDomain" />
            <el-button style="margin-left:0px;" icon="el-icon-minus" @click.prevent="removeDomain(domain)" />
          </el-form-item>
          <div ref="editor" class="editor" />
          <el-button :loading="loading" style="margin-left:2%;" size="medium" type="success" @click="doSubmit">发送邮件</el-button>
        </el-form>
      </div>
    </el-tab-pane>
    <el-tab-pane label="使用说明" name="third">
      <Description />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  name: 'Email',
  data() {
    return {
      loading: false,
      form: { id: 1, fromUser: '', user: '', pass: '', host: '', port: '', sslEnable: '',
        subject: '', tos: [], content: '' }
    }
  }
}
</script>

<style scoped>

</style>
