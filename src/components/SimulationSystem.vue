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
          <el-input-number style="max-width: 100px" size="mini" v-model="inputData.iterN" controls-position="right" :min="20" :max="10000" :step="20" :step-strictly="true" :disabled="isStart"></el-input-number>

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

          <span style="font-size: 12px;margin: 0 5px 0 40px">最大挽留次数: </span>
          <el-input-number style="max-width: 100px" size="mini" v-model="inputData.maxSaveClientTimes" controls-position="right" :min="0" :max="10" :step="1" :step-strictly="true" :disabled="isStart"></el-input-number>
        </el-row>

        <!-- 按键控制台 -->
        <el-row style="margin: 30px 0 10px 0">
          <el-col :span="3">
            <el-button style="margin-left: 40px" size="mini" type="success" @click="showCompanyDataDrawer = true"><i class="el-icon-s-marketing"></i> 企业数据</el-button>
          </el-col>
          <el-col :span="8">
            <el-button style="margin-left: 40px" size="mini" type="primary" @click="startSimulation" :disabled="isStart"><i class="el-icon-caret-right"></i> 开始</el-button>
            <el-button size="mini" type="warning" @click="isPause = !isPause" :disabled="!isStart">
              <span v-show="!isPause"><i class="el-icon-video-pause"></i> 暂停</span>
              <span v-show="isPause"><i class="el-icon-video-play"></i> 继续</span>
            </el-button>
            <el-button size="mini" type="danger" @click="isStart = false" :disabled="!isStart"><i class="el-icon-warning-outline"></i> 停止</el-button>
          </el-col>
        </el-row>

      </el-card>
    </el-row>

    <!--  output  -->
    <el-row>
      <el-card shadow="never">
        <span style="font-size: 14px;color: darkgray">output</span>

        <!-- 迭代次数，总余额，总还贷率，总盈利  -->
        <el-row style="margin: 20px 0">
          <el-col :span="3">
            <span style="font-size: 12px">当前迭代次数: </span>
            <span style="font-weight: bold;font-size: 18px">{{ outputData.iterNow }}</span>
          </el-col>

          <el-col :span="4">
            <span style="font-size: 12px">当前信贷余额值: </span>
            <span style="font-weight: bold;font-size: 18px">{{ outputData.creditBalance }} </span>
            <span style="font-size: 12px">万</span>
          </el-col>

          <el-col :span="4">
            <span style="font-size: 12px">当前总还贷率: </span>
            <span style="font-weight: bold;font-size: 18px">
              {{ outputData.repayRate.length>0? (outputData.repayRate.slice(-1)[0]*100).toFixed(2): '0.00' }}
            </span>
            <span style="font-size: 12px">%</span>
          </el-col>

          <el-col :span="4">
            <span style="font-size: 12px">当前总利润: </span>
            <span style="font-weight: bold;font-size: 18px">
              {{ outputData.totalRevenue.length>0? outputData.totalRevenue.slice(-1)[0].toFixed(2): '0.00' }}
            </span>
            <span style="font-size: 12px">万</span>
          </el-col>
        </el-row>

        <!-- A流失率，B流失率，C流失率，总流失率  -->
        <el-row style="margin: 20px 0">
          <el-col :span="4">
            <span style="font-size: 12px">A级客户流失率: </span>
            <span style="font-weight: bold;font-size: 18px">
              {{ outputData.wastageRateClientA.length>0? (outputData.wastageRateClientA.slice(-1)[0]*100).toFixed(2): '0.00' }}
            </span>
            <span> %</span>
          </el-col>

          <el-col :span="4">
            <span style="font-size: 12px">B级客户流失率: </span>
            <span style="font-weight: bold;font-size: 18px">
              {{ outputData.wastageRateClientA.length>0? (outputData.wastageRateClientA.slice(-1)[0]*100).toFixed(2): '0.00' }}
            </span>
            <span> %</span>
          </el-col>

          <el-col :span="4">
            <span style="font-size: 12px">C级客户流失率: </span>
            <span style="font-weight: bold;font-size: 18px">
              {{ outputData.wastageRateClientA.length>0? (outputData.wastageRateClientA.slice(-1)[0]*100).toFixed(2): '0.00' }}
            </span>
            <span> %</span>
          </el-col>

