<template>
  <div class="app-container">
    <el-divider content-position="left"><span class="title">查询</span></el-divider>
    <div class="query">
       <div class="input_box">
          <el-input
          v-model="queryList.dotCode"
          placeholder="请输入账号ID"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <el-input
          v-model="queryList.dotName"
          placeholder="网点名称"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <el-select v-model="queryList.status" @change="getData" class="input fl" placeholder="状态">
            <el-option
              v-for="item in statusList"
              :label="item.name"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
          <el-select v-model="queryList.nodeTypes" @change="getData" class="input fl" placeholder="网点类型">
            <el-option
              v-for="item in nodeTypesList"
              :label="item.name"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
          <el-date-picker
          class="picker fl"
            v-model="queryList.time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="getData"
          ></el-date-picker>
       </div> 
       <div class="input_box">
          <el-input
          v-model="queryList.province"
          placeholder="请输入省份"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
           <el-input
          v-model="queryList.city"
          placeholder="请输入城市"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
           <el-input
          v-model="queryList.region"
          placeholder="请输入区/县"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
           <el-input
          v-model="queryList.recommender"
          placeholder="推荐人"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
           <el-input
          v-model="queryList.phone"
          placeholder="手机号码"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
       </div>
       <div class="btn_box">
         <div>
           <el-button type="primary" icon="el-icon-search" @click="getData">搜索</el-button>
           <el-button type="primary" @click="reset">重置</el-button>
         </div>
         <div>
           <el-button type="primary" icon="el-icon-refresh" @click="resetGetData"></el-button>
         </div>
       </div>
    </div>
    <el-table
      v-loading="loading"
      :data="data.data"
      border
      stripe
      style="width: 100%;">
      <!-- fit highlight-current-row -->
      <el-table-column label="网点编号" prop="dotCode" fixed align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dotCode }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="网点类型" prop="realname" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.realname }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="网点名称" prop="dotName" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dotName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客服电话" prop="mobile" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="省份" prop="province" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.province }}</span>
        </template>
      </el-table-column>
      <el-table-column label="市" prop="city" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.city }}</span>
        </template>
      </el-table-column>
      <el-table-column label="区/县" prop="region" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.region }}</span>
        </template>
      </el-table-column>
      <el-table-column label="详细地址" prop="address" align="center" width="250">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="推荐人" prop="recommender" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.recommender }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" prop="status" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" align="center" width="170">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="230" fixed="right" prop="audit_status" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="compile(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="data.total>0"
      :total="data.total"
      :page.sync="data.current_page"
      :limit.sync="data.per_page"
      @pagination="getPageData"
    />
    <!-- 弹窗查看 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="editDialog"
      width="60%"
      @close="close"
      center>
      <el-form label-position="right" ref="ruleForm" :rules="rules" label-width="150px" :model="itemObj" class="clearFix">
         <el-divider content-position="left"><span class="title">银行账户信息</span></el-divider>
         <div class="query clearFix" style="padding-top:30px;margin-bottom:30px;">
           <el-form-item label="户名:" prop="accountName" style="width:50%">
              <el-input v-model="itemObj.accountName" style="width:210px" :disabled="inputDisabled"></el-input>
           </el-form-item>
           <el-form-item label="账户:" prop="account" style="width:50%">
              <el-input v-model="itemObj.account" style="width:210px" :disabled="inputDisabled"></el-input>
           </el-form-item>
           <el-form-item label="开户行:" prop="openingBank" style="width:50%">
              <el-input v-model="itemObj.openingBank" style="width:210px" :disabled="inputDisabled"></el-input>
           </el-form-item>
         </div>
       </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" :loading="loadingBootm" @click="editDialogVisible" v-if="compileBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getList , examineDot , dotOssUpload , updateDot , saveDot , dotExport} from '@/api/nodeList'
