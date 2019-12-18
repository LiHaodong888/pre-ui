<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <el-table v-loading="loading" :data="tableData" border style="width: 100%">
      <el-table-column type="selection" />

      <el-table-column label="序号" width="60" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="所属库" width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tableSchema }}</span>
        </template>
      </el-table-column>

      <el-table-column label="表名称" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tableName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="表注释" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.comments }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="180" align="center" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" header-align="center" fixed="right" min-width="150" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-view" @click="handleView(scope.row)">表详情</el-button>
          <el-button type="danger" size="small" icon="el-icon-check" @click="handleCodeGen(scope.row)">代码生成</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--表详情dialog-->
    <el-dialog :append-to-body="true" :visible.sync="tableDialog" title="表详情" width="800px" max-height="800px">
      <el-table v-loading="loading" :data="dictDetailData" border style="width: 100%;">
        <el-table-column prop="columnName" label="字段名" />
        <el-table-column prop="dataType" label="数据类型" />
        <el-table-column prop="columnComment" label="备注" />
        <el-table-column prop="characterSetName" label="字符集" />
        <el-table-column prop="columnType" label="列类型" />
      </el-table>
    </el-dialog>

    <!--生成代码dialog-->
    <el-dialog
      :title="'代码生成'"
      width="40%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataForm"
        :model="dataForm"
        :rules="dataRule"
        label-width="100px"
        style="text-align:left;"
        @keyup.enter.native="submitForm()"
      >
        <el-form-item label="数据库">
          <el-input v-model="dataForm.tableSchema" :disabled="true" placeholder="请输入作者" />
        </el-form-item>
        <el-form-item label="表名称">
          <el-input v-model="dataForm.tableName" :disabled="true" placeholder="请输入表名称" />
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="dataForm.author" placeholder="请输入作者,例如小东啊" />
        </el-form-item>
        <el-form-item label="模块名称" prop="moduleName">
          <el-row>
            <el-col :span="22">
              <el-input v-model="dataForm.moduleName" placeholder="请输入模块名称,例如pre-admin" />
            </el-col>
            <el-col :span="2" class="icon-list__tips">
              <el-tooltip placement="top" effect="light" style="padding: 10px;">
                <div slot="content">
                  <p>模块名称说明：</p>
                  <p>1.指项目的多模块项目</p>
                  <p>2.比如本项目 pre下有两个模块pre-admin,pre-common</p>
                  <p>示例：pre-admin</p>
                </div>
                <i class="el-icon-warning" />
              </el-tooltip>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="项目包名称" prop="packageName">
          <el-row>
            <el-col :span="22">
              <el-input v-model="dataForm.packageName" placeholder="请输入项目包名称 例如:com.xd.pre.modules.codegen" />
            </el-col>
            <el-col :span="2" class="icon-list__tips">
              <el-tooltip placement="top" effect="light" style="padding: 10px;">
                <div slot="content">
                  <p>项目包名称说明：</p>
                  <p>1.指模块下的包结构</p>
                  <p>2.比如com.xd.pre.modules.codegen</p>
                </div>
                <i class="el-icon-warning" />
              </el-tooltip>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="editLoading" @click="codegen">生成</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getTableList, getTableColumnList, codegen } from '@/api/codegen'
import { formatData } from '@/utils/webUtils'

export default {
  data() {
    return {
      // 日志列表
      tableData: [],
      dictDetailData: [],
      keyword: '',
      dialog: false,
      loading: false,
      tableDialog: false,
      dialogVisible: false,
      editLoading: false,
      dataForm: {
        tableSchema: '',
        tableName: '',
        author: '',
        moduleName: '',
        packageName: ''
      },
      dataRule: {
        author: [
          { required: true, message: '作者不能为空', trigger: 'blur' }
        ],
        moduleName: [
          { required: true, message: '模块名称不能为空', trigger: 'blur' }
        ],
        packageName: [
          { required: true, message: '项目包名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.dataList()
  },
  methods: {
    dataList: function() {
      this.loading = true
      const params = new URLSearchParams()
      params.append('tableSchema', 'pre')
      getTableList(params).then(response => {
        console.log(response.data.data)
        this.loading = false
        this.tableData = response.data.data
      })
    },
    // 搜索
    handleFind: function() {
      this.dataList()
    },

    // 查看
    handleView(row) {
      if (row) {
        this.tableDialog = true
        const params = new URLSearchParams()
        params.append('tableName', row.tableName)
        params.append('tableSchema', row.tableSchema)
        getTableColumnList(params).then(res => {
          this.dictDetailData = res.data.data
        })
      }
    },
    // 代码生成
    handleCodeGen(row) {
      if (row) {
        this.dialogVisible = true
        this.dataForm = row
      }
    },
    codegen() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            codegen(this.dataForm).then((res) => {
              if (res.data.code === 200) {
                this.$message({ message: '操作成功', type: 'success' })
              } else {
                this.$message({ message: res.data.msg, type: 'error' })
              }
              this.editLoading = false
              this.$refs['dataForm'].resetFields()
            })
          })
        }
      })
    }
  }
}
</script>

<style scoped="scoped" lang="scss">
  .uploadImgBody :hover {
    border: dashed 1px #00ccff;
  }
</style>
