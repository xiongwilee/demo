/**
 * 注意：
 * 1. 为避免IE9和低版本极速模式，优先使用ES5语法
 *
 */
var vm = new Vue({
  el: '#content',
  data: {
    tempList: [
      {
        id: 'zhifuling',
        logo: 'shield.png',
        name: '支付令',
        title: '福建省厦门市海沧区人民法院支付令',
        generated: null,
        downloadlink: '',
        templateArr: [],
        templateDoc: '',
      },
      {
        id: '1-7',
        logo: 'bank.png',
        name: '七合一文书',
        title: '福建省厦门市海沧区人民法院七合一送达文书',
        generated: null,
        downloadlink: '',
        templateArr: [],
        templateDoc: '',
      },
    ],
  },
  beforeCreate: function() {
    this.$nextTick(function() {
      vm.tempList.forEach(function(item) {
        vm.getDocTemplate(item.id, function(templateDoc) {
          item.templateDoc = templateDoc
        })
      })
    })
  },
  methods: {
    uploadFile: function(evt, index) {
      console.time('解析xlsx文件：')
      var files = evt.target.files || evt.dataTransfer.files,
        f = files[0]

      // 文件格式校验
      var isXlsxFile = /(\.xlsx)$/.test(f.name)
      if (!isXlsxFile) {
        return alert('请上传.xlsx后缀的文件')
      }

      var reader = new FileReader()
      reader.onload = function(e) {
        var data = new Uint8Array(e.target.result)
        var workbook = XLSX.read(data, { type: 'array' })

        var curSheetName = workbook.SheetNames[0]
        var curSheetData = workbook.Sheets[curSheetName]

        console.log(curSheetData, curSheetName)
        var curSheetJson = XLSX.utils.sheet_to_json(curSheetData, {
          raw: false,
        })

        // 重置当前文件
        evt.target.value = ''
        console.timeEnd('解析xlsx文件：')
        vm.genDoc(curSheetJson, index)
      }

      reader.readAsArrayBuffer(f)
    },
    getWordStyle: function(elementArr) {
      var styleStr = ''
      Array.prototype.forEach.call(elementArr, function(item) {
        if (item.tagName === 'STYLE') {
          styleStr = item.innerHTML
        }
      })

      return styleStr
    },
    getWordContent: function(elementArr) {
      var contentEle = {}
      Array.prototype.forEach.call(elementArr, function(item) {
        if (item.tagName === 'DIV' && /WordSection/.test(item.className)) {
          contentEle = item
        }
      })

      return contentEle
    },
    requestQRCode: function(orderId) {
      // http://debt.chunmiantest.qudian.com/court/showQrCode?id=订单id&is_png=1
      // `http://debt.fadongxi.com:8080/court/showQrCode?id=${orderId}&is_png=1`
      return `http://debt.fadongxi.com:8080/court/showQrCode?id=${orderId}&is_png=1`
    },
    genDoc: function(arr, index) {
      var curTemp = vm.tempList[index]

      if (!curTemp.templateDoc) {
        return alert('获取模板失败，请稍后再试！')
      }

      if (arr.length == 0) {
        return alert('xlsx文件没有数据！')
      }

      if (curTemp.generated === false) return

      curTemp.templateArr = arr
      curTemp.generated = false
      vm.$set(vm.tempList, index, curTemp)
      setTimeout(function() {
        console.time('生成word文件：')

        var zip = new JSZip()
        arr.forEach(function(item, index) {
          var docContent = vm.replacer(curTemp.templateDoc, item)

          // var converted = htmlDocx.asBlob(docContent, {
          //   orientation: 'portrait',
          // })
          var styleStr = vm.getWordStyle($(`${docContent}`))
          var contentEle = vm.getWordContent($(`${docContent}`))
          // 构建获取二维码的dom节点
          var qrcode = vm.requestQRCode(item['订单号'])
          $(contentEle)
            .find('img.qrcode')
            .attr('src', qrcode)
          var content = $(contentEle).wordExport(docName, styleStr)
          var docName = `${item['立案庭案号']}-${item['被申请人姓名']}`
          zip.file(`${docName}.doc`, content)
        })

        console.timeEnd('生成word文件：')
        console.time('打包word文件：')
        zip.generateAsync({ type: 'blob' }).then(function(content) {
          console.timeEnd('打包word文件：')
          saveAs(content, '测试.zip')

          curTemp.downloadname = '测试.zip'
          curTemp.downloadlink = URL.createObjectURL(content)
          curTemp.generated = true
          vm.$set(vm.tempList, index, curTemp)
        })
      })
    },
    replacer: function(template, data) {
      var result = template

      for (var key in data) {
        result = result.replace(new RegExp('#（' + key + '）', 'g'), data[key])
      }

      return result
      // TODO: 这里的正则在这种场景有问题
      // 申请人#（申请人）以下简称“#（申请人简称）”于#（申请时间）向本院申请支付令。申请人#（申请人 简称）称，#（借贷时间）
      return template.replace(/(#（)(\S+)(）)/g, function() {
        var replaceContent = arguments[2]
        var replacedContent = data[replaceContent]
        if (!replacedContent) return arguments[0]
        return replacedContent
      })
    },
    getDocTemplate: function(id, callback) {
      var tempUrl = './template/' + id + '.html'

      var req = new XMLHttpRequest()
      req.open('GET', tempUrl, true)

      req.onload = function(e) {
        if (e.target.status === 200) {
          callback && callback(e.target.response)
        } else {
          throw '获取' + id + '模板失败：' + e.target.statusText
        }
      }

      req.onerror = function(e) {
        alert('获取模板失败：' + e.toString())
      }

      req.send()
    },
  },
})
