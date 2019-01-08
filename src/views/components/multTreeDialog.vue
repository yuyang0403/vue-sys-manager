<template>
  <div class="alertcontent">
    <div class="alertcontentdiv">
      <div class="alertcontentdiv_head">
        <p>请选择角色</p>
        <div>
          <i class="el-icon-close" @click="closeAlert"/>
        </div>
      </div>
      <div class="tree">
        <el-input
          :placeholder="dialogContext.placeholder"
          v-model="filterText"
          class="search"
          prefix-icon="el-icon-search"/>
        <el-tree
          ref="tree"
          :lazy="lazy"
          :node-key="defaultProps.id"
          :data="data"
          :highlight-current="highlightCurrent"
          :show-checkbox="showCheckbox"
          :expand-on-click-node="expand"
          :check-strictly="strictly"
          :filter-node-method="filterNode"
          :props="defaultProps"
          @check="handleNodeClick"/>
      </div>
      <div class="alertcontentdiv_buttom">
        <el-button class="close" size="mini" @click="closeAlert">关闭</el-button>
        <el-button class="sure" size="mini" type="primary" @click="sureSave">确认</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { fetchRoleList } from '@/api/system_manager/common/roleSelect'
export default {
  name: 'MultTreeDialog',
  props: {
    dialogContext: {
      type: Object
    },
    popupArr: {
      type: Array
    },
    lazy: {
      type: Boolean,
      default() {
        return false
      }
    },
    highlightCurrent: {
      type: Boolean,
      default() {
        return true
      }
    },
    showCheckbox: {
      type: Boolean,
      default() {
        return true
      }
    },
    expand: {
      type: Boolean,
      default() {
        return false
      }
    },
    strictly: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      filterText: '',
      defaultProps: {},
      data: [],
      tempDefaultValue: []
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    if (this.dialogContext.type === 'roleList') {
      this.defaultProps = {
        children: 'children',
        label: 'name',
        id: 'code'
      }
    }
    this.init()
  },
  methods: {
    /* 初始化数据 */
    init(node, resolve) {
      const url = ''
      if (this.dialogContext.type === 'roleList') {
        fetchRoleList().then(response => {
          this.data = response.data.data
          if (this.popupArr.length !== 0) {
            for (let i = 0, len = this.popupArr.length; i < len; i++) {
              if (this.dialogContext.type === 'roleList') {
                this.tempDefaultValue.push(this.popupArr[i].regionCode)
              }
            }
          } else {
            this.tempDefaultValue = []
          }
          this.$refs.tree.setCheckedKeys(this.tempDefaultValue)
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      }
    },
    /* 条件查询 */
    filterNode(value, data) {
      if (!value) return true
      if (this.dialogContext.type === 'roleList') {
        return data.fullName.indexOf(value) !== -1
      }
    },
    /* 点击节点动作 */
    handleNodeClick(data, obj) {
      if (this.dialogContext.type === 'roleList') {
        this.$refs.tree.setCheckedNodes([])
        if (obj.checkedNodes.length > 0) {
          for (let i = 0, len = obj.checkedNodes.length; i < len; i++) {
            if (data.code === obj.checkedNodes[i].code) {
              this.$refs.tree.setCheckedNodes([data])
              return false
            } else {
              this.$refs.tree.setCheckedNodes([])
            }
          }
        }
      }
    },
    closeAlert() {
      this.tempDefaultValue = []
      if (this.dialogContext.type === 'roleList') {
        this.$emit('saveRole', this.popupArr)
      }
      this.$emit('input', false)
    },
    sureSave() {
      // this.tempDefaultValue = []
      const checkedNodes = this.$refs.tree.getCheckedNodes()
      // const halfCheckedNodes = this.$refs.tree.getHalfCheckedNodes()
      if (this.dialogContext.type === 'roleList') {
        this.$emit('saveRole', checkedNodes)
      }
      this.$emit('input', false)
    }
  }
}
</script>
<style type="text/scss" lang="scss" scoped>
    .alertcontent {
        z-index: 10;
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        .alertcontentdiv {
            position: absolute;
            left: calc(50% + 90px);
            top: 50%;
            transform: translate(-50%, -50%);
            width: 500px;
            height: 660px;
            padding-top: 0;
            background: #fff;
            display: flex;
            flex-direction: column;
            border-radius: 8px;
            .el-icon-close {
                font-size: 20px;
                cursor: pointer;
            }
            .alertcontentdiv_head {
                width: 100%;
                border-radius: 8px 8px 0 0;
                background-color: #00a0e9;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                border-bottom: 1px solid #ddd;
                height: 50px;
                p {
                    height: 30px;
                    line-height: 30px;
                    font-size: 16px;
                    color: #ffffff;
                }
                & > div {
                    position: absolute;
                    right: 10px;
                    top: 15px;
                    color: #ffffff;
                }
            }
            .tree {
                text-align: center;
                .el-input {
                    width: 75%;
                    margin: 21px 0 25px 0;
                    .el-input__inner{
                        height: 33px;
                        line-height: 33px;
                    }
                }
                .el-tree {
                    height: 480px;
                    margin: 0 20px;
                    overflow-y: scroll;
                }
            }
            .alertcontentdiv_buttom {
                border-top: 1px solid #d8dce5;
                // height: 56px;
                position: relative;
                .el-button {
                    height: 30px;
                    width: 120px;
                }
                .close {
                    background-color: rgb(193, 193, 193);
                    color: #fff;
                    border: none;
                    position: absolute;
                    left: 105px;
                    top: 6px;
                }
                .sure{
                    position: absolute;
                    right: 105px;
                    top: 6px
                }
            }
        }
    }
</style>
