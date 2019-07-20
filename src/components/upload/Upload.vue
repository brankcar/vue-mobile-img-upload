<template>
  <div class="upload-row">
    <ul class="uploader clearFix">
      <li><input type="file" @change="listenerInput" :accept="config.acceptString"><div class="add-image"></div></li>
      <li v-for="(file, index) in files" :key="'name_' + index">
        <img v-bind:src="file.path" alt="">
        <span class="delete" @click="deleteFile(index)"></span>
      </li>
    </ul>
  </div>
</template>
<script>
  import axios from 'axios'
  import {
    getFileUrl,
    URLtoImage,
    imagetoCanvas,
    canvasResizetoFile,
    fileResizetoFile
  } from './util'

  const getFileSize = (num) => num / 1024 / 1024

  export default {
    name: "Upload",
    props: {
      config: {
        type: Object,
        default() {
          return {
            api: '',              // 接口地址
            maxSize: -1,          // 文件大小限制；-1 为不限制
            maxLength: -1,        // 文件数量限制，-1 为不限制
            accept: ['*'],        // 文件后缀集合；只允许 image 类型文件，可在配置时传入后缀；未限制后缀类型，如果传入非图片类型的文件后缀可能会出现未知错误
            isReduce: false,      // 是否压缩文件，该配置为 true 时可自动压缩文件，但是只会压缩一次
            isRecursive: false,   // 是否递归压缩文件，如果该配置为 true 将不会抛出图片超出大小警告
            quality: 1,           // 图片压缩质量，范围为 0 - 1.0 的 number 
            isValidateApi: false, // 是否验证 Api 格式
            // 验证 Api 接口的正则表达式，可以自定义配置，在 isValidateApi === true 时该选项才生效
            validateReg: /^(?=^.{3,255})(http(s)?:\/\/)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*$/,
          }
        }
      },
      files: {
        type: Array,
        default() {
          return []
        }
      }
    },
    created() {
      if (
        !this.config.api ||
        (
          this.config.isValidateApi && 
          !(this.config.validateReg.test(this.config.api))
        )
      ) {
        throw new Error("Api cannot be empty or malformed")
        return;
      }
      // 将 accept 数组格式化为 "image/jpeg,image/gif..."
      this.config.acceptString = this.config.accept.map((item) => item = 'image/' + item).join(',')
    },
    methods: {
      // 监听 input ，拿到 file 对象
      listenerInput(event){
        let file = event.target.files[0]
        let _this = this
        let config = _this.config
        let fileObj = {}
        // 判断图片大小是否超出配置
        if (config.maxSize > 0 && getFileSize(file.size) > config.maxSize && !_this.config.isReduce) {
          _this.handlerError({
            num: config.maxSize,
            type: 'size'
          })
          return
        }
        // 判断图片数量是否超出配置
        if (config.maxLength > 0 && _this.files.length > config.maxLength) {
          _this.handlerError({
            num: config.maxLength,
            type: 'length'
          })
          return
        }
        if (_this.config.isReduce) {
          let handler = (res) => _this.config.isRecursive && getFileSize(res.size)
          fileResizetoFile(file, _this.config.quality, handler, function (res) {
            _this.addFileToFiles({
              file: res,
              path: getFileUrl(res)
            })
          })
          event.target.value = ''
          return
        } else {
          _this.addFileToFiles({
            file,
            path: getFileUrl(file)
          })
          event.target.value = ''
        }
      },
      // 添加文件对象到文件集合
      addFileToFiles(obj) {
        let _this = this
        _this.files.push(obj)
      },
      // 在文件集合内删除指定文件
      deleteFile(index) {
        this.files.splice(index, 1)
      },
      // 将错误信息发布给父组件
      handlerError(err) {
        this.$emit('onError', err)
      },
      // 构建配置，上传
      upload(handler, fileKey) {
        let _this = this
        let files = _this.files
        let arr = []
        if (files.length <= 0) {
          return;
        } 
        for (let i = 0, len = files.length; i < len; i++) {
          let { config, params } = handler()
          params.append(fileKey || 'file', files[i].file)
          arr.push(_this.http(params, config))
        }
        axios.all(arr).then(axios.spread(function() {
          _this.$emit('uploadFinally', arguments, _this.files)
        }))
      },
      // http
      http(params, config) {
        return axios.post(this.config.api, params, config)
      }
    }
  }
</script>
<style lang="scss" scoped>
  $gray-bg: #d9d9d9;
  @mixin add() {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      background: $gray-bg;
  }
  li {
    position: relative;
    input[type="file"] {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0;
      width: 100%;
      height: 100%;
      text-align: center;
      font-size: 0;
      line-height: 0;
      vertical-align: middle;
      z-index: 2;
    }
    &:before {
      content: '';
      display: inline-block;
      height: 100%;
      width: 0;
      vertical-align: middle;
    }
    img {
      max-width: 100%;
      max-height: 100%;
      width: auto;
      height: auto;
      vertical-align: middle;
    }
    .add-image {
      @include add();
      width: 40%;
      height: 5%;
      &:before {
        content: '';
        @include add();
        width: 100%;
        height: 100%;
        transform: rotate(90deg)
      }
    }
    .delete {
      position: absolute;
      top: -.5rem;
      right: -.5rem;
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      background: #000;
      &:after,
      &:before {
        content: '';
        @include add();
        width: 2px;
        height: 80%;
      }
      &:before {
        transform: rotate(-45deg)
      }
      &:after {
        transform: rotate(45deg)
      }
    }
  }
</style>

