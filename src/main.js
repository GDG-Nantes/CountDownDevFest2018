import './firebase/config'
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Countdown from './Countdown.vue'
import Game from './Game.vue'


Vue.config.productionTip = false
Vue.use(VueRouter)


const routes = [
  { path: '/', component: Game },
  { path: '/countdown', component: Countdown }
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
  routes // short for `routes: routes`
})


new Vue({
  router,
  render: createEle => createEle(App)
}).$mount('#app')
