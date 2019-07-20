import Vue from 'vue'
import App from './App.vue'
import Upload from './components/upload'

Vue.use(Upload)

new Vue({
  el: '#app',
  render: h => h(App)
})
