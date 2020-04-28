<template>
  <div class="app-container">
    <el-divider content-position="left"><span class="title">查询</span></el-divider>
    <div class="query">
       <div class="input_box">
          <el-input
          v-model="queryList.licensePlate"
          placeholder="车牌号码"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <el-input
          v-model="queryList.phone"
          placeholder="请输入手机号"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <el-input
          v-model="queryList.garageName"
          placeholder="请输入车行名称"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <el-select v-model="queryList.orderStatus" @change="getData" class="input fl" placeholder="订单状态">
            <el-option
              v-for="item in indentStateList"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
          <el-select v-model="queryList.orderSource" @change="getData" class="input fl" placeholder="订单来源">
            <el-option
              v-for="value in sourceList"
              :label="value.name"
              :value="value.id"
              :key="value.id"
            ></el-option>
          </el-select>
          <el-date-picker
            class="input fl"
            style="width:260px"
            v-model="queryList.time"
            type="daterange"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="getData"
          ></el-date-picker>
       </div> 
       <div class="btn_box">
         <div>
           <el-button type="primary" icon="el-icon-search" @click="getData">搜索</el-button>
           <el-button type="primary" @click="reset">重置</el-button>
           <el-button type="primary" @click="exportData">导出</el-button>
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
      fit
      style="width: 100%;">
      <!-- fit highlight-current-row -->
      <el-table-column label="订单编号" prop="orderCode" fixed align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车行名称" prop="garageName" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.garageName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车牌号" prop="garageName" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.garageName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人" prop="contacts" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.contacts }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" prop="phone" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" prop="orderStatusCopy" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderStatusCopy }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单来源" prop="orderSource" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderSource }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目名称" prop="projectName" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.projectName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="应收金额" prop="money" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预约时间" prop="appointmentTime" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.appointmentTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单时间" prop="placeTime" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.placeTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remarks" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remarks }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right" prop="audit_status" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="compile(scope.row)">查询</el-button>
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
    <!-- 查看 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="editDialog"
      width="50%"
      @close="close"
      center>
      <el-form label-position="right" ref="ruleForm" :rules="rules" label-width="150px" :model="itemObj" class="clearFix">
           <!-- <span class="title">账号信息</span> -->
           <el-form-item label="订单编号:" prop="orderCode" style="width:50%">
              <el-input v-model="itemObj.orderCode" style="width:80%" disabled></el-input>
           </el-form-item>
           <el-form-item label="车行名称:" prop="garageName" style="width:50%">
              <el-input v-model="itemObj.garageName" style="width:80%" disabled></el-input>
           </el-form-item>
           <el-form-item label="车行联系人:" prop="garageContacts" style="width:50%">
              <el-input v-model="itemObj.garageContacts" style="width:80%" disabled></el-input>
           </el-form-item>
           <el-form-item label="车行联系人电话:" prop="garagePhone" style="width:50%">
              <el-input v-model="itemObj.garagePhone" style="width:80%" disabled></el-input>
           </el-form-item>
           <el-form-item label="车行地址:" prop="garageAddress" style="width:50%">
              <el-input v-model="itemObj.garageAddress" style="width:80%" disabled></el-input>
           </el-form-item>
           <el-form-item label="品牌车系:" prop="brandCar" style="width:50%">
              <el-input v-model="itemObj.brandCar" style="width:80%" disabled></el-input>
           </el-form-item>
           <el-form-item label="车牌号:" prop="garageName" style="width:50%">
              <el-input v-model="itemObj.garageName" style="width:80%" disabled></el-input>
           </el-form-item>
           <el-form-item label=" 联系人:" prop="contacts" style="width:50%">
              <el-input v-model="itemObj.contacts" style="width:80%" disabled></el-input>
           </el-form-item>
           <el-form-item label=" 手机号:" prop="phone" style="width:50%">
              <el-input v-model="itemObj.phone" style="width:80%" disabled></el-input>
           </el-form-item>
           <el-form-item label=" 订单状态:" prop="orderStatusCopy" style="width:50%">
              <el-input v-model="itemObj.orderStatusCopy" style="width:80%" disabled></el-input>
           </el-form-item>
           <el-form-item label=" 订单来源:" prop="orderSource" style="width:50%">
              <el-input v-model="itemObj.orderSource" style="width:80%" disabled></el-input>
           </el-form-item>
           <el-form-item label=" 项目名称:" prop="projectName" style="width:50%">
              <el-input v-model="itemObj.projectName" style="width:80%" disabled></el-input>
           </el-form-item>
           <el-form-item label=" 应收金额:" prop="money" style="width:50%">
              <el-input v-model="itemObj.money" style="width:80%" disabled></el-input>
           </el-form-item>
           <el-form-item label=" 预约时间:" prop="appointmentTime" style="width:50%">
              <el-input v-model="itemObj.appointmentTime" style="width:80%" disabled></el-input>
           </el-form-item>
           <el-form-item label=" 下单时间:" prop="placeTime" style="width:50%">
              <el-input v-model="itemObj.placeTime" style="width:80%" disabled></el-input>
           </el-form-item>
       </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" :loading="loadingBootm" @click="editDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { findServiceOrderInfos , } from '@/api/serve'
