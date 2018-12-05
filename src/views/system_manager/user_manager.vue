<template>
  <div class="app-container">
    <!-- 过滤条件 -->
    <div class="filter-container">
      <el-input :placeholder="$t('system_manager.user_manager.login_name')" v-model="listQuery.loginName" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input :placeholder="$t('system_manager.user_manager.phone')" v-model="listQuery.phone" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.status" :placeholder="$t('system_manager.user_manager.status')" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarStatusOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange">
      <el-table-column :label="$t('table.id')" prop="id" sortable="custom" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('system_manager.user_manager.login_name')" >
        <template slot-scope="scope">
          <span>{{ scope.row.loginName }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('system_manager.user_manager.truename')" >
        <template slot-scope="scope">
          <span>{{ scope.row.truename }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('system_manager.user_manager.phone')" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('system_manager.user_manager.user_type')" width="120">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.userType | userTypeFilter }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column :label="$t('system_manager.user_manager.email')" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('system_manager.user_manager.nick_name')" >
        <template slot-scope="scope">
          <span>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('system_manager.user_manager.login_num')" >
        <template slot-scope="scope">
          <span>{{ scope.row.loginNum }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('system_manager.user_manager.status')" >
        <template slot-scope="scope">
          <el-tag>{{ scope.row.status | statusFilter }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column :label="$t('system_manager.user_manager.avatar')" >
        <template slot-scope="scope">
          <img :src="scope.row.avatar" width="30%">
        </template>
      </el-table-column>

      <el-table-column :label="$t('system_manager.user_manager.last_login_time')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.lastLoginTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('system_manager.user_manager.create_time')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
          <el-button v-if="scope.row.status!='published'" size="mini" type="success" @click="handleModifyStatus(scope.row,'published')">{{ $t('table.publish') }}
          </el-button>

          <el-button v-if="scope.row.status!='deleted'" size="mini" type="danger" @click="handleModifyStatus(scope.row,'deleted')">{{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 弹窗 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('system_manager.user_manager.status')" prop="status">
          <el-select v-model="temp.status" class="filter-item" placeholder="请选择">
            <el-option v-for="item in calendarStatusOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('system_manager.user_manager.login_name')" prop="loginName">
          <el-input v-model="temp.loginName" placeholder="请输入登录名"/>
        </el-form-item>

        <el-form-item :label="$t('system_manager.user_manager.password')" prop="password">
          <el-input v-model="temp.password" placeholder="不填默认使用用户名作为密码"/>
        </el-form-item>

        <el-form-item :label="$t('system_manager.user_manager.nick_name')" prop="nickName">
          <el-input v-model="temp.nickName" placeholder="请输入昵称"/>
        </el-form-item>

        <el-form-item :label="$t('system_manager.user_manager.truename')" prop="truename">
          <el-input v-model="temp.truename" placeholder="请输入你的真实姓名"/>
        </el-form-item>

        <el-form-item :label="$t('system_manager.user_manager.phone')" prop="phone">
          <el-input v-model="temp.phone" placeholder="请输入手机号"/>
        </el-form-item>

        <el-form-item :label="$t('system_manager.user_manager.email')" prop="email">
          <el-input v-model="temp.email" placeholder="请输入邮箱"/>
        </el-form-item>

        <el-form-item :label="$t('system_manager.user_manager.avatar')" prop="avatar">
          <el-input v-model="temp.avatar" placeholder="请上传头像"/>
        </el-form-item>

        <el-form-item :label="$t('system_manager.user_manager.desc')">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.desc" type="textarea" placeholder="用户描述"/>
        </el-form-item>

        <el-form-item :label="$t('system_manager.user_manager.roleList')" prop="roleList">
          <el-drag-select v-model="temp.roleList" style="width:500px;" multiple placeholder="请选择">
            <el-option v-for="item in calendarRoleOptions" :label="item.display_name" :value="item.key" :key="item.display_name" />
          </el-drag-select>

          <div style="margin-top:30px;">
            <el-tag v-for="item of value" :key="item" style="margin-right:15px;">{{ item }}</el-tag>
          </div>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"/>
        <el-table-column prop="pv" label="Pv"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { fetchUserList, fetchUserRole, fetchPv, createUser, updateUser } from '@/api/system_manager/user_manager'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import ElDragSelect from '@/components/DragSelect' // base on element-ui
import { fetchRoleList } from '@/api/system_manager/common/roleSelect'

const calendarStatusOptions = [
  { key: 1, display_name: '有效' },
  { key: 0, display_name: '无效' }
]
const calendarTypeOptions = [
  { key: 1, display_name: '系统用户' },
  { key: 0, display_name: '不可删除用户' }
]

const calendarRoleOptions = []
fetchRoleList().then(response => {
  const data = response.data.data
  for (let i = 0; i < data.length; i++) {
    calendarRoleOptions.push({ key: data[i].code, display_name: data[i].name })
  }

  // Just to simulate the time of the request
  setTimeout(() => {
    this.listLoading = false
  }, 1.5 * 1000)
})

// arr to obj ,such as { CN : "China", US : "USA" }
const calendarStatusKeyValue = calendarStatusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination, ElDragSelect },
  directives: { waves },
  filters: {
    statusFilter(status) {
      return calendarStatusKeyValue[status]
    },
    userTypeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      calendarStatusOptions,
      calendarTypeOptions,
      calendarRoleOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      showReviewer: false,
      temp: {
        id: undefined,
        roleList: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        status: [
          { required: true, message: '请选择用户状态', trigger: 'change' }
        ],
        loginName: [{ required: true, message: '请输入登录名', trigger: 'blur' },
          { validator(rule, value, callback, source, options) {
            var errors = []
            if (!/^[a-z0-9A-Z_]{5,20}$/.test(value)) {
              callback('登录名为5-20位的字母、数字、下划线')
            }
            callback(errors)
          } }
        ],
        nickName: [
          { validator(rule, value, callback, source, options) {
            var errors = []
            if (value && !/^[a-zA-Z\u4e00-\u9fa5]{2,10}$/.test(value)) {
              callback('昵称为2-10位字符或汉字')
            }
            callback(errors)
          } }
        ],
        truename: [
          { validator(rule, value, callback, source, options) {
            var errors = []
            if (value && !/^([\u4e00-\u9fa5]{2,6}|[a-zA-Z]{2,15})$/.test(value)) {
              callback('2-6位汉字或者2-15位字母')
            }
            callback(errors)
          } }
        ],
        phone: [
          { validator(rule, value, callback, source, options) {
            var errors = []
            if (value && !/^1[0-9]{10}$/.test(value)) {
              callback('请输入正确的电话号码')
            }
            callback(errors)
          } }
        ],
        email: [
          { validator(rule, value, callback, source, options) {
            var errors = []
            if (value && !/^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/.test(value)) {
              callback('请输入正确的邮箱')
            }
            callback(errors)
          } }
        ],
        roleList: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchUserList(this.listQuery).then(response => {
        const data = JSON.parse(response.data.data)
        this.list = data.rows
        this.total = data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        status: 1,
        type: 1,
        roleList: []
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createUser(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      fetchUserRole(this.temp.id).then(response => {
        const data = response.data.data
        this.temp.roleList = []
        for (let i = 0; i < data.length; i++) {
          this.temp.roleList[i] = data[i].code
        }
        this.temp.timestamp = new Date(this.temp.timestamp)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          console.log(tempData)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateUser(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