import Pagination from "@/components/Pagination"
import areaJson from '@/utils/city_data'
export default {
  // filters: {
  //   statusFilter(status) {
  //     const statusMap = {
  //       published: 'success',
  //       draft: 'gray',
  //       deleted: 'danger'
  //     }
  //     return statusMap[status]
  //   }
  // },
  components: {
    Pagination
  },
  data() {
    var storePhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('不能为空！'));
        } else {
          let reg = /^1[0-9]{10}$/
          if (!reg.test(value)) {
            callback(new Error('请输入正确的手机号！'));
          }else{
            callback();
          } 
        }
    };
    return {
      dotCode: "",
      dialogTitle: "",
      thishostName: '',
      loadingBootm: false,
      urlBl: false,
      compileBtn: false,
      alterDisabled: false,
      inputDisabled: false,
      disabledBtn: false,
      passRadio: null,
      loading: false,
      passDialog: false,
      editDialog: false,
      areaJson:areaJson,
      itemObj: {},
      rules: {
          dotCode: [
            { required: true, message: '不能为空', trigger: 'blur' },
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          region: [
            { required: true, message: '请选择区域', trigger: 'change' }
          ],
          city: [
            { required: true, message: '请选择区域', trigger: 'change' }
          ],
          province: [
            { required: true, message: '请选择区域', trigger: 'change' }
          ],
          dotName: [
            { required: true, message: '不能为空', trigger: 'blur' },
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          date: [
             { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          storePhone: [
            { validator: storePhone, trigger: 'blur' }
          ],
          chargePhone: [
            { validator: storePhone, trigger: 'blur' }
          ]
      },
      data: {
        current_page: 1,
        data: [],
        last_page: 1,
        per_page: 10,
        total: 0,
        link: ""
      },
      queryList: {
        dotCode: null,
        status: null,
        dotName: null,
        province: null,
        city: null,
        region: null,
        phone: null,
        nodeTypes: null,
        recommender: null,
        time: ["", ""],
      },
      statusList: [
        {
          name: '待上传资料',
          value: 1
        },
        {
          name: '待审批',
          value: 2
        },
        {
          name: '审批通过',
          value: 3
        },
        {
          name: '已驳回',
          value: 4
        }
      ],
      nodeTypesList: [
        {
          name: '网点类型',
          value: 1
        },
        {
          name: '车行',
          value: 2
        },
        {
          name: '检测站',
          value: 3
        },
        {
          name: '代办机构',
          value: 4
        }
      ]
    }
  },
  created() {
    this.getData()
    this.thishostName = `${location.protocol}//${location.hostname}`
  },
  methods: {
    getData(filter){
      this.loading = true
      let data = {}
      var queryList = this.queryList
      if (queryList.dotCode) {
        data.dotCode = queryList.dotCode
      }
      if (queryList.status) {
        data.status = queryList.status
      }
      if (queryList.dotName) {
        data.dotName = queryList.dotName
      }
      if (queryList.province) {
        data.province = queryList.province
      }
      if (queryList.city) {
        data.city = queryList.city
      }
      if (queryList.region) {
        data.region = queryList.region
      }
      if (queryList.chargePhone   ) {
        data.chargePhone = queryList.chargePhone   
      }
      if (queryList.recommender) {
        data.recommender = queryList.recommender
      }
      if (queryList.nodeTypes) {
        data.nodeTypes = queryList.nodeTypes
      }
      if (filter && this.data.current_page > 1) {
        data.page = this.data.current_page;
      } else {
        this.data.current_page = 1;
      }
      // data.username = this.$store.state.user.name
      data.pageNum = this.data.current_page
      data.pageSize = this.data.per_page
      getList(data).then(res=>{
        // console.log(res);
        this.loading = false;
        if (res.data.length <= 0) {
          this.$message("暂无数据~")
        }
        if( res.data.length > 0){
          this.data = res;
          this.data.current_page = res.pageNum
          this.data.per_page = res.pageSize
          this.data.total = res.total
        }
      })
    },
    handleFilter(){
      this.getData()
    },
    getPageData(e) {
      this.getData("page");
    },
    compile(item){
      this.dotCode = item.dotCode
      this.editDialog = true
      this.dialogTitle = "编辑"
      this.itemObj = item
      this.alterDisabled = true
      this.inputDisabled = false
      this.disabledBtn = false
      this.compileBtn = true
    },
    editDialogVisible(){
      // 使用ES6的Object.keys()方法,是ES6的新方法, 返回值也是对象中属性名组成的数组
      // var data = this.itemObj
      // var arr = Object.keys(data);
      this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.loadingBootm = true
            if(this.urlBl){
              saveDot(this.itemObj).then(res=>{
                this.loadingBootm = false
                if(res.code == 200){
                  this.$message({
                    message: '操作成功',
                    type: 'success'
                  })
                  this.editDialog = false
                }else{
                  this.$message({
                    message: res.msg,
                    type: 'warning'
                  })
                }
                console.log(res);
              })
            }else{
              updateDot(this.itemObj).then(res=>{
                this.loadingBootm = false
                if(res.code == 200){
                  this.$message({
                    message: '操作成功',
                    type: 'success'
                  })
                  this.editDialog = false
                }else{
                  this.$message({
                    message: res.msg,
                    type: 'warning'
                  })
                }
              })
            }
          } else {
            console.log('error submit!!');
            return false;
          }
      });
    },
    close(){
      this.itemObj = {}
      this.getData()
      this.urlBl = false
    },
    reset(){
      this.queryList = {
        dotCode: null,
        status: null,
        dotName: null,
        province: null,
        city: null,
        region: null,
        phone: null,
        recommender: null,
        time: ["", ""],
      }
    },
    resetGetData(){
      this.reset()
      this.getData()
    },
  }
}
</script>

<style lang="less" scoped>
.title{
  font-size: 18px;
  font-weight: 600;
}
/deep/.el-divider--horizontal{
  margin: 0;
}
.query{
  width: 100%;
  border: 1px solid #DCDFE6;
  border-top: none;
  padding-top: 10px;
  padding-bottom: 20px;
}
.input{
  width: 200px;
  margin-left:20px;
  margin-top: 10px;
}
.picker{
  width: 250px;
  margin-left:20px;
  margin-top: 10px;
}
.btn_box{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 0;
}
/deep/.el-table .warning-row {
    background: oldlace;
  }

/deep/.el-table .success-row {
    background: #f0f9eb;
}
.center{
  display: block;
  align-items: center;
  display: flex;
  justify-content: center;
}
// .fl{
//   float: left;
//   }
// .fr{
//   float: right;
//   }
/deep/.el-form-item{
  float: left;
}
.clearFix::before,
.clearFix::after{
      content: "";
      display: block;
      visibility: hidden;
      height: 0;
      line-height: 0;
      clear: both;
}
.boxUpload{   
    .textUp{
      position: relative;
      float: left;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 4.5%;
      margin-top: 3%;
      margin-left: 3%;
      .uploadTransparency{
          display: block;
          width: 150px;
          height: 100px;
          opacity: 0;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 999;
        }
      .text{
        margin-top: 5px;
      }
      .btn{
        margin-top: 3px;
      }
    }
}
.avatar-uploader .el-upload:hover {
   border-color: #409EFF;
 }
 .avatar-uploader-icon {
   border: 1px dashed #DFDFDF;
   border-radius: 6px;
   cursor: pointer;
   position: relative;
   overflow: hidden;
   font-size: 12px;
   color: #8c939d;
   width: 150px;
   height: 100px;
   line-height: 100px;
   text-align: center;
 }
 .avatar {
   width: 150px;
   height: 100px;
   display: block;
 }
</style>
