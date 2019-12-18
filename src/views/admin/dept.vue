<template>
  <div class="dept">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="app-container">
          <div class="filter-container">
            <el-button-group>
              <el-button type="primary" plain @click="handleAdd">
                添加
              </el-button>
              <el-button type="primary" plain @click="handleDelete">
                删除
              </el-button>
            </el-button-group>
          </div>
          <el-tree
            :data="tableTreeData"
            :props="popupTreeProps"
            :default-expand-all="true"
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ deptForm.deptId === '' ? '添加' : '编辑' }}</span>
          </div>
          <div>
            <el-form ref="deptForm" :model="deptForm" :rules="dataRule" label-position="right" label-width="100px">
              <el-form-item label="上级编号" prop="parentId">
                <popup-tree-input
                  :data="popupTreeData"
                  :props="popupTreeProps"
                  :prop="deptForm.parentName == null?'顶级菜单':deptForm.parentName"
                  :node-key="''+deptForm.parentId"
                  :current-change-handle="handleTreeSelectChange"
                />
              </el-form-item>
              <el-form-item label="部门名称" prop="name">
                <el-input v-model="deptForm.name" />
              </el-form-item>
              <el-form-item label="排序" prop="sort">
                <el-input-number v-model="deptForm.sort" :min="0" :max="100" @change="handleNumChange" />
              </el-form-item>
            </el-form>
          </div>
        </el-card>
        <el-card class="box-card" style="margin-top: -2rem;">
          <el-row>
            <el-col :span="24" style="text-align: right">
              <el-button type="primary" plain :loading="editLoading" @click="submitEditForm">{{ deptForm.deptId == '' ?
                '添加' : '编辑' }}
              </el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PopupTreeInput from '@/components/PopupTreeInput'
import { saveDept, getDept, updateDept, deleteDept } from '@/api/dept'
import { parseTime } from '@/utils/index'

export default {
  components: { PopupTreeInput },
  data() {
    return {
      deptForm: {
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
      editLoading: false,
      deptName: ''
    }
  },
  created() {
    this.findTreeData()
  },
  methods: {
    parseTime,
    handleNodeClick(data) {
      console.log(data)
      this.deptForm = data
      this.$refs.deptForm.clearValidate()
    },
    handleFind: function() {
      this.findTreeData()
    },
    handleNumChange(val) {
      this.deptForm.sort = val
    },
    // 显示新增界面
    handleAdd: function() {
      if (this.deptForm.deptId === 0) {
        this.$message({
          message: '请先选择一个节点哦',
          type: 'warning'
        })
      } else {
        const parentId = this.deptForm.deptId
        const parentName = this.deptForm.name
        this.deptForm = {
          deptId: 0,
          name: '',
          parentId: parentId,
          parentName: parentName,
          sort: 0
        }
      }
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
      this.deptForm.parentId = data.deptId
      this.deptForm.parentName = data.name
    },
    submitEditForm: function() {
      this.$refs['deptForm'].validate((valid) => {
        if (valid) {
          if (this.deptForm.deptId) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true
              updateDept(this.deptForm).then((res) => {
                if (res.data.code === 200) {
                  this.$message({ message: '操作成功', type: 'success' })
                } else {
                  this.$message({ message: res.data.msg, type: 'error' })
                }
                this.editLoading = false
                this.$refs.deptForm.clearValidate()
                this.findTreeData()
              })
            })
          } else {
            console.log(this.deptForm)
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true
              saveDept(this.deptForm).then((res) => {
                if (res.data.code === 200) {
                  this.$message({ message: '操作成功', type: 'success' })
                } else {
                  this.$message({ message: res.data.msg, type: 'error' })
                }
                this.editLoading = false
                this.$refs.deptForm.clearValidate()
                this.findTreeData()
              })
            })
          }
        }
      })
    },
    // 删除
    handleDelete: function() {
      const that = this
      if (that.deptForm.deptId === 0) {
        this.$message({
          message: '请先选择一个部门哦',
          type: 'warning'
        })
      } else {
        this.$confirm('此操作将把部门删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            deleteDept(this.deptForm.deptId).then(response => {
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
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .dept {
    margin: 10px;

    .app-container {
      margin: 0 0 10px 0 !important;
    }
  }

  .el-card.is-always-shadow {
    box-shadow: none;
  }

  .el-card {
    border-radius: 0;
    border: none;

    .el-card__header {
      padding: 10px 20px !important;
      border-bottom: 1px solid #f1f1f1 !important;
    }
  }
</style>
