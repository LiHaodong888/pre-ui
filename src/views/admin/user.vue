<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="4" :lg="4" :xl="4">
        <div class="head-container">
          <el-input
            v-model="filterText"
            placeholder="输入部门名称搜索"
            size="small"
            prefix-icon="el-icon-search"
            class="filter-item"
            style="margin-bottom: 20px"
          />
        </div>
        <el-tree
          :data="deptData"
          :props="deptTreeProps"
          default-expand-all
          @node-click="handleNodeClick"
        />
      </el-col>
      <el-col :xs="24" :sm="24" :md="20" :lg="20" :xl="20">
        <!-- 查询和其他操作 -->
        <div class="filter-container">
          <el-input
            v-model="keyword"
            clearable
            size="small"
            class="filter-item"
            style="width: 200px;"
            placeholder="请输入管理员名"
          />
          <el-button class="filter-item" type="primary" icon="el-icon-search" size="mini" @click="handleFind">查找
          </el-button>
          <el-button class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="handleAdd">添加
          </el-button>
        </div>

        <el-table v-loading="loading" :data="tableData" style="width: 100%" size="mini">
          <el-table-column label="序号" width="60" align="center">
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>

          <el-table-column label="用户名" width="80" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.username }}</span>
            </template>
          </el-table-column>

          <el-table-column label="手机号" width="100" align="center" sortable>
            <template slot-scope="scope">
              <span>{{ scope.row.phone }}</span>
            </template>
          </el-table-column>

          <el-table-column label="邮箱" width="160" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.email }}</span>
            </template>
          </el-table-column>

          <el-table-column label="部门 / 岗位" width="130" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.deptName }} / {{ scope.row.jobName }}</div>
            </template>
          </el-table-column>

          <el-table-column label="拥有角色" width="200" align="center">
            <template slot-scope="scope">
              <el-tag v-for="item in scope.row.userRoles" :key="item.roleId" type="success" style="margin-right: 5px;">
                {{ item.roleName }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="状态" width="70" align="center">
            <template slot-scope="scope">
              <template v-if="scope.row.lockFlag == 0">
                <el-tag>正常</el-tag>
              </template>
              <template v-if="scope.row.lockFlag == 9">
                <el-tag type="danger">锁定</el-tag>
              </template>
            </template>
          </el-table-column>

          <el-table-column label="操作" fixed="right" min-width="120" align="center">
            <template slot-scope="scope">
              <!--<el-button @click="handRest(scope.row)" type="warning" size="small">重置密码</el-button>-->
              <el-button size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
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

        <!-- 添加或修改对话框 -->
        <el-dialog :title="operation?'新增':'编辑'" :visible.sync="dialogFormVisible" center>
          <el-form :model="dataForm" label-width="80px" size="small" label-position="right">

            <el-form-item label="用户名" :label-width="formLabelWidth" required>
              <el-input v-model="dataForm.username" auto-complete="off" />
            </el-form-item>

            <el-form-item label="邮箱" :label-width="formLabelWidth">
              <el-input v-model="dataForm.email" auto-complete="off" />
            </el-form-item>

            <el-form-item label="手机" :label-width="formLabelWidth">
              <el-input v-model="dataForm.phone" auto-complete="off" />
            </el-form-item>

            <el-form-item label="部门" :label-width="formLabelWidth">
              <popup-tree-input
                :data="deptData"
                :props="deptTreeProps"
                :prop="dataForm.deptName"
                :node-key="''+dataForm.deptId"
                :current-change-handle="deptTreeCurrentChangeHandle"
              />
            </el-form-item>

            <el-form-item label="岗位" :label-width="formLabelWidth">
              <el-select v-model="dataForm.jobId" placeholder="请先选择部门">
                <el-option
                  v-for="item in jobs"
                  :key="item.id"
                  :label="item.jobName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="角色" prop="userRoles" label-width="120px">
              <el-select v-model="dataForm.userRoles" multiple placeholder="请选择" style="width: 100%;">
                <el-option
                  v-for="item in roles"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.roleId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="lockFlag" label-width="120px">
              <el-switch
                v-model="dataForm.lockFlag"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="正常"
                active-value="0"
                inactive-text="锁定"
                inactive-value="9"
              />
            </el-form-item>

          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm">确 定</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { addUser, getUserList, editUser, deleteUser, restPass } from '@/api/user'
import { getJobListByDeptId } from '@/api/job'
import { getRoleList } from '@/api/roles'
import { getDept } from '@/api/dept'
import { formatData } from '@/utils/webUtils'
import PopupTreeInput from '@/components/PopupTreeInput'

export default {
  components: {
    PopupTreeInput
  },
  data() {
    return {
      // 用户列表
      tableData: [],
      roles: [], // 角色列表
      jobs: [], // 岗位列表
      operation: false, // true:新增, false:编辑
      keyword: '',
      currentPage: 1,
      pageSize: 10,
      total: 0, // 总数量
      deptId: 0,
      dialogFormVisible: false, // 控制弹出框
      formLabelWidth: '120px',
      dataForm: {
        username: '',
        avatar: '',
        deptId: 1,
        deptName: '',
        jobId: '',
        email: 'lihaodongmail@163.com',
        phone: '17521296869',
        lockFlag: '' + 0,
        userRoles: []
      },
      deptData: [],
      deptTreeProps: {
        label: 'name',
        children: 'children'
      },
      value5: '100',
      filterText: '',
      loading: false,
      jobName: ''

    }
  },
  created() {
    this.adminList()
    this.findUserRoles()
    this.findDeptTree()
  },
  methods: {
    // 加载用户角色信息
    findUserRoles: function() {
      getRoleList().then((res) => {
        this.roles = res.data.data
      })
    },
    // 加载部门列表
    findDeptTree: function() {
      getDept().then((res) => {
        if (res.data.code == 200) {
          this.deptData = res.data.data
        }
      })
    },
    // 部门菜单树选中
    deptTreeCurrentChangeHandle(data, node) {
      this.dataForm.deptId = data.deptId
      this.dataForm.deptName = data.name
      this.getJobs(data.deptId)
    },
    // 加载岗位列表
    getJobs(id) {
      getJobListByDeptId(id).then(res => {
        if (res.data.code == 200) {
          this.jobs = res.data.data
        }
      })
    },

    adminList: function() {
      this.loading = true
      const params = new URLSearchParams()
      params.append('page', this.currentPage)
      params.append('pageSize', this.pageSize)
      params.append('deptId', this.deptId)
      getUserList(params).then(response => {
        console.log(response)
        this.loading = false
        this.tableData = response.data.data.userList
        this.total = response.data.data.total
      })
    },
    handleFind: function() {
      this.adminList()
    },
    // 添加
    handleAdd: function() {
      this.dialogFormVisible = true
      this.operation = true
      this.dataForm = {
        username: '',
        deptId: 1,
        deptName: '',
        jobId: '',
        email: 'lihaodongmail@163.com',
        phone: '17521296869',
        lockFlag: '' + 0,
        userRoles: []
      }
    },
    // 编辑
    handleEdit: function(row) {
      this.dialogFormVisible = true
      this.operation = false
      // this.dataForm = row
      this.dataForm = Object.assign({}, row)
      // 设置选择的角色列表
      const userRoles = []
      for (let i = 0, len = row.userRoles.length; i < len; i++) {
        userRoles.push(row.userRoles[i].roleId)
      }
      this.dataForm.userRoles = userRoles
    },

    handRest: function(row) {
      const that = this
      this.$confirm('此操作将会将该用户密码重置, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          restPass(row.userId).then(response => {
            if (response.data.code == 200) {
              that.$message({
                type: 'success',
                message: '重置密码成功'
              })
            } else {
              that.$message({
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
      this.currentPage = val
      this.adminList()
    },

    filterNode(value, data) {
      console.log(data)
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleNodeClick(data) {
      this.deptId = data.deptId == 0 ? 0 : data.deptId
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
