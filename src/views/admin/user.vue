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
          :expand-on-click-node="false"
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
            placeholder="请输入用户名"
            @keyup.enter.native="handleFind"
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
              <el-tag v-for="item in scope.row.roleList" :key="item.roleId" type="success" style="margin-right: 5px;">
                {{ item.roleName }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="状态" width="70" align="center">
            <template slot-scope="scope">
              <div v-for="item in dicts" :key="item.id">
                <el-tag v-if="scope.row.lockFlag.toString() === item.value" :type="scope.row.lockFlag ? '' : 'info'">{{
                  item.label }}
                </el-tag>
              </div>
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
        <el-dialog :title="operation?'新增用户':'编辑用户'" :visible.sync="dialogFormVisible" center>
          <el-form :model="dataForm" label-width="80px" size="small" label-position="right">

            <el-form-item label="用户名" :label-width="formLabelWidth" required>
              <el-input v-model="dataForm.username" auto-complete="off" placeholder="请输入用户名" />
            </el-form-item>

            <el-form-item label="邮箱" :label-width="formLabelWidth">
              <el-input v-model="dataForm.email" auto-complete="off" placeholder="请输入邮箱" />
            </el-form-item>

            <el-form-item label="手机" :label-width="formLabelWidth">
              <el-input v-model="dataForm.phone" auto-complete="off" placeholder="请输入手机" />
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
              <el-select v-model="dataForm.jobId" placeholder="请先选择部门" style="width: 100%">
                <el-option
                  v-for="(item,index) in jobs"
                  :key="''+ index"
                  :label="item.jobName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="角色" prop="userRoles" label-width="120px">
              <el-select v-model="dataForm.roleList" multiple placeholder="请选择" style="width: 100%;">
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
import initDict from '@/mixins/initDict'

export default {
  components: {
    PopupTreeInput
  },
  mixins: [initDict],
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
        jobId: 0,
        email: 'lihaodongmail@163.com',
        phone: '17521296869',
        lockFlag: '' + 0,
        roleList: []
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
    // 加载数据字典
    this.getDict('user_status')
  },
  methods: {
    // 加载用户角色信息
    findUserRoles: function() {
      const params = new URLSearchParams()
      params.append('roleName', '')
      getRoleList(params).then((res) => {
        this.roles = res.data.data
      })
    },
    // 加载部门列表
    findDeptTree: function() {
      getDept().then((res) => {
        this.deptData = res.data.data
      })
    },
    // 部门菜单树选中
    deptTreeCurrentChangeHandle(data) {
      this.dataForm.deptId = data.deptId
      this.dataForm.deptName = data.name
      this.getJobs(data.deptId)
    },
    // 加载岗位列表
    getJobs(id) {
      getJobListByDeptId(id).then(res => {
        this.jobs = res.data.data
      })
    },
    // 加载用户列表
    adminList: function() {
      this.loading = true
      const params = new URLSearchParams()
      params.append('current', this.currentPage)
      params.append('size', this.pageSize)
      params.append('deptId', this.deptId)
      params.append('username', this.keyword)
      getUserList(params).then(response => {
        this.loading = false
        this.tableData = response.data.data.records
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
        roleList: []
      }
    },
    // 编辑
    handleEdit: function(row) {
      this.dialogFormVisible = true
      this.operation = false
      // this.dataForm = row
      this.dataForm = Object.assign({}, row)
      this.dataForm.jobId = row.jobId
      // this.getJobs(this.dataForm.jobId)
      // this.getJobs(row.jobId)
      // 设置选择的角色列表
      const userRoles = []
      for (let i = 0, len = row.roleList.length; i < len; i++) {
        userRoles.push(row.roleList[i].roleId)
      }
      this.dataForm.roleList = userRoles
    },

    // 密码重置 todo
    handRest: function(row) {
      const that = this
      this.$confirm('此操作将会将该用户密码重置, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          restPass(row.userId).then(response => {
            if (response.data.code === 200) {
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
    // 删除用户
    handleDelete: function(row) {
      const that = this
      this.$confirm('此操作将该管理员删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteUser(row.userId).then(response => {
            if (response.data.code === 200) {
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

    handleNodeClick(data) {
      this.deptId = data.deptId === 0 ? 0 : data.deptId
      this.adminList()
    },
    submitForm: function() {
      const userRoles = []
      for (let i = 0, len = this.dataForm.roleList.length; i < len; i++) {
        userRoles.push(this.dataForm.roleList[i])
      }
      this.dataForm.roleList = userRoles
      if (!this.operation) {
        // 编辑用户
        editUser(this.dataForm).then(response => {
          if (response.data.code === 200) {
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
        // 添加用户
        addUser(this.dataForm).then(response => {
          if (response.data.code === 200) {
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
</style>
