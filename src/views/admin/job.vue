<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container" style="margin: 10px 0 10px 0;">
      <el-input
        v-model="keyword"
        clearable
        class="filter-item"
        style="width: 200px;"
        size="small"
        placeholder="请输入岗位名称"
        @keyup.enter.native="handleFind"
      />
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="handleFind">查找
      </el-button>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-plus" @click="handleAdd">添加岗位</el-button>
    </div>

    <el-table v-loading="loading" :data="tableData" style="width: 100%" size="mini">

      <el-table-column type="selection" />
      <el-table-column label="序号" width="60" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="岗位名称" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.jobName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="所属部门" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.deptName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="排序" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sort }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="160" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" min-width="150" align="center">
        <template slot-scope="scope">
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
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="dataRule">

        <el-form-item label="岗位名称" :label-width="formLabelWidth" prop="jobName">
          <el-input v-model="form.jobName" auto-complete="off" placeholder="请输入岗位名称" />
        </el-form-item>
        <el-form-item label="所属部门" :label-width="formLabelWidth">
          <popup-tree-input
            :data="deptData"
            :props="deptTreeProps"
            :prop="form.deptName"
            :node-key="''+form.deptId"
            :current-change-handle="deptTreeCurrentChangeHandle"
          />
        </el-form-item>
        <el-form-item label="排序" :label-width="formLabelWidth">
          <el-input-number
            v-model="form.sort"
            controls-position="right"
            :min="0"
            label="排序编号"
          />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getJobList, addJob, updateJob, deleteJob } from '@/api/job'
import PopupTreeInput from '@/components/PopupTreeInput'
import { parseTime } from '@/utils/index'
import { getDept } from '@/api/dept'

export default {
  components: {
    PopupTreeInput
  },
  data() {
    return {
      tableData: [],
      keyword: '',
      title: '',
      dialogFormVisible: false, // 控制弹出框
      formLabelWidth: '120px',
      isEditForm: false,
      currentPage: 1,
      pageSize: 10,
      total: 0, // 总数量
      form: {
        id: 0,
        jobName: '',
        deptId: 1,
        sort: 0,
        deptName: ''
      },
      // 分类菜单列表
      deptData: [],
      // tree配置项
      deptTreeProps: {
        label: 'name',
        children: 'children'
      },
      // 表单校验
      dataRule: {
        jobName: [{ required: true, message: '岗位名称不能为空', trigger: 'blur' }]
      },
      loading: false
    }
  },
  created() {
    this.getJobList()
    this.findDeptTree()
  },
  methods: {
    parseTime,
    getJobList: function() {
      this.loading = true
      const params = new URLSearchParams()
      params.append('page', this.currentPage)
      params.append('pageSize', this.pageSize)
      params.append('jobName', this.keyword)
      getJobList(params).then(response => {
        this.loading = false
        this.tableData = response.data.data.records
        this.total = response.data.data.total
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
      this.form.deptId = data.deptId
      this.form.deptName = data.name
    },
    // 查找
    handleFind: function() {
      this.getJobList()
    },
    // 换页
    handleCurrentChange: function(val) {
      this.currentPage = val
      this.getJobList()
    },
    // 添加岗位
    handleAdd: function() {
      this.dialogFormVisible = true
      this.title = '增加岗位'
      this.form = {
        id: 0,
        jobName: '',
        deptId: 1,
        sort: 0,
        deptName: ''
      }
      this.isEditForm = false
    },

    // 编辑角色
    handleEdit: function(row) {
      this.dialogFormVisible = true
      this.isEditForm = true
      this.title = '编辑岗位'
      this.form = row
    },

    handleDelete: function(row) {
      const that = this
      this.$confirm('此操作将把角色删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteJob(row.id).then(response => {
            if (response.data.code === 200) {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              that.getJobList()
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
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.isEditForm) {
            updateJob(this.form).then(response => {
              if (response.data.code === 200) {
                this.$message({
                  type: 'success',
                  message: '操作成功'
                })
                this.dialogFormVisible = false
                this.getJobList()
              } else {
                this.$message({
                  type: 'error',
                  message: response.data
                })
              }
            })
          } else {
            addJob(this.form).then(response => {
              if (response.data.code === 200) {
                this.$message({
                  type: 'success',
                  message: '操作成功'
                })
                this.dialogFormVisible = false
                this.getJobList()
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
    }
  }
}
</script>
