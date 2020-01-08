<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container" style="margin: 10px 0 10px 0;">
      <el-input
        v-model="query.value"
        clearable
        class="filter-item"
        style="width: 200px;"
        size="small"
        placeholder="请输入社交账号名称内容"
        @keyup.enter.native="handleFind"
      />
      <el-select v-model="query.providerId" clearable placeholder="类型" class="filter-item" size="small" style="width: 130px">
        <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="handleFind">查找</el-button>
    </div>

    <el-table v-loading="loading" :data="tableData" style="width: 100%" size="mini">

      <el-table-column type="selection" />
      <el-table-column label="序号" width="60" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="社交账号类型" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.providerId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="社交账号名称" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.displayName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="系统账号名称" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="头像" width="150" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.imageUrl" width="40" height="40" class="head_pic">
        </template>
      </el-table-column>

      <el-table-column label="绑定时间" width="160" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" min-width="150" align="center">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)">解绑账号</el-button>
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
        @current-change="handleCurrentChange"
      />
    </div>

  </div>
</template>

<script>
import { getSocialList, untied } from '@/api/social'
import { parseTime } from '@/utils/index'

export default {
  data() {
    return {
      tableData: [],
      title: '',
      dialogFormVisible: false, // 控制弹出框
      formLabelWidth: '120px',
      isEditForm: false,
      currentPage: 1,
      pageSize: 10,
      total: 0, // 总数量
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
      loading: false,
      queryTypeOptions: [
        { key: 'gitee', display_name: 'gitee' },
        { key: 'github', display_name: 'github' },
        { key: 'qq', display_name: 'qq' }
      ],
      query: {
        providerId: '',
        value: ''
      }
    }
  },
  created() {
    this.getSocialList()
  },
  methods: {
    parseTime,
    getSocialList: function() {
      this.loading = true
      const params = new URLSearchParams()
      params.append('current', this.currentPage)
      params.append('size', this.pageSize)
      if (this.query.providerId !== '') {
        params.append('providerId', this.query.providerId)
        params.append('displayName', this.query.value)
      }

      getSocialList(params).then(response => {
        this.loading = false
        this.tableData = response.data.data.records
        this.total = response.data.data.total
      })
    },
    // 查找
    handleFind: function() {
      this.getSocialList()
    },
    // 换页
    handleCurrentChange: function(val) {
      this.currentPage = val
      this.getSocialList()
    },

    handleDelete: function(row) {
      const that = this
      this.$confirm('此操作将解绑社交登录账号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const params = new URLSearchParams()
          params.append('userId', row.userId)
          params.append('providerId', row.providerId)
          untied(params).then(response => {
            if (response.data.code === 200) {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              that.getSocialList()
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
            message: '已取消解绑账号'
          })
        })
    }
  }
}
</script>
