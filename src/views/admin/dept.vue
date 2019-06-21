<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container" style="margin: 10px 0 10px 0;">
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-plus" @click="handleAdd">添加部门</el-button>
      <el-tag>{{ defaultExpandAll ? '折叠' : '展开' }}</el-tag>
      <el-switch
        v-model="defaultExpandAll"
        active-color="#13ce66"
        inactive-color="#ff4949"
      />
    </div>
    <!--表格树内容栏-->
    <tree-table :key="key" :default-expand-all="defaultExpandAll" :data="tableTreeData" :columns="columns" size="small">

      <template slot="createTime" slot-scope="{scope}">
        <span>{{ parseTime(scope.row.createTime) }}</span>
      </template>
      <template slot="operation" slot-scope="{scope}">
        <el-button size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
        <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </tree-table>

    <!-- 新增修改界面 -->
    <el-dialog
      :title="!dataForm.deptId ? '新增部门' : '修改部门'"
      width="40%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataForm"
        :model="dataForm"
        :rules="dataRule"
        label-width="80px"
        :size="size"
        style="text-align:left;"
        @keyup.enter.native="submitForm()"
      >
        <el-form-item label="机构名称" prop="name">
          <el-input v-model="dataForm.name" placeholder="请输入机构名称" />
        </el-form-item>
        <el-form-item label="上级机构" prop="parentName">
          <popup-tree-input
            :data="popupTreeData"
            :props="popupTreeProps"
            :prop="dataForm.parentName == null?'顶级菜单':dataForm.parentName"
            :node-key="''+dataForm.parentId"
            :current-change-handle="handleTreeSelectChange"
          />
        </el-form-item>
        <el-form-item v-if="dataForm.type !== 2" label="排序编号" prop="sort">
          <el-input-number v-model="dataForm.sort" controls-position="right" :min="0" label="排序编号" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :size="size" @click="dialogVisible = false">取消</el-button>
        <el-button :size="size" type="primary" :loading="editLoading" @click="submitEditForm">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import PopupTreeInput from '@/components/PopupTreeInput'
import treeTable from '@/components/TreeTable'
import { saveDept, getDept, updateDept, deleteDept } from '@/api/dept'
import { parseTime } from '@/utils/index'

export default {
  components: { PopupTreeInput, treeTable },
  data() {
    return {
      size: 'small',
      tableData: [],
      title: '增加分类',
      dialogFormVisible: false, // 控制弹出框
      formLabelWidth: '120px',
      isEditForm: false,
      loading: false,
      dialogVisible: false,
      defaultExpandAll: true,
      key: 1,
      columns: [
        {
          label: '机构名称',
          key: 'name',
          expand: true
        },
        {
          label: '上级机构',
          key: 'parentName',
          width: 200,
          align: 'center'
        },
        {
          label: '排序',
          key: 'sort',
          align: 'center'
        },
        {
          label: '创建时间',
          key: 'createTime',
          align: 'center'
        },
        {
          label: '操作',
          key: 'operation'
        }
      ],
      dataForm: {
        deptId: 0,
        name: '',
        parentId: 0,
        parentName: '',
        sort: 0
      },
      tableTreeData: [],
      // 表单校验
      dataRule: {
        name: [
          { required: true, message: '机构名称不能为空', trigger: 'blur' }
        ],
        parentName: [
          { required: true, message: '上级机构不能为空', trigger: 'change' }
        ]
      },
      popupTreeData: [],
      popupTreeProps: {
        label: 'name',
        children: 'children'
      },
      editLoading: false
    }
  },
  created() {
    this.findTreeData()
  },
  methods: {
    parseTime,
    handleFind: function() {
      this.findTreeData()
    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true
      this.dataForm = {
        deptId: 0,
        name: '',
        parentId: 0,
        parentName: '',
        sort: 0
      }
    },
    // 编辑界面
    handleEdit: function(row) {
      this.isEditForm = true
      this.dialogVisible = true
      this.dataForm.deptId = row.deptId
      this.dataForm.name = row.name
      this.dataForm.parentId = row.parentId
      this.dataForm.sort = row.sort
      this.dataForm.parentName = row.parentName
    },

    // 获取数据
    findTreeData: function() {
      this.loading = true
      getDept().then(res => {
        this.tableTreeData = res.data.data
        this.popupTreeData = this.getParentMenuTree(res.data.data)
        this.loading = false
      })
    },
    // 获取上级机构树
    getParentMenuTree: function(tableTreeDdata) {
      const parent = {
        parentId: 0,
        name: '顶级菜单',
        children: tableTreeDdata
      }
      return [parent]
    },
    // 机构树选中
    handleTreeSelectChange(data) {
      this.dataForm.parentId = data.deptId
      this.dataForm.parentName = data.name
    },

    // 图标选中
    iconActiveHandle(iconName) {
      this.dataForm.icon = iconName
    },

    // 删除
    handleDelete: function(row) {
      const that = this
      this.$confirm('此操作将把分类删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteDept(row.deptId).then(response => {
            if (response.data.code === 200) {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              that.findTreeData()
            } else {
              this.$message({ message: res.data.msg, type: 'error' })
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

    submitEditForm: function() {
      if (this.isEditForm) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true
              updateDept(this.dataForm).then((res) => {
                if (res.data.code === 200) {
                  this.$message({ message: '操作成功', type: 'success' })
                } else {
                  this.$message({ message: res.data.msg, type: 'error' })
                }
                this.editLoading = false
                this.$refs['dataForm'].resetFields()
                this.dialogVisible = false
                this.findTreeData()
              })
            })
          }
        })
      } else {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true
              saveDept(this.dataForm).then((res) => {
                if (res.data.code === 200) {
                  this.$message({ message: '操作成功', type: 'success' })
                } else {
                  this.$message({ message: res.data.msg, type: 'error' })
                }
                this.editLoading = false
                this.$refs['dataForm'].resetFields()
                this.dialogVisible = false
                this.findTreeData()
              })
            })
          }
        })
      }
    }
  }
}
</script>
