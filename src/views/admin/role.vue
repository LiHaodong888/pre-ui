<template>

  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container" style="margin: 10px 0 10px 0;">
      <el-row :gutter="10">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-input
              v-model="query.roleName"
              clearable
              class="filter-item"
              style="width: 200px;"
              size="small"
              placeholder="请输入角色名称"
              @keyup.enter.native="handleFind"
            />
          </div>
        </el-col>
        <el-col :span="9">
          <div class="grid-content bg-purple">
            <el-button class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFind">搜索
            </el-button>
            <el-button class="filter-item" size="small" type="primary" icon="el-icon-refresh" @click="handleReset">重置
            </el-button>
            <el-button class="filter-item" size="small" type="primary" icon="el-icon-plus" @click="handleAdd">添加
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-table v-loading="loading" :data="tableData" border style="width: 100%">
      <el-table-column type="selection" />
      <el-table-column label="序号" width="60" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="角色名称" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roleName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="角色标识" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roleCode }}</span>
        </template>
      </el-table-column>

      <el-table-column label="角色介绍" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roleDesc }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="160" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" min-width="150" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="dataRule">

        <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
          <el-input v-model="form.roleName" auto-complete="off" placeholder="请输入角色名称" />
        </el-form-item>

        <el-form-item label="角色标识" :label-width="formLabelWidth" prop="roleCode">
          <el-input v-model="form.roleCode" auto-complete="off" placeholder="请输入角色标识" />
        </el-form-item>

        <el-form-item label="角色介绍" :label-width="formLabelWidth" prop="roleDesc">
          <el-input v-model="form.roleDesc" auto-complete="off" placeholder="请输入角色介绍" />
        </el-form-item>

        <el-form-item label="数据范围" :label-width="formLabelWidth">
          <el-select v-model="form.dsType" placeholder="请选择数据范围" style="width: 100%" @change="changeScope">
            <el-option
              v-for="item in dateScopes"
              :key="item.id"
              :label="item.des"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item v-if="form.dsType === 4" label="数据权限" :label-width="formLabelWidth">
          <treeselect v-model="deptIds" :options="deptData" multiple placeholder="请选择" />
        </el-form-item>

        <el-form-item label="访问菜单" :label-width="formLabelWidth">
          <el-tree
            ref="menuTree"
            v-loading="menuLoading"
            :data="menuData"
            size="mini"
            show-checkbox
            node-key="menuId"
            :props="defaultProps"
            element-loading-text="拼命加载中"
            :check-strictly="true"
            @check-change="handleMenuCheckChange"
          />

          <div style="padding-left:24px;padding-top:12px;">
            <el-checkbox v-model="checkAll" :disabled="false" @change="handleCheckAll"><b>全选</b></el-checkbox>
          </div>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getRoleList, addRole, updateRole, deleteRole, findRoleMenus } from '@/api/roles'
