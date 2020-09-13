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

          <!-- 初始化分配系统 -->
          <el-popover
              placement="bottom-start"
              width="400"
              trigger="hover">
            <el-row style="font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif">
              <el-row style="margin-bottom: 20px">
                <span style="font-size: 12px;margin: 0 5px;margin: 0 5px">银行总贷额(万): </span>
                <el-input-number style="max-width: 100px;margin: 0 5px" size="mini" v-model="inputData.creditTotal" controls-position="right" :min="0" :max="100000" :step="100" :step-strictly="true" :disabled="isStart"></el-input-number>
                <el-tooltip class="tooltip-item" effect="dark" placement="right-start">
                  <div slot="content" style="font-family: 'Microsoft YaHei'">
                    银行的总贷额<br/>
                    即计划对这批企业所贷出的总额<br/>
                    总贷额 ∈ [0, 10亿]
                  </div>
                  <i class="el-icon-info" style="margin-left: 10px"></i>
                </el-tooltip>
              </el-row>
              <el-row style="margin-bottom: 20px">
                <span style="font-size: 12px;margin: 0 5px;margin: 0 5px">首次贷额百分比: </span>
                <el-input-number style="max-width: 100px;margin: 0 5px" size="mini" v-model="inputData.creditAllocateInit" controls-position="right" :min="0.6" :max="1" :step="0.01" :step-strictly="true" :disabled="isStart"></el-input-number>
                <el-tooltip class="tooltip-item" effect="dark" placement="right-start">
                  <div slot="content" style="font-family: 'Microsoft YaHei'">
                    首次贷额百分比<br/>
                    即初始化准备分配总贷额中的百分之几<br/>
                    如总贷额为 '1亿'，占比为 '0.9'<br/>
                    即首次仅给企业分配 '9000万'<br/>
                    剩余 '1000万' 为当前银行剩余贷额<br/>
                    用作负反馈系统中的调整<br/>
                    占比 ∈ [0.6, 1]
                  </div>
                  <i class="el-icon-info" style="margin-left: 10px"></i>
                </el-tooltip>
              </el-row>
              <el-row style="margin-bottom: 20px">
                <p style="color: darkgray">初始化贷额分配比
                  <el-tooltip class="tooltip-item" effect="dark" placement="right-start">
                    <div slot="content" style="font-family: 'Microsoft YaHei'">
                      初始化贷额分配比<br/>
                      即给不同评级的企业首次分配贷额的比例<br/>
                      最终金额会向下取整为万<br/>
                      若超过 100W, 则直接取 100W<br/>
                      A+B+C = 1
                    </div>
                    <i class="el-icon-info" style="margin-left: 10px"></i>
                  </el-tooltip>
                </p>
                <span style="font-size: 12px;margin: 0 5px;margin: 0 5px">A:B:C = </span>
                <el-input-number style="max-width: 100px" size="mini" v-model="inputData.proportionInitClientA" controls-position="right" :min="0" :max="1" :step="0.01" :step-strictly="true" :disabled="isStart"></el-input-number>
                <span> : </span>
                <el-input-number style="max-width: 100px;margin: 0 5px" size="mini" v-model="inputData.proportionInitClientB" controls-position="right" :min="0" :max="1" :step="0.01" :step-strictly="true" :disabled="isStart"></el-input-number>
                <span> : </span>
                <el-input-number style="max-width: 100px;margin: 0 5px" size="mini" v-model="inputData.proportionInitClientC" controls-position="right" :min="0" :max="1" :step="0.01" :step-strictly="true" :disabled="isStart"></el-input-number>
              </el-row>
              <el-row>
                <p style="color: darkgray">初始化利率
                  <el-tooltip class="tooltip-item" effect="dark" placement="right-start">
                    <div slot="content" style="font-family: 'Microsoft YaHei'">
                      初始化利率<br/>
                      即给不同评级的企业的首次利率 T2<br/>
                      T2 ∈ [0.04, 0.15]
                    </div>
                    <i class="el-icon-info" style="margin-left: 10px"></i>
                  </el-tooltip>
                </p>
                <span style="font-size: 12px;margin: 0 5px">A,B,C = </span>
                <el-input-number style="max-width: 100px;" size="mini" v-model="inputData.interestRateInitClientA" controls-position="right" :min="0.04" :max="0.15" :step="0.01" :step-strictly="true" :disabled="isStart"></el-input-number>
                <span> : </span>
                <el-input-number style="max-width: 100px;margin: 0 5px" size="mini" v-model="inputData.interestRateInitClientB" controls-position="right" :min="0.04" :max="0.15" :step="0.01" :step-strictly="true" :disabled="isStart"></el-input-number>
                <span> : </span>
                <el-input-number style="max-width: 100px;margin: 0 5px" size="mini" v-model="inputData.interestRateInitClientC" controls-position="right" :min="0.04" :max="0.15" :step="0.01" :step-strictly="true" :disabled="isStart"></el-input-number>
              </el-row>
            </el-row>
            <el-button slot="reference" size="mini" style="margin-left: 35px"><i class="el-icon-set-up"></i> 初始化分配系统</el-button>
          </el-popover>

          <!-- 流失挽留系统 -->
          <el-popover
              placement="bottom-start"
              width="450"
              trigger="hover">
              <el-row style="font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif">
                <el-row style="margin-bottom: 20px">
                  <span style="font-size: 12px;margin: 0 5px">挽留概率模型: </span>
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
                  <el-input-number style="max-width: 90px;margin-left: 10px" size="mini" v-model="inputData.modelSaveClientProbabilityConst" controls-position="right" :min="0" :max="1" :step="0.01" :step-strictly="true" :disabled="isStart"></el-input-number>
                  <el-tooltip class="tooltip-item" effect="dark" placement="right-start">
                    <div slot="content" style="font-family: 'Microsoft YaHei'">
                      若选择 1.固定概率挽留<br/>
                      则此处为输入为固定概率<br/>
                      <br/>
                      若选择 2.高分高概率挽留<br/>
                      则此处为基准概率 P<br/>
                      最终挽留概率为 P + (1-P)*(S/100)
                    </div>
                    <i class="el-icon-info" style="margin-left: 10px"></i>
                  </el-tooltip>
                </el-row>
                <el-row style="margin-bottom: 20px">
                  <span style="font-size: 12px;margin: 0 5px">挽留策略利率下调系数: </span>
                  <el-input-number style="max-width: 100px" size="mini" v-model="inputData.saveClientInterestRateReduce" controls-position="right" :min="0.5" :max="1" :step="0.001" :step-strictly="true" :disabled="isStart"></el-input-number>
                  <el-tooltip class="tooltip-item" effect="dark" placement="right-start">
                    <div slot="content" style="font-family: 'Microsoft YaHei'">
                      挽留策略即调低企业利率<br/>
                      挽留策略模型: T2` = k*T2 <br/>
                      此处下调系数指 K <br/>
                      K ∈ (0, 1)
                    </div>
                    <i class="el-icon-info" style="margin-left: 10px"></i>
                  </el-tooltip>
                </el-row>
                <el-row>
                  <span style="font-size: 12px;margin: 0 5px">最大挽留次数: </span>
                  <el-input-number style="max-width: 100px" size="mini" v-model="inputData.maxSaveClientTimes" controls-position="right" :min="0" :max="10" :step="1" :step-strictly="true" :disabled="isStart"></el-input-number>
                  <el-tooltip class="tooltip-item" effect="dark" placement="right-start">
                    <div slot="content" style="font-family: 'Microsoft YaHei'">
                      即尝试对在模拟中流失的客户<br/>
                      进行挽留的最大次数<br/>
                      挽留次数 ∈ [0, 10]
                    </div>
                    <i class="el-icon-info" style="margin-left: 10px"></i>
                  </el-tooltip>
                </el-row>
              </el-row>
            <el-button slot="reference" size="mini" style="margin-left: 35px"><i class="el-icon-set-up"></i> 流失挽留系统</el-button>
          </el-popover>

          <!-- 负反馈调节系统 -->
          <el-popover
              placement="bottom-start"
              width="500"
              trigger="hover">
            <el-row style="font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif">
              <el-row style="margin-bottom: 20px">
                <span style="font-size: 12px;margin: 0 5px">滑动窗口大小: </span>
                <el-input-number style="max-width: 100px" size="mini" v-model="inputData.modelFeebBackWindowSize" controls-position="right" :min="3" :max="30" :step="3" :step-strictly="true" :disabled="isStart"></el-input-number>
                <el-tooltip class="tooltip-item" effect="dark" placement="right-start">
                  <div slot="content" style="font-family: 'Microsoft YaHei'">
                    滑动窗口大小<br/>
                    即负反馈系统中的奖罚窗口长度<br/>
                    需为4的倍数<br/>
                    Size ∈ [4, 40]
                  </div>
                  <i class="el-icon-info" style="margin-left: 10px"></i>
                </el-tooltip>
              </el-row>
              <el-row style="margin-bottom: 20px">
                <p style="color: darkgray">高级奖励
                  <el-tooltip class="tooltip-item" effect="dark" placement="right-start">
                    <div slot="content" style="font-family: 'Microsoft YaHei'">
                      窗口下违约次数为 0：<br/>
                    </div>
                    <i class="el-icon-info" style="margin-left: 10px"></i>
                  </el-tooltip>
                </p>
                <span style="font-size: 12px;margin: 0 5px;margin: 0 5px">额度调节系数: </span>
                <el-input-number style="max-width: 100px;margin-right: 50px" size="mini" v-model="inputData.modelFeedBackReward.creditLimitUp" controls-position="right" :min="-1" :max="1" :step="0.01" :step-strictly="true" :disabled="isStart"></el-input-number>
                <span style="font-size: 12px;margin: 0 5px;margin: 0 5px">利率调节系数: </span>
                <el-input-number style="max-width: 100px;margin-right: 50px" size="mini" v-model="inputData.modelFeedBackReward.interestRateUp" controls-position="right" :min="-1" :max="1" :step="0.01" :step-strictly="true" :disabled="isStart"></el-input-number>
              </el-row>
              <el-row style="margin-bottom: 20px">
                <p style="color: darkgray">低级奖励
                  <el-tooltip class="tooltip-item" effect="dark" placement="right-start">
                    <div slot="content" style="font-family: 'Microsoft YaHei'">
                      0 ＜ 窗口下违约次数 ≤ winSize/2：<br/>
                    </div>
                    <i class="el-icon-info" style="margin-left: 10px"></i>
                  </el-tooltip>
                </p>
                <span style="font-size: 12px;margin: 0 5px;margin: 0 5px">额度调节系数: </span>
                <el-input-number style="max-width: 100px;margin-right: 50px" size="mini" v-model="inputData.modelFeedBackPunishLevel1.creditLimitUp" controls-position="right" :min="-1" :max="1" :step="0.01" :step-strictly="true" :disabled="isStart"></el-input-number>
                <span style="font-size: 12px;margin: 0 5px;margin: 0 5px">利率调节系数: </span>
                <el-input-number style="max-width: 100px;margin-right: 50px" size="mini" v-model="inputData.modelFeedBackPunishLevel1.interestRateUp" controls-position="right" :min="-1" :max="1" :step="0.01" :step-strictly="true" :disabled="isStart"></el-input-number>
              </el-row>
              <el-row style="margin-bottom: 20px">
                <p style="color: darkgray">低级惩罚
                  <el-tooltip class="tooltip-item" effect="dark" placement="right-start">
                    <div slot="content" style="font-family: 'Microsoft YaHei'">
                      winSize/2 ＜ 窗口下违约次数 ≤ 3*winSize/4：<br/>
                    </div>
                    <i class="el-icon-info" style="margin-left: 10px"></i>
                  </el-tooltip>
                </p>
                <span style="font-size: 12px;margin: 0 5px;margin: 0 5px">额度调节系数: </span>
                <el-input-number style="max-width: 100px;margin-right: 50px" size="mini" v-model="inputData.modelFeedBackPunishLevel2.creditLimitUp" controls-position="right" :min="-1" :max="1" :step="0.01" :step-strictly="true" :disabled="isStart"></el-input-number>
                <span style="font-size: 12px;margin: 0 5px;margin: 0 5px">利率调节系数: </span>
                <el-input-number style="max-width: 100px;margin-right: 50px" size="mini" v-model="inputData.modelFeedBackPunishLevel2.interestRateUp" controls-position="right" :min="-1" :max="1" :step="0.01" :step-strictly="true" :disabled="isStart"></el-input-number>
              </el-row>
              <el-row >
                <p style="color: darkgray">高级惩罚
                  <el-tooltip class="tooltip-item" effect="dark" placement="right-start">
                    <div slot="content" style="font-family: 'Microsoft YaHei'">
                      3*winSize/4 ＜ 窗口下违约次数：<br/>
                    </div>
                    <i class="el-icon-info" style="margin-left: 10px"></i>
                  </el-tooltip>
                </p>
                <span style="font-size: 12px;margin: 0 5px;margin: 0 5px">额度调节系数: </span>
                <el-input-number style="max-width: 100px;margin-right: 50px" size="mini" v-model="inputData.modelFeedBackPunishLevel3.creditLimitUp" controls-position="right" :min="-1" :max="1" :step="0.01" :step-strictly="true" :disabled="isStart"></el-input-number>
                <span style="font-size: 12px;margin: 0 5px;margin: 0 5px">利率调节系数: </span>
                <el-input-number style="max-width: 100px;margin-right: 50px" size="mini" v-model="inputData.modelFeedBackPunishLevel3.interestRateUp" controls-position="right" :min="-1" :max="1" :step="0.01" :step-strictly="true" :disabled="isStart"></el-input-number>
              </el-row>
            </el-row>
            <el-button slot="reference" size="mini" style="margin-left: 35px"><i class="el-icon-set-up"></i> 负反馈调节系统</el-button>
          </el-popover>


        </el-row>

        <!-- 按键控制台 -->
        <el-row style="margin: 30px 0 10px 0">
          <el-col :span="5">
            <el-button style="margin-left: 40px" size="mini" type="primary" @click="showCompanyDataDrawer = true"><i class="el-icon-s-marketing"></i> 企业数据</el-button>
            <el-button size="mini" type="primary" @click="initCompanyData" :disabled="isStart"><i class="el-icon-refresh"></i> 初始化数据</el-button>
          </el-col>
          <el-col :span="8">
            <el-button style="margin-left: 40px" size="mini" type="success" @click="startSimulation" :disabled="isStart"><i class="el-icon-caret-right"></i> 开始</el-button>
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

        <!-- 迭代次数，总余额，总还贷率，总盈利, 迭代过程最大总盈利  -->
        <el-row style="margin: 20px 0">
          <el-col :span="3">
            <span style="font-size: 12px">当前迭代次数: </span>
            <span style="font-weight: bold;font-size: 18px">{{ outputData.iterNow }}</span>
          </el-col>

          <el-col :span="4">
            <span style="font-size: 12px">当前银行剩余贷额: </span>
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

          <el-col :span="3">
            <span style="font-size: 12px">当前利润率: </span>
            <span style="font-weight: bold;font-size: 18px">
              {{ ((outputData.totalRevenue.length===0?0: outputData.totalRevenue.slice(-1)/(inputData.creditTotal-outputData.creditBalance))*100).toFixed(2) }}
            </span>
            <span style="font-size: 12px">%</span>
          </el-col>

          <el-col :span="5">
            <span style="font-size: 12px;margin-left: 25px">最后1/10次迭代平均利润: </span>
            <span style="font-weight: bold;font-size: 18px">
              {{ outputData.pre10AvgRevenue }}
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
              {{ outputData.wastageRateClientB.length>0? (outputData.wastageRateClientB.slice(-1)[0]*100).toFixed(2): '0.00' }}
            </span>
            <span> %</span>
          </el-col>

          <el-col :span="4">
            <span style="font-size: 12px">C级客户流失率: </span>
            <span style="font-weight: bold;font-size: 18px">
              {{ outputData.wastageRateClientC.length>0? (outputData.wastageRateClientC.slice(-1)[0]*100).toFixed(2): '0.00' }}
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

        <!-- 绘图 -->
        <el-row style="border-top: solid 0.3px rgba(200,200,200,0.5);border-bottom: solid 0.3px rgba(200,200,200,0.5);padding: 20px 0">
          <el-col :span="8">
            <chart ref="tableTotalRevenue" :options="tableTotalRevenue" :auto-resize="true" style="width: 94%;max-height: 320px;"></chart>
          </el-col>
          <el-col :span="8">
            <chart ref="tableRepayRate" :options="tableRepayRate" :auto-resize="true" style="width: 94%;max-height: 320px;"></chart>
          </el-col>
          <el-col :span="8">
            <chart ref="tableLossRate" :options="tableLossRate" :auto-resize="true" style="width: 94%;max-height: 320px;"></chart>
          </el-col>
        </el-row>

      </el-card>
    </el-row>

    <!--  companyData  -->
    <el-row>
      <el-drawer
          :visible.sync="showCompanyDataDrawer"
          size="75%"
          direction="ltr">
        <p style="font-weight: bold;font-size: 14px;margin-left: 10px">当前企业信贷数据 &nbsp;&nbsp;[{{ this.companyData.length }}] <el-button style="float: right;margin-right: 15px" type="text" size="mini" @click="dumpCSV"><i class="el-icon-download"></i>导出csv</el-button></p>
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
                width="60">
            </el-table-column>
            <el-table-column
                prop="grade"
                label="评级"
                width="70"
                :filters="[
                  { text: 'A', value: 'A' },
                  { text: 'B', value: 'B' },
                  { text: 'C', value: 'C' },
                  { text: 'D', value: 'D' },
                ]"
                :filter-method="(value, row)=>{return row.grade===value}">
            </el-table-column>
            <el-table-column
                prop="score"
                label="得分"
                width="60">
              <template slot-scope="scope">
                <span>{{ scope.row.score.toFixed(2) }}</span>
              </template>
            </el-table-column>
            <el-table-column
                prop="inf"
                label="影响因子"
                width="70">
              <template slot-scope="scope">
                <span>{{ (scope.row.inf*100).toFixed(2) }}</span>
              </template>
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
                prop="creditLimit"
                label="1/10平均信贷额(万)"
                width="130">
              <template slot-scope="scope">
                <span v-if="scope.row.loss">-----</span>
                <span v-else>{{ calTools(scope.row, 'creditLimit') }}</span>
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
                prop="interestRate"
                label="1/10平均年利率(%)"
                width="130">
              <template slot-scope="scope">
                <span v-if="scope.row.loss">-----</span>
                <span v-else>{{ calTools(scope.row, 'interestRate') }}</span>
              </template>
            </el-table-column>
<!--            <el-table-column-->
<!--                prop="interestRate"-->
<!--                label="流失率(%)"-->
<!--                width="90">-->
<!--              <template slot-scope="scope">-->
<!--                <span>{{ (modelLossClientProbability(scope.row.grade, scope.row.interestRate)*100).toFixed(2) }}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
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
                prop="repayRate"
                label="punishKey"
                width="90">
              <template slot-scope="scope">
                <span v-show="scope.row.loss">-----</span>
                <span v-show="!scope.row.loss">{{ scope.row.repayWindow.filter(x=>{return x===1}).length }}</span>
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
  import CsvExportor from "csv-exportor";

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
          iterN: 500,                               // 总迭代次数

          // 1. 初始化分配系统
          creditTotal: 10000,                       // 银行信贷总额 (万)
          creditAllocateInit: 0.8,                  // 银行初始化信贷额分配百分比
          proportionInitClientA: 0.5,               // A客户初始化分配比例
          proportionInitClientB: 0.3,               // B客户初始化分配比例
          proportionInitClientC: 0.2,               // C客户初始化分配比例
          interestRateInitClientA: 0.04,            // A客户初始化利率
          interestRateInitClientB: 0.05,            // B客户初始化利率
          interestRateInitClientC: 0.06,            // C客户初始化利率


          // 2. 流失挽留系统
          modelSaveClientProbabilityConst: 0.990,   // 挽留概率模型 - 固定概率
          modelSaveClientProbabilitySelect: 1,      // 挽留概率模型 - 选择
          modelSaveClientProbabilityList: [
            {label: '1. 固定概率挽留', value: 0, func: this.modelSaveClientProbability_1, desc: "固定挽留率"},
            {label: '2. 高分高概率挽留', value: 1, func: this.modelSaveClientProbability_2, desc: "基于企业评分来纠正挽留率"},
          ],    // 挽留概率模型 - 可选项
          maxSaveClientTimes: 5,                    // 最大挽留次数 (0 ~ 10)
          saveClientInterestRateReduce: 0.87,      // 挽留策略模型 - 利率下调系数

          // 3. 负反馈调节系统 - 滑动窗口奖罚模型
          modelFeebBackWindowSize: 6,
          modelFeedBackReward: {
            creditLimitUp: -0.05,
            interestRateUp: 0.14,
          },
          modelFeedBackPunishLevel1: {
            creditLimitUp: -0.02,
            interestRateUp: 0.07,
          },
          modelFeedBackPunishLevel2: {
            creditLimitUp: -0.20,
            interestRateUp: -0.07,
          },
          modelFeedBackPunishLevel3: {
            creditLimitUp: -0.40,
            interestRateUp: -0.14,
          },
        },

        // 输出数据
        outputData: {},

      }
    },
    computed: {
      // 总收益图表
      tableTotalRevenue: function () {
        return {
          title: {
            left: 'right',
            text: '总收益迭代曲线',
            textStyle: {
              fontSize: 14,
            },
          },
          xAxis: {
            type: 'category',
            data: this.outputData.totalIter,
            name: 'Iter',
            nameRotate: 0,
          },
          yAxis: {
            type: 'value',
            name: '总收益 (万)',
          },
          series: [{
            data: this.outputData.totalRevenue,
            type: 'line',
            smooth: true
          }],
          dataZoom: [{
            type: 'inside',
            start: 0,
            end: this.inputData.iterN,
          }, {
            start: 0,
            end: this.outputData.iterN,
            handleSize: '80%',
            handleStyle: {
              color: '#fff',
              shadowBlur: 2,
              shadowColor: 'rgba(0, 0, 0, 0.6)',
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
          }],
          tooltip: {
            trigger: 'axis',
            position: function (pt) {
              return [pt[0], '10%'];
            }
          },
        };
      },
      // 总还贷率图表
      tableRepayRate: function () {
        return {
          title: {
            text: '总还贷率迭代曲线',
            left: 'right',
            textStyle: {
              fontSize: 14,
            },
          },
          xAxis: {
            type: 'category',
            data: this.outputData.totalIter,
            name: 'Iter',
            nameRotate: 0,
          },
          yAxis: {
            type: 'value',
            name: '        总还贷率 (x100%)',
          },
          series: [{
            data: this.outputData.repayRate,
            type: 'line',
            smooth: true
          }],
          dataZoom: [{
            type: 'inside',
            start: 0,
            end: this.inputData.iterN,
          }, {
            start: 0,
            end: this.outputData.iterN,
            handleSize: '80%',
            handleStyle: {
              color: '#fff',
              shadowBlur: 2,
              shadowColor: 'rgba(0, 0, 0, 0.6)',
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
          }],
          tooltip: {
            trigger: 'axis',
            position: function (pt) {
              return [pt[0], '10%'];
            }
          },
        };

      },
      // ABC流失率图表
      tableLossRate: function () {
        return {
          title: {
            text: 'ABC流失率迭代曲线',
            left: 'right',
            textStyle: {
              fontSize: 14,
            },
          },
          legend: {
            show: true,
            data: ['Client A', 'Client B', 'Client C'],
            itemHeight: 8,
            textStyle: {
              fontSize: 8,
            },
            left: 'left',
          },
          xAxis: {
            type: 'category',
            data: this.outputData.totalIter,
            name: 'Iter',
            nameRotate: 0,
          },
          yAxis: {
            type: 'value',
            name: '    流失率 (x100%)',
          },
          series: [
            {
              data: this.outputData.wastageRateClientA,
              type: 'line',
              smooth: true,
              name: 'Client A',
            },
            {
              data: this.outputData.wastageRateClientB,
              type: 'line',
              smooth: true,
              name: 'Client B',
            },
            {
              data: this.outputData.wastageRateClientC,
              type: 'line',
              smooth: true,
              name: 'Client C',
            },
          ],
          dataZoom: [{
            type: 'inside',
            start: 0,
            end: this.inputData.iterN,
          }, {
            start: 0,
            end: this.outputData.iterN,
            handleSize: '80%',
            handleStyle: {
              color: '#fff',
              shadowBlur: 2,
              shadowColor: 'rgba(0, 0, 0, 0.6)',
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
          }],
          tooltip: {
            trigger: 'axis',
            position: function (pt) {
              return [pt[0], '10%'];
            }
          },
        };

      },
    },
    methods: {
      // 初始化企业数据 (Init)
      initCompanyData: function () {
        this.companyData = JSON.parse(JSON.stringify(companyData));
        let x = (this.inputData.creditTotal * this.inputData.creditAllocateInit) /
          ((this.inputData.proportionInitClientA * this.companyData.filter(comp=>{return comp.grade==='A'}).length) +
          (this.inputData.proportionInitClientB * this.companyData.filter(comp=>{return comp.grade==='B'}).length) +
          (this.inputData.proportionInitClientC * this.companyData.filter(comp=>{return comp.grade==='C'}).length));
        let creditLimitInitMap = {
          'A': Math.floor(this.inputData.proportionInitClientA * x) > 100? 100: Math.floor(this.inputData.proportionInitClientA * x),
          'B': Math.floor(this.inputData.proportionInitClientB * x) > 100? 100: Math.floor(this.inputData.proportionInitClientB * x),
          'C': Math.floor(this.inputData.proportionInitClientC * x) > 100? 100: Math.floor(this.inputData.proportionInitClientC * x),
        };
        let crepayRateInitMap = {
          'A': this.inputData.interestRateInitClientA,
          'B': this.inputData.interestRateInitClientB,
          'C': this.inputData.interestRateInitClientC,
        };
        this.companyData.forEach(comp=>{
          comp.creditLimit = creditLimitInitMap[comp.grade];
          comp.interestRate = crepayRateInitMap[comp.grade];
          comp.repayRate = this.modelRepayProbability(comp);
          comp.repayWindow = [];
          comp.creditLimitList = [];
          comp.interestRateList = [];
          comp.windowNum = 0;
        });
      },

      // 初始化输出数据 (Init)
      initOutputData: function () {
        let totalIter = [];
        let creditBalance = this.inputData.creditTotal - eval(this.companyData.map(comp=>{
          return comp.creditLimit;
        }).join('+'));

        for (let i=0; i<this.inputData.iterN; i++) {
          totalIter.push(i);
        }

        this.outputData = {
          totalClientA: this.companyData.filter(item=>{return item.grade === 'A'}).length,      // A客户总数
          totalClientB: this.companyData.filter(item=>{return item.grade === 'B'}).length,      // B客户总数
          totalClientC: this.companyData.filter(item=>{return item.grade === 'C'}).length,      // C客户总数

          iterNow: 0,                                   // 当前迭代次数
          maxRevenue: 0,                                // 迭代过程最大总盈利
          pre10AvgRevenue: 0,                           // 最后 1/10 次迭代的平均盈利
          pre10AvgRevenueRate: 0,                       // 最后 1/10 次迭代的平均利润率
          creditBalance: creditBalance,                 // 信贷余额池
          wastageClientA: 0,                            // A客户流失数
          wastageClientB: 0,                            // B客户流失数
          wastageClientC: 0,                            // C客户流失数
          totalIter: totalIter,                         // 总迭代时序表 - 仅用于绘图
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
            // this.sleep(30);
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
            comp.repayRate = this.modelRepayProbability(comp);
            comp.isRepay = Math.random() < comp.repayRate;
            comp.creditLimitList.push(comp.creditLimit);
            comp.interestRateList.push(comp.interestRate);
            comp.repayWindow.push(comp.isRepay? 0: 1);
            if (comp.repayWindow.length>this.inputData.modelFeebBackWindowSize) {
              comp.repayWindow.splice(0, 1);
            }

            // 负反馈
            if (comp.windowNum) {
              comp.windowNum--;
            }
            else {
              this.modelFeebBack(comp);
            }
          }
        }

        // 2. 更新所有时序表 (wastageRateClientA/B/C, repayRate, totalRevenue)
        this.outputData.wastageRateClientA.push(this.outputData.wastageClientA / this.outputData.totalClientA);
        this.outputData.wastageRateClientB.push(this.outputData.wastageClientB / this.outputData.totalClientB);
        this.outputData.wastageRateClientC.push(this.outputData.wastageClientC / this.outputData.totalClientC);
        let repayRate_Z = this.companyData.filter(comp=>{return !comp.loss && comp.isRepay}).length;
        let repayRate_M = this.companyData.filter(item=>{return !item.loss}).length;
        this.outputData.repayRate.push(repayRate_M>0? repayRate_Z/repayRate_M: 0 );
        this.outputData.pre10AvgRevenue = this.outputData.totalRevenue.length>0?
          (eval(this.outputData.totalRevenue.slice(-this.inputData.iterN/10).join('+'))/(this.inputData.iterN/10)).toFixed(2):
          '0.00';
        this.outputData.pre10AvgRevenueRate = this.outputData.pre10AvgRevenue / (this.inputData.creditTotal - this.outputData.creditBalance);

        let revenue = eval(this.companyData.map(comp=>{
          if (comp.loss) {
            return 0;
          }
          return comp.isRepay? comp.creditLimit*comp.interestRate: -comp.creditLimit;
        }).join("+"));
        this.outputData.totalRevenue.push(revenue);
        this.outputData.maxRevenue = this.outputData.maxRevenue < revenue? revenue: this.outputData.maxRevenue;
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
        if (comp) {
          // do nothing
        }
        return this.inputData.modelSaveClientProbabilityConst;
      },
      // 挽留概率模型_2
      modelSaveClientProbability_2: function (comp) {
        return this.inputData.modelSaveClientProbabilityConst + (1-this.inputData.modelSaveClientProbabilityConst)*(comp.score/100);
      },
      // 挽留策略模型
      modelSaveClientMethod: function (comp) {
        let interestRate = comp.interestRate * this.inputData.saveClientInterestRateReduce;

        // 越界处理
        if (interestRate < 0.04) {
          interestRate = 0.04;
        }
        return interestRate;
      },
      // 还款概率模型
      modelRepayProbability: function (comp) {
        // let a = [1.16980013, 1.95335773, -0.043264374];
        let a = [8.69025463, -3.89514137, 4.36003504];
        let x = a[0]*(comp.score/100) + a[1] - comp.creditLimit*comp.interestRate - 1/(a[2]*(1-comp.creditLimit*comp.interestRate)+1);
        return 1 / (1 + Math.exp(-x-5));
      },
      // 负反馈信贷策略调节模型
      modelFeebBack: function (comp) {
        let punishKey = eval(comp.repayWindow.join('+'));
        let creditLimitUp;
        let interestRateUp;
        if (punishKey === 1) {
          creditLimitUp = this.inputData.modelFeedBackReward.creditLimitUp;
          interestRateUp = this.inputData.modelFeedBackReward.interestRateUp;
        }
        else if (punishKey <= this.inputData.modelFeebBackWindowSize/3) {
          creditLimitUp = this.inputData.modelFeedBackPunishLevel1.creditLimitUp;
          interestRateUp = this.inputData.modelFeedBackPunishLevel1.interestRateUp;
        }
        else if (punishKey <= 2*this.inputData.modelFeebBackWindowSize/3) {
          creditLimitUp = this.inputData.modelFeedBackPunishLevel2.creditLimitUp;
          interestRateUp = this.inputData.modelFeedBackPunishLevel2.interestRateUp;
        }
        else {
          creditLimitUp = this.inputData.modelFeedBackPunishLevel3.creditLimitUp;
          interestRateUp = this.inputData.modelFeedBackPunishLevel3.interestRateUp;
        }

        creditLimitUp += (comp.score-20)/3000;
        interestRateUp -= comp.score/1000;

        let creditLimitTarget = Math.ceil(comp.creditLimit * (1+creditLimitUp));
        let interestRateTarget = comp.interestRate * (1+interestRateUp);

        // T1 越界处理
        if (creditLimitTarget > 100) {
          creditLimitTarget = 100;
        }
        else if (creditLimitTarget < 10) {
          creditLimitTarget = 10;
        }

        // T1 余贷额池是否有足够多的资金
        let delta = creditLimitTarget - comp.creditLimit;
        // 够就加
        if (this.outputData.creditBalance > delta) {
          this.outputData.creditBalance -= delta;
        }
        // 不够就全给了
        else {
          creditLimitTarget = comp.creditLimit + this.outputData.creditBalance;
          this.outputData.creditBalance = 0;
        }

        // T2 越界处理
        if (interestRateTarget > 0.15) {
          interestRateTarget = 0.15;
        }
        else if (interestRateTarget < 0.04) {
          interestRateTarget = 0.04;
        }

        comp.creditLimit = creditLimitTarget;
        comp.interestRate = interestRateTarget;
      },

      // 睡眠 (Tools)
      sleep: function (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
      },

      // 计算工具 (Tools)
      calTools: function (comp, target) {
        if (target === 'creditLimit') {
          if (comp.creditLimitList.length === 0) return 0;
          return (eval(comp.creditLimitList.slice(-this.inputData.iterN/10).join('+'))/(this.inputData.iterN/10)).toFixed(2);
        }
        else if (target === 'interestRate') {
          if (comp.interestRateList.length === 0) return 0;
          return ((eval(comp.interestRateList.slice(-this.inputData.iterN/10).join('+'))/(this.inputData.iterN/10))*100).toFixed(2);
        }
      },

      // 导出csv (Tools)
      dumpCSV: function () {
        CsvExportor.downloadCsv(
          this.companyData,
          { header: ["comCode", "grade", "score", "creditLimit", "interestRate", "loss", "repayRate", "isRepay", "inf"]},
          "data.csv"
        );
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
  .main-box .tooltip-item {
    font-family: "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  }
</style>
