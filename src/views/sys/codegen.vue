<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container" style="margin: 10px 0 10px 0;">
      <el-select v-model="value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-input
        v-model="keyword"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入管理员名"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" size="mini" @click="handleFind">查找</el-button>
      <el-button class="filter-item" type="primary" size="mini" icon="el-icon-edit" @click="dialogTableVisible = true">维护数据源</el-button>
    </div>

    <el-table :data="tableData" border style="width: 100%" size="mini">
      <el-table-column type="selection" />

      <el-table-column label="序号" width="60" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="库名称" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tableSchema }}</span>
        </template>
      </el-table-column>

      <el-table-column label="表名称" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tableName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="表注释" width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tableComment }}</span>
        </template>
      </el-table-column>

      <el-table-column label="表引擎" width="100" align="center" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.tableEngine }}</span>
        </template>
      </el-table-column>
      <el-table-column label="表字符集" width="100" align="center" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.tableCollation }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160" align="center" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" min-width="150" align="center">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <div class="block">
      <el-pagination
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog title="数据源" width="60%" :visible.sync="dialogTableVisible">
      <el-button type="primary" icon="el-icon-plus" plain @click="handleAdd">新增</el-button>
      <el-table border size="medium" :data="gridData" label-width="170px">
        <el-table-column property="dbType" label="类型" width="150" />
        <el-table-column property="host" label="主机" width="150" />
        <el-table-column property="port" label="端口号" />
        <el-table-column property="username" label="用户名" />
        <el-table-column property="password" label="密码" />
        <el-table-column property="dbName" label="数据库" />
        <el-table-column property="dbName" label="创建时间" />
        <el-table-column label="操作" fixed="right" min-width="150" align="center">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!--数据源配置界面-->
    <el-dialog title="添加" width="40%" :visible.sync="visible" size="small" top="5vh">
      <el-form ref="form" :model="form" label-width="80px" size="small">
        <el-form-item label="类型">
          <el-select v-model="form.dbType" placeholder="请选择数据库类型" style="width: 100%;">
            <el-option label="MySQL" value="MySQL" />
            <el-option label="Oracle" value="Oracle" />
          </el-select>
        </el-form-item>
        <el-form-item label="主机">
          <el-input v-model="form.host" />
        </el-form-item>
        <el-form-item label="端口">
          <el-input v-model="form.port" type="number" />
        </el-form-item>
        <el-form-item label="用户">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" />
        </el-form-item>
        <el-form-item label="数据库">
          <el-input v-model="form.dbName" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="visible = false">取消</el-button>
        <el-button size="small" type="primary" :loading="testLoading" @click="testConn">测试</el-button>
        <el-button size="small" type="primary" :loading="saveLoading" @click="saveConfig">保存</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getTable, testConnection, saveDb, getDbList, deleteDbList } from '@/api/code'
import { formatData } from '@/utils/webUtils'

export default {

  data() {
    return {
      // 用户列表
      tableData: [],
      roles: [], // 角色列表
      currentPage: 1,
      pageSize: 10,
      total: 0, // 总数量
      formLabelWidth: '120px',
      dialogTableVisible: false,
      visible: false,
      testLoading: false,
      saveLoading: false,
      keyword: '',
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: '',
      gridData: [],
      form: {
        dbType: 'MySQL',
        host: '127.0.0.1',
        port: 3306,
        username: 'root',
        password: '123456',
        dbName: 'kitty'
      }
    }
  },
  created() {
    this.adminList()
    this.getDbList()
  },
  methods: {

    adminList: function() {
      const params = new URLSearchParams()
      params.append('page', this.currentPage)
      params.append('pageSize', this.pageSize)
      getTable().then(response => {
        this.tableData = response.data.data
      })
    },

    getDbList: function() {
      getDbList().then(response => {
        this.gridData = response.data.data
      })
    },
    handleFind: function() {
      this.adminList()
    },
    // 添加
    handleAdd: function() {
      this.visible = true
      this.form = {
        dbType: 'MySQL',
        host: '127.0.0.1',
        port: 3306,
        username: 'root',
        password: 'root',
        dbName: 'pre'
      }
    },
    // 测试连接
    testConn: function() {
      this.testLoading = true
      testConnection(this.form).then((res) => {
        if (res.data.code == 200) {
          this.$message({ message: '测试连接成功', type: 'success' })
        } else {
          this.$message({ message: res.data.msg, type: 'error' })
        }
        this.testLoading = false
      })
    },
    // 保存配置
    saveConfig: function() {
      this.saveLoading = true
      saveDb(this.form).then((res) => {
        if (res.data.code == 200) {
          this.$message({ message: '保存成功', type: 'success' })
          this.visible = false
          this.getDbList()
        } else {
          this.$message({ message: '保存失败, ' + res.msg, type: 'error' })
        }
        this.saveLoading = false
      })
    },
    handleDelete: function(row) {
      const that = this
      this.$confirm('此操作将该管理员删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteUser(row.userId).then(response => {
            if (response.data.code == 200) {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              that.adminList()
            } else {
              this.$message({
                type: 'error',
                message: response.data.msg
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleCurrentChange: function(val) {
      console.log('点击了换页')
      this.currentPage = val
      this.adminList()
    },

    submitForm: function() {
      const userRoles = []
      for (let i = 0, len = this.dataForm.userRoles.length; i < len; i++) {
        userRoles.push(this.dataForm.userRoles[i])
      }
      this.dataForm.userRoles = userRoles
      if (!this.operation) {
        editUser(this.dataForm).then(response => {
          if (response.data.code == 200) {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.dialogFormVisible = false
            this.adminList()
          } else {
            this.$message({
              type: 'error',
              message: response.data.msg
            })
          }
        })
      } else {
        addUser(this.dataForm).then(response => {
          if (response.data.code == 200) {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.dialogFormVisible = false
            this.adminList()
          } else {
            this.$message({
              type: 'error',
              message: response.data.msg
            })
          }
        })
      }
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    margin: 0, 0, 0, 10px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }

  .imgBody {
    width: 100px;
    height: 100px;
    border: solid 2px #ffffff;
    float: left;
    position: relative;
  }

  .uploadImgBody {
    margin-left: 5px;
    width: 100px;
    height: 100px;
    border: dashed 1px #c0c0c0;
    float: left;
    position: relative;
  }

  .uploadImgBody :hover {
    border: dashed 1px #00ccff;
  }

  .inputClass {
    position: absolute;
  }

  .img {
    width: 100%;
    height: 100%;
  }

  img {
    width: 100px;
    height: 100px;
  }
</style>
