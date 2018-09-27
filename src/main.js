import firebase from  './firebase/config'
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Countdown from './Countdown.vue'
import Game from './Game.vue'
import Auth from './components/Auth.vue'
import Wait from './components/Wait.vue'


Vue.config.productionTip = false
Vue.use(VueRouter)


const routes = [
  { path: '/', component: Game },
  { path: '/wait', component: Wait },
  { path: '/auth', component: Auth},
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
  render: createEle => createEle(App),
  created() {
    const currentRoute = this.$router.currentRoute.fullPath;
    this.$router.push('/wait')
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        console.log(user);
        this.$router.push(currentRoute)
      } else {
        this.$router.push('/auth')
      }
     });
  }
}).$mount('#app')
