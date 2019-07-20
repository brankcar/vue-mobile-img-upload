# vue-mobile-img-upload

移动端 Vue.js 上传预览图片组件
> a Vue.js mobile image uplaod component

该组件使用了 `axios` 工具上传文件，如果需要使用该组件请先：
> This component uses the `axios` tool to upload files. If you need to use this component, please first:

```
npm install axios
```

**npm install**
```
npm install vue-mobile-img-upload
```

**yarn**
```
yarn add vue-mobile-img-upload
```

> 在使用该组件时只需要在父组件配置 `config` 并使用 `v-bind` 指令绑定


> When using this component, you only need to configure the `config` in the parent component and bind it with the `v-bind` directive.


```
// main.js
import Upload from 'vue-img-upload'
import Vue from 'vue'

Vue.use(Upload)

// App.vue
<template>
  <div id="app">
    <Upload :config="config" @onError="onError" @uploadFinally="uploadFinally" ref="upload"></Upload>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'app',
  data () {
    return {
      config: {
        // options
      }
    }
  },
  methods: {
    onError(err) {
      console.log(err)
    },
    upload() {
      // 可自定义
      // 'key' 为要传输的文件 key ，
      // 在内部是 FromData().append('key'/* 对应的 key */, /* 文件对象 */)
      // 该 'key' 参数不传默认为 'file'
      // 利用 $refs 调用子组件内的 Function
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
<style>
  // custom style <scss>
  .upload-row{
    margin: 0 15px;
    .uploader {
      width: calc(100% + 10px);
      list-style: none;
      li {
        float: left;
        padding: 5px;
        margin-bottom: 10px;
        width: 6.5rem;
        height: 6.5rem;
        margin: 10px 10px 10px 0;
        border: 1px solid #dcdcdc;
        &:first-child {
          border-color: #fe7457;
        }
      }
    }
  }
</style>
```
**config options**


property | type | description
---|---|---
api | String | interface address
isValidateApi | Boolearn | When the attribute is `trun`, the regular `api` format will be verified.
validateReg | RegExp | When the `isValidateApi` property is true, you can customize `RegExp`, the default `RexExp` is `/^(?=^.{3,255})(http(s)?:\/\/)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*$/`
maxSize | Number | File size limit, `default` is `-1`, `-1` means no verification.
maxLength | Number | Maximum number limit, `default` is `-1`, `-1` means no verification.
accept | Array | `<input type="file" accept="">`, Attributes, default value：`['*']`, The image suffix can be defined. The array will be parsed inside the component, for example: `['jpeg', 'gif', 'png'] => "image/jpeg,image/gif,image/png"`.
isReduce | Boolearn | Compressed images, only when this property is set, the compressed image method will only be called once. If the size limit is exceeded after compression, an error is thrown. If `isRecursive` is `true`, no error will be reported.
isRecursive | Boolearn | Call recursively compressed images. If this property is true, no error message will be thrown for the image size limit.
quality | Number | Image compression quality. `0 ~ 1.0`


property | type | description
---|---|---
api | String | interface address
isValidateApi | Boolearn | 该属性为 `trun` 时将正则验证 `api` 格式.
validateReg | RegExp | 在 `isValidateApi` 属性为 `true` 时，可自定义 `RegExp` ，默认的 `RexExp` 为 `/^(?=^.{3,255})(http(s)?:\/\/)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*$/`
maxSize | Number | 文件大小限制，默认为 -1，-1 表示不验证
maxLength | Number | 最大数量限制，默认为 -1，-1 表示不验证
accept | Array | `<input type="file" accept="">`，属性，默认值为：`['*']`，可定义图片后缀，该数组在组件内部会解析，例：`['jpeg', 'gif', 'png'] => "image/jpeg,image/gif,image/png"`
isReduce | Boolearn | 压缩图片，只设置该属性时，压缩图像方法只会被调用一次。如果压缩后超出大小限制，则会引发错误。如果 `isRecursive` 为 `true`，则不会报告错误。
isRecursive | Boolearn | 调用递归压缩图像。如果此属性为真，则不会抛出图像​​大小限制的错误消息。
quality | Number | 图片压缩质量，`0 ~ 1.0`

**methods config**


Function | arguments | description
---|---|---
onError | err<Object> | This method accepts an object of the form `{ type: String, num: Number }`, `type => error type ('size', 'length')`; `num` => the verification value of the error.
upload | null | `this.$refs.upload.upload(this.paramsOptions, 'key')`; // Please see the example
paramsOptions | null | The configuration function before uploading the file, the function can be customized, but must return `{ params, config }`, `params` => interface parameter configuration before uploading the picture, `config => axios configuration object`
uploadFinally | args<arguments>, files<Array> | <Core method>The function accepts an `arguments` and `Array`, the `arguments` are all `Promise` collections after `axios.all`, and Array is the collection of files inside the component. This property is passed by the child component calling the parent component method. This property has built-in `__ob__` observer. , operate this property to dynamically change the image selected by the component.In the function, the information of the image uploading interface can be obtained, and the key objects in the component can be directly manipulated in the function for subsequent interaction, for example, the files collection deletes the successfully uploaded file, and then the upload method can be called to the collection. The remaining files are uploaded repeatedly.


Function | arguments | description
---|---|---
onError | err<Object> | 该方法接受一个对象，该对象格式为 `{ type: String, num: Number }`，`type` => 错误类型`('size','length')`；`num` => 该次错误的验证值
upload | null | `this.$refs.upload.upload(this.paramsOptions, 'key')`; // 请看例子
paramsOptions | null | 上传文件之前的配置函数，该函数可自定义，但是必须返回 `{ params,  config }`, `params` => 上传图片前的接口参数配置，`config => axios 配置对象`
uploadFinally | args<arguments>, files<Array> | <核心方法>该函数接受一个 `arguments` 与 `Array`，`arguments` 为 `axios.all` 执行后的所有 `Promise` 集合，`Array` 为组件内部的文件集合，该属性因为是子组件调用父组件方法传递过来的，该属性内置了 `__ob__` 观察者，操作该属性可动态改变该组件已选择的图片。在该函数内可获得图片上传接口的信息，在该函数内可直接操作本组件内的关键对象，以便后续的交互，比如，`files` 集合删除已成功上传的文件，再调用 `upload` 方法可将集合中剩余的文件重复上传。



## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).