<template>
  <div class="app-container">

    <div class="head-container">
      <!-- 搜索 -->
      <el-input
        v-model="query.value"
        clearable
        placeholder="输入搜索内容"
        style="width: 200px;"
        class="filter-item"
      />
      <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
        <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="handleAdd"
      >新增
      </el-button>
    </div>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column :show-overflow-tooltip="true" prop="name" label="名称" />
      <el-table-column :show-overflow-tooltip="true" prop="description" label="描述" />
      <el-table-column :show-overflow-tooltip="true" prop="remark" label="备注" />
      <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建时间" />

      <el-table-column label="操作" width="250" align="center">
        <template slot-scope="scope">
          <el-button slot="reference" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
          <el-popover
            :ref="scope.row.name"
            placement="top"
            width="180"
          >
            <p>此操作将删除字典与对应的字典详情，确定要删除吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.name].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.name)">确定
              </el-button>
            </div>
            <el-button slot="reference" type="danger" size="mini">删除</el-button>
          </el-popover>
          <el-button slot="reference" type="primary" size="mini" @click="handleChange(scope.row.name)">字典值</el-button>
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

    <el-dialog :append-to-body="true" :visible.sync="qqdialog" title="字典详情" width="800px">
      <div slot="header" class="clearfix">
        <!--<span>字典详情-->
        <!--<span style="color: #317EF3">-->
        <!--{{form.name}}-->
        <!--</span>-->
        <!--</span>-->
      </div>
      <el-button
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="handleValueAdd"
      >新增
      </el-button>
      <!--</div>-->
      <div>
        <!--表格渲染-->
        <el-table v-loading="loading" :data="dictDetailData" size="small" style="width: 100%;">
          <el-table-column prop="label" label="字典标签" />
          <el-table-column prop="value" label="字典值" />
          <el-table-column prop="sort" label="排序" />
          <el-table-column label="操作" width="140px" align="center">

            <template slot-scope="scope">
              <el-button slot="reference" size="mini" @click="handleValueEdit(scope.row)">编辑</el-button>
              <el-popover
                :ref="scope.row.id"
                placement="top"
                width="120"
              >
                <p>确定删除本条数据吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                  <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定
                  </el-button>
                </div>
                <el-button slot="reference" type="danger" size="mini">删除</el-button>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <!--<div class="block">-->
        <!--<el-pagination-->
        <!--:current-page.sync="dcurrentPage"-->
        <!--:page-size="dpageSize"-->
        <!--layout="total, prev, pager, next, jumper"-->
        <!--:total="total"-->
        <!--@current-change="handleCurrentChange"-->
        <!--/>-->
        <!--</div>-->
      </div>
    </el-dialog>

    <!--</el-col>-->
    <!--</el-row>-->

    <!--新增-->
    <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增字典' : '编辑字典'" width="500px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="字典名称" prop="name">
          <el-input v-model="form.name" style="width: 370px;" placeholder="请输入字典名称" />
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

    <el-dialog :append-to-body="true" :visible.sync="ddialog" :title="isValueAdd ? '新增字典详情' : '编辑字典详情'" width="500px">
      <el-form ref="form" :model="form" :rules="drules" size="small" label-width="80px">
        <el-form-item label="字典标签" prop="label">
          <el-input v-model="form.label" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="字典值" prop="value">
          <el-input v-model="form.value" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model.number="form.sort" :min="0" :max="999" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="ddialog = false">取消</el-button>
        <el-button :loading="dloading" type="primary" @click="doDetailSubmit">确认</el-button>
      </div>

    </el-dialog>
  </div>

</template>

<script>
import { saveDict, getDict, updateDict, deleteDict, getDictDetail, deleteDictByName } from '@/api/dict'
import { deepClone, parseTime } from '@/utils/index'

export default {
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
        name: '',
        label: '',
        value: '',
        sort: '',
        description: '',
        remark: ''
      },
      currentPage: 1,
      pageSize: 10,
      total: 0, // 总数量
      dcurrentPage: 1,
      dpageSize: 10,
      dtotal: 0,
      // 名称
      dictName: '',
      delLoading: false,
      rules: {
        name: [
          { required: true, message: '字典名称不为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '描述不为空', trigger: 'blur' }
        ]
      },
      drules: {
        label: [
          { required: true, message: '字典标签不为空', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '字典值不为空', trigger: 'blur' }
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
    // 获取字典详情
    getDictData: function() {
      this.loading = true
      const params = new URLSearchParams()
      params.append('page', this.currentPage)
      params.append('pageSize', this.pageSize)
      getDict(params).then(res => {
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
    // 字典值提交操作
    doDetailSubmit() {
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
              this.ddialog = false
              this.handleChange(this.dictName)
            })
          } else {
            // 更新字典
            updateDict(this.form).then((res) => {
              if (res.data.code === 200) {
                this.$message({ message: '操作成功', type: 'success' })
              } else {
                this.$message({ message: res.data.msg, type: 'error' })
              }
              this.ddialog = false
              this.handleChange(this.dictName)
            })
          }
        }
      })
    },

    // 添加字典
    handleAdd: function() {
      this.dialog = true
      this.isAdd = true
      this.form = {
        id: 0,
        name: '',
        remark: ''
      }
    },
    // 编辑字典
    handleEdit: function(row) {
      this.dialog = true
      this.isAdd = false
      this.form = row
    },

    // 添加字典值
    handleValueAdd: function() {
      this.ddialog = true
      this.isAdd = true
      this.form = {
        name: this.dictName,
        label: '',
        value: '',
        sort: ''
      }
    },
    // 编辑字典值
    handleValueEdit: function(row) {
      this.ddialog = true
      this.isValueAdd = false
      this.form = row
      this.form.name = this.dictName
    },

    // 删除操作
    subDelete(val) {
      if (this.qqdialog) {
        deleteDict(val).then(res => {
          if (res.data.code === 200) {
            this.delLoading = false
            this.handleChange(this.dictName)
            this.$notify({
              title: '删除成功',
              type: 'success',
              duration: 2500
            })
          } else {
            this.$notify({
              title: res.data.msg,
              type: 'error',
              duration: 2500
            })
          }
        }).catch(err => {
          this.delLoading = false
          console.log(err.response.data.message)
        })
      } else {
        this.delLoading = true
        deleteDictByName(val).then(res => {
          if (res.data.code === 200) {
            this.delLoading = false
            this.$notify({
              title: '删除成功',
              type: 'success',
              duration: 2500
            })
            this.getDictData()
          } else {
            this.$notify({
              title: res.data.msg,
              type: 'error',
              duration: 2500
            })
          }
        }).catch(err => {
          this.delLoading = false
          console.log(err.response.data.message)
        })
      }
    },
    // 换页
    handleCurrentChange: function(val) {
      this.currentPage = val
      this.getDictData()
    },
    handleChange(val) {
      if (val) {
        this.qqdialog = true
        const params = new URLSearchParams()
        params.append('name', val)
        this.dictName = val
        getDictDetail(params).then(res => {
          this.dictDetailData = res.data.data
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
