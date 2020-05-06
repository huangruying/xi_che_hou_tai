<template>
  <div class="app-container">
    <el-divider content-position="left"><span class="title">查询</span></el-divider>
    <div class="query">
       <div class="input_box">
          <el-input
          v-model="queryList.couponName"
          placeholder="请输入卷名称"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
           <el-input
          v-model="queryList.couponCode"
          placeholder="请输入卷码号"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <el-input
          v-model="queryList.name"
          placeholder="请输入用户名"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
           <el-input
          v-model="queryList.alias"
          placeholder="请输入别名"
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
           <el-button type="primary" @click="importExcel">导入</el-button>
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
      <el-table-column label="卷名称" prop="couponName" fixed align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.couponName }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="网点类型" prop="realname" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.realname }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="金额" prop="couponMoney" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.couponMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column label="卷码号" prop="couponCode" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.couponCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="过期时间" prop="failureTime" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.failureTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="别名" prop="alias" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.alias }}</span>
        </template>
      </el-table-column>
      <el-table-column label="卷码类型" prop="dotType" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dotType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务类型" prop="dotsType" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dotsType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" prop="name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内容" prop="content" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" width="200" fixed="right" prop="audit_status" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="compile(scope.row)">编辑</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <pagination
      v-show="data.total>0"
      :total="data.total"
      :page.sync="data.current_page"
      :limit.sync="data.per_page"
      @pagination="getPageData"
    />

    <!--上传文件的弹窗-->
    <el-dialog :visible.sync="uploaddialogVisible" title="导入数据">
      <el-select v-model="facilitatorId" class="input fl" placeholder="导入请选择服务商">
            <el-option
              v-for="item in statusInfoList"
              :label="item.name"
              :value="item.id"
              :key="item.value"
            ></el-option>
      </el-select>

      <el-upload ref="upload" :auto-upload="false" :multiple="false" :on-change="handleChange" :on-remove="removeFile"
        :limit="1" action="" drag class="upload-demo">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">只能上传excel文件</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadgoBack">返 回</el-button>
        <el-button type="primary" @click="submitImportExcel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { findGeneralCoupon , batchCouponImport , findCompanyInfos } from '@/api/volumeList'
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
            callback()
          } 
        }
    };
    return {
      facilitatorId: null,
      dotCode: "",
      dialogTitle: "",
      thishostName: '',
      fileList: "",
      uploaddialogVisible: false,
      loadingBootm: false,
      urlBl: false,
      alterDisabled: false,
      inputDisabled: false,
      passRadio: null,
      loading: false,
      passDialog: false,
      editDialog: false,
      itemObj: {
        openingBank: false
      },
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
        couponName: null,
        couponCode: null,
        name: null,
        alias: null,
        status: null,
        time: ["", ""],
      },
      statusList: [
        {
          name: '已过期',
          value: 0
        },
        {
          name: '未使用',
          value: 1
        },
        {
          name: '已使用',
          value: 2
        },
      ],
      statusInfoList: []
    }
  },
  created() {
    this.selectInfo()
    this.getData()
    this.thishostName = `${location.protocol}//${location.hostname}`
  },
  methods: {
    async selectInfo(){
      var res = await findCompanyInfos()
      this.statusInfoList = res.data
    },
    exportData(){
      if(this.data.data.length <= 0){
        this.$message({
            message: '暂无数据可导出~',
            type: 'warning'
          })
      }else{
          var {couponName,couponCode,name,alias,status,time} = this.queryList
          var startTime = time[0]
          var endTime = time[1]
          window.location.href = `http://192.168.0.161:8189/yuyuetrip/wash/generalCouponExport?pageNum=${this.data.current_page}&pageSize=${this.data.per_page}
          &couponName=${couponName}&couponCode=${couponCode}&name=${name}&alias=${alias}&status=${status}&startTime=${startTime}&endTime=${endTime}`
      }
    },
    submitImportExcel() {
      if(!this.facilitatorId){
        this.$message({
          type: "warning",
          message: "请选择服务商"
        })
      }else{
        if (this.fileList) {
          this.uploaddialogVisible = false
          var formData = new FormData()
          formData.append('file', this.fileList[0].raw)
          formData.append('id', this.facilitatorId)
          batchCouponImport(formData).then(res => {
            console.log(res);
            this.getData()
            this.$message({
              type: 'success',
              message: `上传成功!`
            })
          })
        } else {
          this.$message({
            message: '请选择Excle文件!'
          })
        }
      }
    },
    importExcel() {
        this.fileList = null
        this.uploaddialogVisible = true
        this.$nextTick((i) => {
          this.$refs.upload.clearFiles()
        })
    },
    uploadgoBack() {
        this.uploaddialogVisible = false
    },
    removeFile(file, fileList) {
        this.fileList = null
    },
    handleChange(file, fileList) {
        this.fileList = fileList
    },
    getData(filter){
      this.loading = true
      let data = {}
      var queryList = this.queryList
      if (queryList.couponName) {
        data.couponName = queryList.couponName
      }
      if (queryList.couponCode) {
        data.couponCode = queryList.couponCode   
      }
      if (queryList.name) {
        data.name = queryList.name   
      }
      if (queryList.alias) {
        data.alias = queryList.alias   
      }
      if (queryList.status) {
        data.status = queryList.status   
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
      findGeneralCoupon(data).then(res=>{
        // console.log(res);
        this.data = res;
        this.loading = false;
        if (res.data.length <= 0) {
          this.$message("暂无数据~")
        }
        if( res.data.length > 0){
          this.data.current_page = res.pageNum
          this.data.per_page = res.pageSize
          this.data.total = res.total
          // this.data.data.forEach(v=>{
          // })
        }
      })
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
  .upload-demo {
    text-align: center;
    padding: 0 100px;
  }
  .info{
    width: 300px;
    .infoItem{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: .5rem;
      .left,.right{
        flex-shrink: 0;
        max-width: 50%
      }
      .left{
        font-weight: bold
      }
    }
  }
</style>
