(function(){
  var $uploadArea = document.getElementById('upload_area');
  var $uploadInput = document.getElementById('upload_input');
  var $docContainer = document.getElementById('doc_container');
  var $downloadArea = document.getElementById('download_area');
  var docTemplate = {};
  var docType = '1-7';

  /**
   * 入口方法
   */
  function init() {
    setDefault();
    bindEvent();
  }

  /**
   * 初始化方法
   */
  function setDefault() {
    getDocTemplate(docType);

  }

  /**
   * 绑定事件
   */
  function bindEvent() {
    // 拖拽上传
    $uploadArea.addEventListener('drop', handleUploadXlsx, false);
    // 点击上传
    $uploadInput.addEventListener('change', handleUploadXlsx, false);

    window.addEventListener("dragover",function(e){ e.preventDefault(); });
    window.addEventListener("drop",function(e){ e.preventDefault(); });
  }

  function initTinymce(id) {
    tinymce.init({
      selector: `#${id}`,
      plugins: [
        "advlist autolink lists link image charmap print preview anchor",
        "searchreplace visualblocks code fullscreen fullpage",
        "insertdatetime media table contextmenu paste"
      ],
      toolbar: "insertfile undo redo | styleselect | bold italic | " +
        "alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | " +
        "link image"
    });
  }

  /**
   * 上传文件回调
   */
  function handleUploadXlsx(e) {
    e.preventDefault();

    var files = e.target.files || e.dataTransfer.files, f = files[0];
    
    // 文件格式校验
    var isXlsxFile = /(\.xlsx)$/.test(f.name);
    if (!isXlsxFile) {
      return alert('请上传.xlsx后缀的文件');
    }

    var reader = new FileReader();
    reader.onload = function(e) {
      var data = new Uint8Array(e.target.result);
      var workbook = XLSX.read(data, {type: 'array'});

      var curSheetName = workbook.SheetNames[0];
      var curSheetData = workbook.Sheets[curSheetName];
      var curSheetJson = XLSX.utils.sheet_to_json(curSheetData);

      genDoc(curSheetJson)
    };
    reader.readAsArrayBuffer(f);
  }

  /**
   * 获取文书模板
   */
  function getDocTemplate(type, callback) {

    // 避免file://协议下不能发送ajax请求的问题，直接使用script引入模板
    // docTemplate[type] = document.getElementById(`template_${type}`).innerHTML;
    // callback && callback(docTemplate[type]);
    // return;

    var docMap = {
      '1-7':'./template/1-7.html',
      '2-2':'./template/2-2.html',
      '7-15':'./template/7-15.html',
    };
    
    var tempUrl = docMap[type];

    if (!tempUrl) throw `获取${type}文书模板失败：文件不存在`;

    var req = new XMLHttpRequest();
    req.open("GET", tempUrl, true);

    req.onload = function(e) {
      docTemplate[type] = e.target.response;
      callback && callback(docTemplate[type]);
    }

    req.onerror = function(e) {
      docTemplate[type] = document.getElementById(`template_${type}`).innerHTML;
      callback && callback(docTemplate[type]);
    }

    req.send();
  }

  function genDoc(arr) {
    $downloadArea.innerHTML = '如果没有自动下载请点击这里：';

    console.log(arr);
    arr.forEach(function(item, index) {
      var docContent = replacer(docTemplate[docType], item);
      var converted = htmlDocx.asBlob(docContent, {orientation: "portrait"});

      var docName = `${item['案号']}-${item['被执行人姓名']}`;
      saveAs(converted, `${docName}.docx`);

      // 先不默认生成可视化文书
      // var editor = document.createElement('textarea');
      // editor.id = `content_${index}`;
      // editor.innerHTML = docContent;
      // editor.cols = "60";
      // editor.rows="20";
      // $docContainer.appendChild(editor);
      // initTinymce(editor.id);

      var link = document.createElement('a');
      link.href = URL.createObjectURL(converted);
      link.download = `${docName}.docx`;
      link.appendChild(document.createTextNode(`${docName}.docx`));
      $downloadArea.appendChild(link);
    })
  }

  function replacer(template, data) {
    return template.replace(/(#（)(\S+)(）)/g, function(){
      var replaceContent = arguments[2];
      var replacedContent = data[replaceContent];
      if(!replacedContent) return arguments[0];
      return replacedContent;
    });
  }

  init();
})();