import { getMenus } from '@/api/menu'
import { parseTime } from '@/utils/index'
import { getDeptTree } from '@/api/dept'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  components: {
    Treeselect
  },
  data() {
    return {
      tableData: [],
      keyword: '',
      title: '',
      dialogFormVisible: false, // 控制弹出框
      formLabelWidth: '120px',
      isEditForm: false,
      dateScopes: [{
        id: 1,
        des: '全部'
      },
      {
        id: 2,
        des: '本级'
      },
      {
        id: 3,
        des: '本级以及子级'
      },
      {
        id: 4,
        des: '自定义'
      }
      ],
      deptData: [],
      deptTreeProps: {
        label: 'name',
        children: 'children'
      },
      query: {
        roleName: ''
      },
      form: {
        roleId: 0,
        roleName: '',
        roleCode: '',
        roleDesc: '',
        roleMenus: [],
        dsType: 0,
        deptName: '',
        deptId: 1
      },
      // 分类菜单列表
      menuData: [],
      // tree配置项
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      selectRole: {},
      checkAll: false,
      menuIds: [],
      // 表单校验
      dataRule: {
        roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '角色介绍不能为空', trigger: 'blur' }],
        roleCode: [{ required: true, message: '角色标识不能为空', trigger: 'blur' }]
      },
      loading: false,
      deptIds: []
    }
  },
  created() {
    this.findTreeData()
    this.roleList()
  },
  methods: {
    parseTime,
    // 获取角色
    roleList: function() {
      this.loading = true
      const params = new URLSearchParams()
      params.append('roleName', this.query.roleName)
      getRoleList(params).then(response => {
        this.tableData = response.data.data
        this.loading = false
      })
    },
    // 获取菜单树
    findTreeData: function() {
      this.menuLoading = true
      getMenus().then((res) => {
        this.menuData = res.data.data
        this.menuLoading = false
      })
    },
    // 树节点选择监听
    handleMenuCheckChange(data, check) {
      if (check) {
        // 节点选中时同步选中父节点
        const parentId = data.parentId
        this.$refs.menuTree.setChecked(parentId, true, false)
      } else {
        // 节点取消选中时同步取消选中子节点
        if (data.children != null) {
          data.children.forEach(element => {
            this.$refs.menuTree.setChecked(element.id, false, false)
          })
        }
      }
    },
    // 全选操作
    handleCheckAll() {
      if (this.checkAll) {
        const allMenus = []
        this.checkAllMenu(this.menuData, allMenus)
        this.$refs.menuTree.setCheckedNodes(allMenus)
      } else {
        this.$refs.menuTree.setCheckedNodes([])
      }
    },
    // 递归全选
    checkAllMenu(menuData, allMenus) {
      menuData.forEach(menu => {
        allMenus.push(menu)
        if (menu.children) {
          this.checkAllMenu(menu.children, allMenus)
        }
      })
    },

    handleFind: function() {
      this.roleList()
    },
    handleReset: function() {
      this.query = {
        roleName: ''
      }
      this.roleList()
    },
    // 添加角色
    handleAdd: function() {
      this.dialogFormVisible = true
      this.title = '增加角色'
      this.form = {
        roleId: 0,
        roleName: '',
        roleCode: '',
        roleDesc: '',
        roleMenus: [],
        roleDepts: [],
        // 数据权限类型
        dsType: '',
        deptName: '',
        deptId: 1
      }
      this.isEditForm = false
    },

    // 编辑角色
    handleEdit: function(row) {
      this.dialogFormVisible = true
      this.isEditForm = true
      this.title = '编辑角色'
      this.form = row
      this.handleRoleSelectChange(row.roleId)
      this.deptIds = []
      if (this.form.dsType === 4) {
        this.findDeptTree()
      }
      for (let i = 0; i < this.form.roleDepts.length; i++) {
        this.deptIds[i] = this.form.roleDepts[i]
      }
    },

    // 角色选择改变监听
    handleRoleSelectChange(id) {
      console.log(id)
      this.selectRole.id = id
      findRoleMenus(id).then((res) => {
        this.$refs.menuTree.setCheckedNodes(res.data.data)
      })
    },

    handleDelete: function(row) {
      const that = this
      this.$confirm('此操作将把角色删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteRole(row.roleId).then(response => {
            if (response.data.code === 200) {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              that.roleList()
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
    submitForm: function() {
      if (this.form.dsType === 4 && this.deptIds.length === 0) {
        this.$message({
          message: '自定义数据权限不能为空',
          type: 'warning'
        })
        return
      } else {
        const depts = []
        if (this.form.dsType === 4) {
          for (let i = 0; i < this.deptIds.length; i++) {
            depts.push(
              this.deptIds[i]
            )
          }
          this.form.roleDepts = depts
        }
      }
      const roleId = this.selectRole.id !== '' ? this.selectRole.id : '0'
      const checkedNodes = this.$refs.menuTree.getCheckedNodes(false, true)
      const roleMenus = []
      for (let i = 0, len = checkedNodes.length; i < len; i++) {
        const roleMenu = { roleId: roleId, menuId: checkedNodes[i].menuId }
        roleMenus.push(roleMenu)
      }
      // 得到选中树的角色id和菜单id
      this.form.roleMenus = roleMenus
      // 得到部门ids
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.isEditForm) {
            updateRole(this.form).then(response => {
              if (response.data.code === 200) {
                this.$message({
                  type: 'success',
                  message: '操作成功'
                })
                this.dialogFormVisible = false
                this.roleList()
              } else {
                this.$message({
                  type: 'error',
                  message: response.data
                })
              }
            })
          } else {
            addRole(this.form).then(response => {
              if (response.data.code === 200) {
                this.$message({
                  type: 'success',
                  message: '操作成功'
                })
                this.dialogFormVisible = false
                this.roleList()
              } else {
                this.$message({
                  type: 'error',
                  message: response.data.msg
                })
              }
            })
          }
        }
      })
    },
    // 加载部门列表
    findDeptTree: function() {
      getDeptTree().then((res) => {
        console.log(res)
        this.deptData = res.data.data
      })
    },
    changeScope() {
      this.deptIds = []
      if (this.form.dsType === 4) {
        this.findDeptTree()
      }
    }
  }
}
</script>
