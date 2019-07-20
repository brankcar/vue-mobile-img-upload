
  // 将 file 对象处理为 image
export function getFileUrl (file) {
  let image = new Image()
  let ua = navigator.userAgent.toLowerCase()
  let url
  if (/msie/.test(ua)) {
    url = file.value
  } else {
    url = window.URL.createObjectURL(file)
  }
  return url
}

// 将 url 转换为 Image 对象
export function URLtoImage (url, fn) {
  let img = new Image();
  img.onload = function() {
      fn(img);
  };
  img.src = url;
}

// 将 Image 对象转为 canvas
export function imagetoCanvas (image) {
  let cvs = document.createElement("canvas");
  let ctx = cvs.getContext('2d')
  cvs.width = image.width
  cvs.height = image.height
  ctx.drawImage(image, 0, 0, cvs.width, cvs.height)
  return cvs
}

// 将 canvas 压缩转变为 Blob 对象
export function canvasResizetoFile (canvas, quality, handler, fileResizetoFile, file, fn) {
  canvas.toBlob(function(blob) {
    if (!handler(blob)) {
      fn(blob);
    } else {
      fileResizetoFile(blob, quality, fn)
    }
  },'image/jpeg',quality);
}

// 将 file 对象压缩之后再返回 file 对象 
export function fileResizetoFile (file, quality, handler, fn) {
  let url = getFileUrl(file);
  URLtoImage(url,function(image){
      canvasResizetoFile(imagetoCanvas(image), quality, handler, fileResizetoFile, file, fn);
  })
}
