<template>
  <div id="app">
    <!-- <img src="./assets/logo.png">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
    </ul> -->
    <Upload :config="config" @onError="onError" @uploadFinally="uploadFinally" ref="upload"></Upload>
    <button @click="upload">上传图片</button>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'app',
  data () {
    return {
      config: {
        api: 'https://api.dhb168.com/api.php',
        maxSize: 1,
        maxLength: 3,
        accept: ['png', 'gif', 'jpeg'],
        isReduce: true,
      }
    }
  },
  methods: {
    onError(err) {
      console.log(err)
    },
    upload() {
      // 可自定义
      // 'key' 为要传输的文件 key ，在内部是 FromData().append('key'/* 对应的 key */, /* 文件对象 */)
      // 该 'key' 参数不传默认为 'file'
      this.$refs.upload.upload(this.paramsOptions, 'key')
    },
    paramsOptions() {
      // 这里可以设置其他参数
      let params = new FormData()
      let _this = this
      // 请求配置
      let config = {
        timeout: 1000,
        headers: { 'Content-Type': 'multipart/form-data' }
      }
      return {
        params,
        config
      }
    },
    uploadFinally(args, files) {
      console.log(args, files)
      // 这里可以从 args 集合中知道哪些图片未上传成功，
      // 如果需要重新上传，可以将 files 数组中上传成功的文件删除
      // files.splice(index, 1)
      // 重新调用上传方法
      // this.$refs.upload.upload(this.paramsOptions, 'file')
    }
  }
}
</script>

<style lang="scss">
  body, ul, li{
    padding: 0;
    margin: 0;
  }
  *{ box-sizing: border-box; }
  html{ font-size: 62.5%; }
  .clearFix{ *zoom: 1; }
  .clearFix:after{ content: '\0020'; display: block; height: 0; clear: both; }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>
