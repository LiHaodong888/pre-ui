<!--suppress ALL -->
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
        placeholder="请输入菜单"
      />
      <el-button class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFind">查找
      </el-button>
      <el-button class="filter-item" size="small" type="primary" icon="el-icon-plus" @click="handleAdd">添加菜单</el-button>
    </div>

    <el-table
      :data="tableTreeData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="menuId"
      border
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column
        prop="name"
        label="名称"
        sortable
        width="180"
      />
      <el-table-column label="图标" align="center">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>

      <el-table-column label="类型" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 0" size="small">目录</el-tag>
          <el-tag v-else-if="scope.row.type === 1" size="small" type="success">菜单</el-tag>
          <el-tag v-else-if="scope.row.type === 2" size="small" type="info">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="parentName"
        label="上级菜单"
        align="center"
      />
      <el-table-column
        prop="path"
        label="菜单URL"
        align="center"
      />
      <el-table-column
        prop="component"
        label="菜单组件"
        align="center"
        width="120"
      />
      <el-table-column
        prop="perms"
        label="授权标识"
        align="center"
        width="180"
      />
      <el-table-column
        prop="sort"
        label="排序"
        align="center"
      />
      <el-table-column label="操作" fixed="right" min-width="150" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增修改界面 -->
    <el-dialog
      :title="!dataForm.id ? '新增' : '修改'"
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
      >
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="dataForm.type">
            <el-radio v-for="(type, index) in menuTypeList" :key="index" :label="index">{{ type }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="dataForm.type !== 2" label="菜单图标">
          <el-popover
            placement="bottom-start"
            width="460"
            trigger="click"
            @show="$refs['iconSelect'].reset()"
          >
            <IconSelect ref="iconSelect" @selected="selected" />
            <el-input slot="reference" v-model="dataForm.icon" placeholder="点击选择图标" readonly>
              <svg-icon
                v-if="dataForm.icon"
                slot="prefix"
                :icon-class="dataForm.icon"
                class="el-input__icon"
                style="height: 32px;width: 16px;"
              />
              <i v-else slot="prefix" class="el-icon-search el-input__icon" />
            </el-input>
          </el-popover>
        </el-form-item>

        <el-form-item :label="menuTypeList[dataForm.type] + '名称'" prop="name">
          <el-input v-model="dataForm.name" :placeholder="menuTypeList[dataForm.type] + '名称'" />
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentName">
          <popup-tree-input
            :data="popupTreeData"
            :props="popupTreeProps"
            :prop="dataForm.parentName == null||dataForm.parentName === ''?'根节点':dataForm.parentName"
            :node-key="''+dataForm.parentId"
            :current-change-handle="handleTreeSelectChange"
          />
        </el-form-item>
        <el-form-item v-if="dataForm.type !== 0" label="授权标识" prop="perms">
          <el-input v-model="dataForm.perms" placeholder="如: sys:user:add, sys:user:edit, sys:user:delete" />
        </el-form-item>

        <el-form-item v-if="dataForm.type !== 2" label="内部菜单" prop="isFrame">
          <el-radio v-model="dataForm.isFrame" label="true">是</el-radio>
          <el-radio v-model="dataForm.isFrame" label="false">否</el-radio>
        </el-form-item>

        <el-form-item v-if="dataForm.type === 1 && dataForm.isFrame === 'true'" label="菜单路由" prop="component">
          <el-row>
            <el-col :span="22">
              <el-input v-model="dataForm.component" placeholder="路由组件" />
            </el-col>
            <el-col :span="2" class="icon-list__tips">
              <el-tooltip placement="top" effect="light" style="padding: 10px;">
                <div slot="content">
                  <p>URL格式：</p>
                  <p>1.常规业务开发的功能URL，如用户管理，Views目录下页面路径为 @view/sys/user, 此处填写 sys/user。</p>
                  <p>2.嵌套外部网页，如通过菜单打开百度网页，此处填写 http://www.baidu.com，http:// 不可省略。</p>
                  <p>示例：用户管理：/sys/user 嵌套百度：http://www.baidu.com 嵌套网页：http://127.0.0.1:8000</p></div>
                <i class="el-icon-warning" />
              </el-tooltip>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item v-if="dataForm.type !== 2" label="菜单URL" prop="url">
          <el-input v-model="dataForm.path" placeholder="菜单URL" />
        </el-form-item>

        <el-form-item v-if="dataForm.type !== 2" label="排序编号" prop="sort">
          <el-input-number
            v-model="dataForm.sort"
            controls-position="right"
            :min="0"
            label="排序编号"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import PopupTreeInput from '@/components/PopupTreeInput'
import IconSelect from '@/components/IconSelect'
import { saveMenu, getMenuTree, updateMenu, deleteMenu } from '@/api/menu'
import { formatData, getPar } from '@/utils/webUtils'

export default {
  components: { PopupTreeInput, IconSelect },
  data() {
    return {
      size: 'small',
      keyword: '',
      formLabelWidth: '120px',
      isEditForm: false,
      loading: false,
      dialogVisible: false, // 控制弹出框
      menuTypeList: ['目录', '菜单', '按钮'],
      dataForm: {
        menuId: 0,
        type: 1,
        name: '',
        parentId: 0,
        component: '',
        isFrame: 'false',
        parentName: '主页',
        path: '',
        perms: '',
        sort: 0,
        icon: ''
      },
      tableTreeData: [],
      // 表单校验
      dataRule: {
        name: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }]
      },

      popupTreeData: [],
      popupTreeProps: {
        label: 'name',
        children: 'children'
      },
      key: 1,
      columns: [
        {
          label: '名称',
          key: 'name',
          expand: true,
          width: 220,
          align: 'center'
        },
        {
          label: '图标',
          key: 'icon',
          width: 50
        },
        {
          label: '类型',
          key: 'type',
          width: 80
        },
        {
          label: '上级菜单',
          key: 'parentName',
          align: 'center',
          width: 100
        },
        {
          label: '菜单URL',
          key: 'path',
          align: 'center'
        },
        {
          label: '菜单组件',
          key: 'component',
          align: 'center',
          width: 100
        },
        {
          label: '授权标识',
          key: 'perms',
          align: 'center'
        },
        {
          label: '排序',
          key: 'sort',
          align: 'center',
          width: 50
        },
        {
          label: '操作',
          key: 'operation',
          fixed: 'right',
          width: 180
        }
      ]
    }
  },
  created() {
    this.findTreeData()
  },

  methods: {
    selected(name) {
      this.dataForm.icon = name
    },
    // 获取数据
    findTreeData: function() {
      this.loading = true
      getMenuTree().then(res => {
        this.tableTreeData = res.data.data
        this.popupTreeData = this.getParentMenuTree(res.data.data)
        this.loading = false
      })
    },
    // 获取上级菜单树
    getParentMenuTree: function(tableTreeDdata) {
      const parent = {
        parentId: 0,
        name: '根节点',
        children: tableTreeDdata
      }
      return [parent]
    },

    handleFind: function() {
      this.findTreeData()
    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true
      this.isEditForm = false
      this.dataForm = {
        menuId: 0,
        type: 1,
        name: '',
        parentId: 0,
        component: '',
        isFrame: 'true',
        parentName: '',
        path: '',
        perms: '',
        sort: 0,
        icon: ''
      }
    },
    // 显示编辑页面
    handleEdit: function(row) {
      this.isEditForm = true
      this.dialogVisible = true
      const { menuId, type, name, parentId, parentName, isFrame, component, path, perms, sort, icon } = row
      this.dataForm.menuId = menuId
      this.dataForm.type = type
      this.dataForm.name = name
      this.dataForm.parentId = parentId
      this.dataForm.component = component
      this.dataForm.parentName = parentName
      this.dataForm.isFrame = '' + isFrame
      this.dataForm.path = path
      this.dataForm.perms = perms
      this.dataForm.sort = sort
      this.dataForm.icon = icon
    },
    // 菜单树选中
    handleTreeSelectChange(data) {
      this.dataForm.parentId = data.menuId
      this.dataForm.parentName = data.name
    },

    // 删除操作
    handleDelete: function(row) {
      const that = this
      this.$confirm('此操作将把分类删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteMenu(row.menuId).then(response => {
            if (response.data.code === 200) {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              that.findTreeData()
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

    // 新增修改操作
    submitForm: function() {
      if (!this.isEditForm) {
        saveMenu(this.dataForm).then(response => {
          if (response.data.code === 200) {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.dialogVisible = false
            this.findTreeData()
          } else {
            this.$message({
              type: 'error',
              message: response.data.msg
            })
          }
        })
      } else {
        updateMenu(this.dataForm).then(response => {
          if (response.data.code === 200) {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.dialogVisible = false
            this.findTreeData()
          } else {
            this.$message({
              type: 'error',
              message: response.data
            })
          }
        })
      }
    }
  }
}
</script>
