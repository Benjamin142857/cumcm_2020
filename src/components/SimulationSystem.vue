<template>
  <div class="main-box">
    <!--  title  -->
    <el-row>
      <h1 style="font-size: 22px;font-weight: bold">cumcm2020 - 信贷策略仿真系统</h1>
    </el-row>

    <!--  input  -->
    <el-row style="margin-bottom: 30px">
      <el-card shadow="never">
        <span style="font-size: 14px;color: darkgray">input</span>
        <!-- 输入参数 -->
        <el-row style="margin: 10px 0">
          <span style="font-size: 12px;margin: 0 5px 0 40px">迭代次数: </span>
          <el-input-number style="max-width: 100px" size="mini" v-model="inputData.iterN" controls-position="right" :min="100" :max="10000" :step="100" :disabled="isStart"></el-input-number>

          <span style="font-size: 12px;margin: 0 5px 0 40px">挽留概率模型: </span>
          <el-select v-model="inputData.modelSaveClientProbabilitySelect" placeholder="请选择" size="mini" :disabled="isStart">
            <el-option
                v-for="item in inputData.modelSaveClientProbabilityList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              <span style="float: left;margin-right: 30px">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.desc }}</span>
            </el-option>
          </el-select>
        </el-row>

        <!-- 按键控制台 -->
        <el-row style="margin: 20px 0">
          <el-button style="margin-left: 40px" size="mini" type="primary" @click="startSimulation" :disabled="isStart">开始</el-button>
          <el-button size="mini" type="warning" @click="isPause = !isPause" :disabled="!isStart">
            <span v-show="!isPause"><i class="el-icon-video-pause"></i> 暂停</span>
            <span v-show="isPause"><i class="el-icon-caret-right"></i> 继续</span>
          </el-button>
          <el-button size="mini" type="danger" @click="isStart = false" :disabled="!isStart">停止</el-button>
        </el-row>

      </el-card>
    </el-row>

    <!--  output  -->
    <el-row>
      <el-card shadow="never">
        <span style="font-size: 14px;color: darkgray">output</span>

        <el-row style="margin: 20px 0">
          <el-col :span="4">
            <span style="font-size: 12px">当前迭代次数: </span>
            <span style="font-weight: bold;font-size: 16px">{{ outputData.iterNow }}</span>
          </el-col>

          <el-col :span="4">
            <span style="font-size: 12px">当前迭代次数: </span>
            <span style="font-weight: bold;font-size: 16px">{{ outputData.iterNow }}</span>
          </el-col>


          <el-col :span="4">
            <span style="font-size: 12px">当前迭代次数: </span>
            <span style="font-weight: bold;font-size: 16px">{{ outputData.iterNow }}</span>
          </el-col>
        </el-row>
      </el-card>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "SimulationSystem",
    data: function () {
      return {
        // global
        isStart: false,       // 是否已开始
        isPause: false,       // 是否暂停
        singleLock: false,    // 单线程锁

        // 企业数据
        companyData: [],
        // 输入数据
        inputData: {
          iterN: 100,                               // 总迭代次数
          modelSaveClientProbabilitySelect: 0,      // 挽留概率模型 - 选择
          modelSaveClientProbabilityList: [         // 挽留概率模型 - 可选项
            {label: 'model1', value: 0, func: this.modelSaveClientProbability_1, desc: "基于当前流失率"},
            {label: 'model2', value: 1, func: this.modelSaveClientProbability_2, desc: "基于企业评分"},
          ],
        },
        // 输出数据
        outputData: {},

      }
    },
    methods: {
      // 初始化导入企业数据
      initCompanyData: function () {

      },

      // 初始化输出数据
      initOutputData: function () {
        this.outputData = {
          totalClientA: this.companyData.filter(item=>{return item.grade === 'A'}).length,      // A客户总数
          totalClientB: this.companyData.filter(item=>{return item.grade === 'B'}).length,      // B客户总数
          totalClientC: this.companyData.filter(item=>{return item.grade === 'C'}).length,      // C客户总数

          iterNow: 0,                 // 当前迭代次数
          wastageClientA: 0,          // A客户流失数
          wastageClientB: 0,          // B客户流失数
          wastageClientC: 0,          // C客户流失数
          wastageRateClientA: [],     // A客户流失率时序表
          wastageRateClientB: [],     // B客户流失率时序表
          wastageRateClientC: [],     // C客户流失率时序表
          repayRate: [],              // 还贷率时序列表
          totalRevenue: [],           // 总收益时序列表
        }
      },

      // 开始仿真
      startSimulation: async function () {
        // 0. 判断是否有仿真线程在执行, 是则等待对应线程释放锁
        while (this.singleLock) {
          this.isStart = false;
          await this.sleep(100);
        }
        this.isStart = true;
        this.singleLock = true;

        // 1. 判断企业数据是否导入

        // 2. 初始化输出数据
        this.initOutputData();

        // 3. 开始执行
        while (this.outputData.iterNow < this.inputData.iterN) {
          if (this.isStart) {
            while (this.isPause && this.isStart) {
              await this.sleep(100);
            }
            console.log(this.outputData.iterNow);
            await this.sleep(100);
            this.outputData.iterNow ++;
          }
          else {
            break;
          }
        }

        // 4. 结束
        this.isStart = false;
        this.isPause = false;
        this.singleLock = false;
      },

      // 睡眠
      sleep: function (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
      },

      // 挽留概率模型_1
      modelSaveClientProbability_1: function () {
        return 1
      },

      // 挽留概率模型_2
      modelSaveClientProbability_2: function () {
        return 2
      }
    },
    created: function () {
      this.initCompanyData();
      this.initOutputData();
    },

  }
</script>

<style scoped>
  .main-box {
    padding: 0 20px;
    margin: 0;
    background: none;
  }
</style>