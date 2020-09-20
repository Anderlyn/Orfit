import Vue from 'vue'
import App from './App.vue'
import Amplify, { Auth } from "aws-amplify"
import awsconfig from "./aws-exports"
import '@aws-amplify/ui-vue';
import 'materialize-css'
import 'materialize-css/dist/css/materialize.min.css'
import 'material-design-icons/iconfont/material-icons.css'
Amplify.configure(awsconfig);

Vue.config.productionTip = false
Auth.currentUserInfo();
new Vue({
  render: h => h(App),
}).$mount('#app')