<!--          <el-col :span="4">-->
<!--            <span style="font-size: 12px">A级客户流失率: </span>-->
<!--            <span style="font-weight: bold;font-size: 18px">-->
<!--              {{ outputData.wastageRateClientA.length>0? (outputData.wastageRateClientA.slice(-1)[0]*100).toFixed(2): '0.00' }}-->
<!--            </span>-->
<!--          </el-col>-->
        </el-row>

      </el-card>
    </el-row>

    <!--  companyData  -->
    <el-row>
      <el-drawer
          :visible.sync="showCompanyDataDrawer"
          size="50%"
          direction="ltr">
        <p style="font-weight: bold;font-size: 14px;margin-left: 10px">当前企业信贷数据 &nbsp;&nbsp;[{{ this.companyData.length }}]</p>
        <el-row style="padding: 10px 20px;font-size: 12px">
          <el-table
              :data="companyData"
              stripe
              height="580"
              :cell-style="()=>{return 'padding: 0;'}"
              :header-row-style="()=>{return 'padding: 0;'}"
              :header-cell-style="()=>{return 'padding: 5px 0;font-size:12px'}"
              style="width: 100%;font-size: 12px">
            <el-table-column
                prop="comCode"
                label="代号"
                width="80">
            </el-table-column>
            <el-table-column
                prop="grade"
                label="评级"
                width="60">
            </el-table-column>
            <el-table-column
                prop="score"
                label="得分"
                width="60">
            </el-table-column>
            <el-table-column
                prop="creditLimit"
                label="信贷额(万)"
                width="90">
              <template slot-scope="scope">
                <span v-show="scope.row.loss">-----</span>
                <span v-show="!scope.row.loss">{{ scope.row.creditLimit }}</span>
              </template>
            </el-table-column>
            <el-table-column
                prop="interestRate"
                label="年息率(%)"
                width="90">
              <template slot-scope="scope">
                <span v-show="scope.row.loss">-----</span>
                <span v-show="!scope.row.loss">{{ (scope.row.interestRate*100).toFixed(2) }}</span>
              </template>
            </el-table-column>
            <el-table-column
                prop="repayRate"
                label="还贷概率(%)"
                width="90">
              <template slot-scope="scope">
                <span v-show="scope.row.loss">-----</span>
                <span v-show="!scope.row.loss">{{ (scope.row.repayRate*100).toFixed(2) }}</span>
              </template>
            </el-table-column>
            <el-table-column
                prop="loss"
                label="流失?"
                min-width="90">
              <template slot-scope="scope">
                <span v-show="scope.row.loss" style="color: red;font-weight: bold;font-size: 14px">{{ scope.row.loss? 'Yes': 'No' }}</span>
                <span v-show="!scope.row.loss" style="color: limegreen;font-weight: bold;font-size: 14px">{{ scope.row.loss? 'Yes': 'No' }}</span>
              </template>
            </el-table-column>
            <el-table-column
                prop="isRepay"
                label="还贷?"
                min-width="90">
              <template slot-scope="scope">
                <span v-show="scope.row.loss">-----</span>
                <span v-show="!scope.row.loss && !scope.row.isRepay" style="color: red;font-weight: bold;font-size: 14px">{{ scope.row.isRepay? 'Yes': 'No' }}</span>
                <span v-show="!scope.row.loss && scope.row.isRepay" style="color: limegreen;font-weight: bold;font-size: 14px">{{ scope.row.isRepay? 'Yes': 'No' }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-drawer>
    </el-row>

  </div>
</template>

<script>
  import { companyData } from '@/data/companyData';

  export default {
    name: "SimulationSystem",
    data: function () {
      return {
        // global
        isStart: false,                   // 是否已开始
        isPause: false,                   // 是否暂停
        singleLock: false,                // 单线程锁
        showCompanyDataDrawer: false,     // 显示企业数据抽屉

        // 企业数据
        companyData: [],

        // 输入数据
        inputData: {
          iterN: 100,                               // 总迭代次数
          creditTotal: 10000,                       // 银行信贷总额 (万)

          modelSaveClientProbabilitySelect: 0,      // 挽留概率模型 - 选择
          modelSaveClientProbabilityList: [
            {label: 'model1', value: 0, func: this.modelSaveClientProbability_1, desc: "基于当前流失率"},
            {label: 'model2', value: 1, func: this.modelSaveClientProbability_2, desc: "基于企业评分"},
          ],    // 挽留概率模型 - 可选项
          maxSaveClientTimes: 3,                    // 最大挽留次数 (0 ~ 10)
        },

        // 输出数据
        outputData: {},

      }
    },
    methods: {
      // 初始化企业数据 (Init)
      initCompanyData: function () {
        this.companyData = JSON.parse(JSON.stringify(companyData));
      },

      // 初始化输出数据 (Init)
      initOutputData: function () {
        this.outputData = {
          totalClientA: this.companyData.filter(item=>{return item.grade === 'A'}).length,      // A客户总数
          totalClientB: this.companyData.filter(item=>{return item.grade === 'B'}).length,      // B客户总数
          totalClientC: this.companyData.filter(item=>{return item.grade === 'C'}).length,      // C客户总数

          iterNow: 0,                                   // 当前迭代次数
          creditBalance: this.inputData.creditTotal,    // 信贷余额池
          wastageClientA: 0,                            // A客户流失数
          wastageClientB: 0,                            // B客户流失数
          wastageClientC: 0,                            // C客户流失数
          wastageRateClientA: [],                       // A客户流失率时序表 (%)
          wastageRateClientB: [],                       // B客户流失率时序表 (%)
          wastageRateClientC: [],                       // C客户流失率时序表 (%)
          repayRate: [],                                // 还贷率时序列表    (%)
          totalRevenue: [],                             // 总收益时序列表    (万)
        }
      },

      // 开始仿真 (SingleThread)
      startSimulation: async function () {
        // 0. 判断是否有仿真线程在执行, 是则等待对应线程释放锁
        while (this.singleLock) {
          this.isStart = false;
          await this.sleep(100);
        }
        this.isStart = true;
        this.singleLock = true;

        // 0. 判断企业数据是否导入

        // 1. 初始化部分企业数据
        this.initCompanyData();

        // 2. 初始化输出数据
        this.initOutputData();

        // 3. 开始执行
        while (this.outputData.iterNow < this.inputData.iterN) {
          if (this.isStart) {
            while (this.isPause && this.isStart) {
              await this.sleep(100);
            }
            this.oneIterFunc();
            await this.sleep(30);
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

      // 迭代函数 (Core)
      oneIterFunc: function () {
        // 1. 遍历企业跑基本流程
        for (let comp_idx=0; comp_idx<this.companyData.length; comp_idx++) {
          let comp = this.companyData[comp_idx];

          // 仅统计未流失的客户
          if (!comp.loss) {
            // 在最大挽留次数内挽留
            let loss=false;
            let saveTimes=0;
            for (saveTimes=0; saveTimes<this.inputData.maxSaveClientTimes; saveTimes++) {
              // 1. 流失概率模型  =>  流失率
              loss = Math.random() < this.modelLossClientProbability(comp.grade, comp.interestRate);
              if (loss) {
                loss = false;

                // 1.1 挽留概率模型  => 挽留率  =>  挽留行为模拟
                let save =  Math.random() < this.inputData.modelSaveClientProbabilityList[this.inputData.modelSaveClientProbabilitySelect].func(comp);

                // 1.2 挽留?  =>  挽留策略模型  =>  调整 T2  => 跳至 Step1
                if (save) {
                  comp.interestRate = this.modelSaveClientMethod(comp);
                }
                else {
                  loss = true;
                  break;
                }
              }
              else {
                break;
              }
            }

            // 仅当最后一次更新 T2, 需要再跑一遍流失流程
            if (!loss && this.inputData.maxSaveClientTimes === saveTimes) {
              loss = Math.random() < this.modelLossClientProbability(comp.grade, comp.interestRate);
            }

            // 依然流失，则直接丢弃该客户, 跳出概企业的迭代
            if (loss) {
              comp.loss = true;
              this.outputData.creditBalance += comp.creditLimit;
              switch (comp.grade) {
                case "A":
                  this.outputData.wastageClientA++;
                  break;
                case "B":
                  this.outputData.wastageClientB++;
                  break;
                case "C":
                  this.outputData.wastageClientC++;
                  break;
              }
              break;
            }

            // 还贷概率模型  =>  还贷率  =>  还贷行为模拟  => 更新是否还贷 h
            comp.isRepay = Math.random() < this.modelRepayProbability(comp);

            // 负反馈?
          }
        }

        // 2. 更新所有时序表 (wastageRateClientA/B/C, repayRate, totalRevenue)
        this.outputData.wastageRateClientA.push(this.outputData.wastageClientA / this.outputData.totalClientA);
        this.outputData.wastageRateClientB.push(this.outputData.wastageClientB / this.outputData.totalClientB);
        this.outputData.wastageRateClientC.push(this.outputData.wastageClientC / this.outputData.totalClientC);
        this.outputData.repayRate.push(this.companyData.filter(comp=>{return comp.isRepay}).length / this.companyData.length);
        this.outputData.totalRevenue.push(eval(this.companyData.map(comp=>{
          if (comp.loss) {
            return 0;
          }
          return comp.isRepay? comp.creditLimit*comp.interestRate: -comp.creditLimit;
        }).join("+")));
      },

      // 模型库 (Model)
      // 流失概率模型
      modelLossClientProbability: function (compType, interestRate) {
        switch (compType) {
          case 'A':
            return -76.41*(interestRate**2) + 21.984*interestRate - 0.6971;
          case 'B':
            return -67.933*(interestRate**2) + 20.207*interestRate - 0.6504;
          case 'C':
            return -63.942*(interestRate**2) + 19.569*interestRate - 0.6393;
        }
      },
      // 挽留概率模型_1
      modelSaveClientProbability_1: function (comp) {
        console.log(comp);
        return (Math.random()+4)/5;
      },
      // 挽留概率模型_2
      modelSaveClientProbability_2: function (comp) {
        console.log(comp);
        return (Math.random()+1)/2;
      },
      // 挽留策略模型
      modelSaveClientMethod: function (comp) {
        return comp.interestRate * 0.8;
      },
      // 还款概率模型
      modelRepayProbability: function (comp) {
        console.log(comp);
        return (Math.random()+4)/5;
      },


      // 睡眠 (Tools)
      sleep: function (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
      },
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