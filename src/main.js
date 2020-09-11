import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import ECharts from 'vue-echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/dataZoom';
Vue.use(ElementUI);
Vue.component('chart', ECharts);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
