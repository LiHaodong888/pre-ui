<template>
  <el-drawer
    title="字典详情"
    :visible.sync="drawer"
    size="40%"
  >
    <div
      class="head-container"
      :style="{
        padding:'10px',
        background: '#fff',
      }"
    >
      <el-button
        class="filter-item"
        size="small"
        type="primary"
        icon="el-icon-plus"
        @click="handleValueAdd"
      >新增
      </el-button>
      <!--表格渲染-->
      <el-table v-loading="loading" :data="dictDetailData" border style="width: 100%;margin-top: 10px">
        <el-table-column prop="itemText" label="名称" />
        <el-table-column prop="itemValue" label="数据值" />
        <el-table-column label="操作" width="140px" align="center">

          <template slot-scope="scope">
            <el-button slot="reference" type="text" icon="el-icon-edit" @click="handleValueEdit(scope.row)">编辑</el-button>
            <el-popover
              :ref="scope.row.id"
              placement="top"
              width="120"
            >
              <p>确定删除本条数据吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                <el-button :loading="loading" type="text" @click="subDelete(scope.row.id)">确定
                </el-button>
              </div>
              <el-button slot="reference" icon="el-icon-delete" type="text">删除</el-button>
            </el-popover>
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

      <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isValueAdd ? '新增字典详情' : '编辑字典详情'" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="名称" prop="itemText">
            <el-input v-model="form.itemText" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="数据值" prop="itemValue">
            <el-input v-model="form.itemValue" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="form.description" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="是否启用">
            <el-input v-model="form.status" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="dialog = false">取消</el-button>
          <el-button :loading="loading" type="primary" @click="doDetailSubmit">确认</el-button>
        </div>

      </el-dialog>
    </div>
  </el-drawer>
</template>

<script>
import { addDictItem, updateDictItem, queryDictItemList, deleteDictItem } from '@/api/dict'

export default {
  name: 'DictItem',
  data() {
    return {
      drawer: false,
      direction: 'rtl',
      loading: false,
      dictDetailData: [],
      dialog: false,
      form: {
        dictId: '',
        itemText: '',
        itemValue: '',
        description: '',
        status: ''
      },
      isValueAdd: false,
      rules: {
        itemText: [
          { required: true, message: '名称不为空', trigger: 'blur' }
        ],
        itemValue: [
          { required: true, message: '数据值不为空', trigger: 'blur' }
        ]
      },
      dictId: '',
      currentPage: 1,
      pageSize: 10,
      total: 0 // 总数量
    }
  },
  methods: {
    // 添加字典值
    handleValueAdd: function() {
      this.dialog = true
      this.isValueAdd = true
    },
    // 编辑字典值
    handleValueEdit: function(row) {
      this.dialog = true
      this.isValueAdd = false
      this.form = row
      this.form.name = this.dictName
    },
    // 删除操作
    subDelete(val) {
      deleteDictItem(val).then(res => {
        if (res.data.code === 200) {
          this.$message({ message: '删除成功', type: 'success' })
          this.doSubmit(this.dictId)
          this.resetForm('form')
        }
      }).catch(err => {
        console.log(err.response.data.msg)
      })
    },
    // 字典值提交操作
    doDetailSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.isValueAdd) {
            // 新增字典
            addDictItem(this.form).then((res) => {
              if (res.data.code === 200) {
                this.$message({ message: '操作成功', type: 'success' })
              } else {
                this.$message({ message: res.data.msg, type: 'error' })
              }
              this.dialog = false
              this.doSubmit(this.dictId)
              this.resetForm('form')
            })
          } else {
            // 更新字典
            updateDictItem(this.form).then((res) => {
              if (res.data.code === 200) {
                this.$message({ message: '操作成功', type: 'success' })
              } else {
                this.$message({ message: res.data.msg, type: 'error' })
              }
              this.dialog = false
              this.doSubmit(this.dictId)
              this.resetForm('form')
            })
          }
        }
      })
    },
    doSubmit(val) {
      console.log(val)
      this.drawer = true
      if (val) {
        this.dictId = val
        this.form.dictId = this.dictId
        const params = new URLSearchParams()
        params.append('dictId', this.dictId)
        params.append('current', this.currentPage)
        params.append('size', this.pageSize)
        queryDictItemList(params).then(res => {
          console.log(res)
          this.dictDetailData = res.data.data.records
        })
      }
    },
    // 换页
    handleCurrentChange: function(val) {
      this.currentPage = val
      this.doSubmit(this.dictId)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>

</style>
