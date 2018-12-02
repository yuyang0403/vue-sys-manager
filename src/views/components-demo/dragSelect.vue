<template>
  <div class="components-container">

    <el-drag-select v-model="value" style="width:500px;" multiple placeholder="请选择">
      <el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.value" />
    </el-drag-select>

    <div style="margin-top:30px;">
      <el-tag v-for="item of value" :key="item" style="margin-right:15px;">{{ item }}</el-tag>
    </div>

  </div>
</template>

<script>
import ElDragSelect from '@/components/DragSelect' // base on element-ui
import { fetchRoleList } from '@/api/system_manager/common/roleSelect'

export default {
  name: 'DragSelectDemo',
  components: { ElDragSelect },
  data() {
    var result = { value: [], options: [] }
    // 请求数据
    fetchRoleList().then(response => {
      const data = response.data.data
      for (let i = 0; i < data.length; i++) {
        result.options.push({ label: data[i].name, value: data[i].code })
      }

      // Just to simulate the time of the request
      setTimeout(() => {
        this.listLoading = false
      }, 1.5 * 1000)
    })
    return result
  }
}
</script>
