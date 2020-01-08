<template>
  <div class="app-container">

    <div class="head-container" style="margin: 10px 0 10px 0;">
      <!-- 搜索 -->
      <el-input
        v-model="query.value"
        clearable
        placeholder="输入搜索内容"
        style="width: 200px;"
        size="small"
        class="filter-item"
      />
      <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" size="small" style="width: 130px">
        <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-button class="filter-item" size="small" type="primary" icon="el-icon-search" plain>搜索</el-button>
      <el-button
        class="filter-item"
        size="small"
        type="primary"
        icon="el-icon-plus"
        @click="handleAdd"
      >新增
      </el-button>
    </div>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" border style="width: 100%;">

      <el-table-column prop="dictName" label="字典名称" />
      <el-table-column prop="dictCode" label="字典编码" />
      <el-table-column prop="description" :show-overflow-tooltip="true" label="描述" />
      <el-table-column prop="remark" label="备注" />
      <el-table-column prop="createTime" label="创建时间" />

      <el-table-column label="操作" width="250" align="center">
        <template slot-scope="scope">
          <el-button slot="reference" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
          <el-popover
            :ref="scope.row.dictName"
            placement="top"
            width="180"
          >
            <p>此操作将删除字典与对应的字典详情，确定要删除吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.dictName].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定
              </el-button>
            </div>
            <el-button slot="reference" icon="el-icon-delete" type="text">删除</el-button>
          </el-popover>
          <el-button slot="reference" icon="el-icon-s-grid" type="text" @click="a(scope.row.id)">字典值</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <div class="pagination">
      <el-pagination
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
        background
        @current-change="handleCurrentChange"
      />
    </div>

    <!--新增-->
    <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增字典' : '编辑字典'" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="字典名称" prop="dictName">
          <el-input v-model="form.dictName" style="width: 370px;" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="字典编码" prop="dictCode">
          <el-input v-model="form.dictCode" style="width: 370px;" placeholder="请输入字典编码" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" style="width: 370px;" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" style="width: 370px;" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="dialog = false">取消</el-button>
        <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
      </div>
    </el-dialog>

    <dictItem ref="dictItem" />
  </div>

</template>

<script>
import { saveDict, getDict, updateDict, deleteDict } from '@/api/dict'
import dictItem from './dictItem'

export default {
  components: { dictItem },
  data() {
    return {
      data: [],
      dictDetailData: [],
      loading: false,
      dloading: false,
      qqdialog: false,
      dialog: false,
      ddialog: false,
      isAdd: false,
      isValueAdd: false,
      visible: false,
      form: {
        id: '',
        dictName: '',
        dictCode: '',
        description: '',
        remark: ''
      },
      currentPage: 1,
      pageSize: 10,
      total: 0, // 总数量
      // 名称
      dictName: '',
      delLoading: false,
      rules: {
        dictName: [
          { required: true, message: '字典名称不为空', trigger: 'blur' }
        ],
        dictCode: [
          { required: true, message: '字典编码不为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '描述不为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'name', display_name: '字典名称' },
        { key: 'remark', display_name: '描述' }
      ],
      query: {
        type: '',
        value: ''
      }
    }
  },
  created() {
    this.getDictData()
  },
  methods: {

    a: function(val) {
      this.$refs.dictItem.doSubmit(val)
    },
    // 获取字典详情
    getDictData: function() {
      this.loading = true
      const params = new URLSearchParams()
      params.append('current', this.currentPage)
      params.append('size', this.pageSize)
      getDict(params).then(res => {
        console.log(res)
        this.data = res.data.data.records
        this.total = res.data.data.total
        this.loading = false
      })
    },

    // 字典名称提交动作
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.isAdd) {
            // 新增字典
            saveDict(this.form).then((res) => {
              if (res.data.code === 200) {
                this.$message({ message: '操作成功', type: 'success' })
              } else {
                this.$message({ message: res.data.msg, type: 'error' })
              }
              this.dialog = false
              this.getDictData()
              this.$refs['form'].resetFields()
            })
          } else {
            // 更新字典
            updateDict(this.form).then((res) => {
              if (res.data.code === 200) {
                this.$message({ message: '操作成功', type: 'success' })
              } else {
                this.$message({ message: res.data.msg, type: 'error' })
              }
              this.dialog = false
              this.getDictData()
            })
          }
        }
      })
    },
    // 添加字典
    handleAdd: function() {
      this.dialog = true
      this.isAdd = true
      this.form = {}
    },
    // 编辑字典
    handleEdit: function(row) {
      this.dialog = true
      this.isAdd = false
      this.form = row
    },
    // 删除操作
    subDelete(val) {
      deleteDict(val).then(res => {
        if (res.data.code === 200) {
          this.delLoading = false
          this.$message({ message: '删除成功', type: 'success' })
          this.getDictData()
        }
      }).catch(err => {
        this.delLoading = false
        console.log(err.response.data.message)
      })
    },
    // 换页
    handleCurrentChange: function(val) {
      this.currentPage = val
      this.getDictData()
    }
  }
}
</script>

<style scoped>

</style>