import Pagination from "@/components/Pagination"
export default {
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
      alterDisabled: false,
      inputDisabled: false,
      passRadio: null,
      loading: false,
      passDialog: false,
      editDialog: false,
      itemObj: {},
      rules: {
          username: [
            { required: true, message: '不能为空', trigger: 'blur' },
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
          ],
          dotType: [
            { required: true, message: '请选择类型', trigger: 'change' }
          ],
          dotName: [
            { required: true, message: '不能为空', trigger: 'blur' },
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '不能为空', trigger: 'blur' },
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
        licensePlate: null,
        phone: null,
        garageName: null,
        orderStatus: null,
        orderSource: null,
        time: ["", ""],
      },
      indentStateList: [
        {
          name: '未支付',
          id: 0
        },
        {
          name: '已支付',
          id: 1
        }
      ],
      sourceList: [
        {
          name: '全部',
          id: 0
        }
      ],
      statusList: [
        {
          name: '启用',
          value: 1
        },
        {
          name: '禁用',
          value: 0
        },
      ],
    }
  },
  created() {
    this.getData()
    this.thishostName = `${location.protocol}//${location.hostname}`
  },
  methods: {
    exportData(){
            // console.log(this.data.data);
      if(this.data.data.length <= 0){
        this.$message({
            message: '暂无数据可导出~',
            type: 'warning'
          })
      }else{
          var {licensePlate,phone,garageName,orderStatus,orderSource,time} = this.queryList
          var startTime = time[0]
          var endTime = time[1]
          window.location.href = `http://192.168.0.161:8182/yuyuetrip/wash/serviceOrderExport?pageNum=${this.data.current_page}&pageSize=${this.data.per_page}&licensePlate=${licensePlate}&phone=${phone}&garageName=${garageName}&orderStatus=${orderStatus}&orderSource=${orderSource}&startTime=${startTime}&endTime=${endTime}`
      }
    },
    getData(filter){
      this.loading = true
      let data = {}
      var queryList = this.queryList
      if (queryList.licensePlate) {
        data.licensePlate = queryList.licensePlate
      }
      if (queryList.phone) {
        data.phone = queryList.phone   
      }
      if (queryList.garageName) {
        data.garageName = queryList.garageName   
      }
      if (queryList.orderStatus) {
        data.orderStatus = queryList.orderStatus   
      }
      if (queryList.orderSource) {
        data.orderSource = queryList.orderSource   
      }
      if (queryList.time[0] && queryList.time[1]) {
        data.startTime = queryList.time[0]
        data.endTime = queryList.time[1]
      }
      if (filter && this.data.current_page > 1) {
        data.page = this.data.current_page;
      } else {
        this.data.current_page = 1;
      }
      // data.username = this.$store.state.user.name
      data.pageNum = this.data.current_page
      data.pageSize = this.data.per_page
      findServiceOrderInfos(data).then(res=>{
        // this.data = res;
        this.loading = false;
        if (!res.data || res.data.length <= 0) {
          this.$message("暂无数据~")
          this.data.data = []
        }
        if( res.data && res.data.length > 0){
          this.data = res;
          this.data.current_page = res.pageNum
          this.data.per_page = res.pageSize
          this.data.total = res.total
          this.data.data.forEach(v=>{
            if(v.orderStatus == 0){
              v.orderStatusCopy = '未支付'
            }else{
              v.orderStatusCopy = '已支付'
            }
          })
        }
      })
    },
    compile(item){
      this.dialogTitle = "查看"
      this.itemObj = item
      this.editDialog = true
    },
    close(){
      this.itemObj = {}
    },
    handleFilter(){
      this.getData()
    },
    getPageData(e) {
      this.getData("page");
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
/deep/.el-dialog__header{
  background: #f8f8f8;
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
