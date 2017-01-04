/**
 * 在页面上绘制水印
 * @author zhaoxianlie
 * 
 * @param  {Object}   cfg             配置项
 *                    cfg.txt         水印文案，默认为“机密数据，请勿外传”
 *                    cfg.selector    需要添加水印的选择器，默认为“.page-content”
 *                    cfg.isForce     是否强制添加，删除tr元素的背景等操作
 *
 * @example
 *   window.watermark({
 *       txt: 'xiongweilie@qudian.com',   // 水印文案，默认为“机密数据，请勿外传”
 *       selector: 'tbody',               // 需要添加水印的选择器，默认为“.page-content”
 *       isForce: true                    // 是否强制添加，删除tr元素的背景等操作
 *   })
 * 
 */

(function() {
  window.watermark = window.watermark || init;

  /**
   * 添加水印功能的入口函数
   * @param  {Object}   cfg             配置项
   *                    cfg.txt         水印文案，默认为“机密数据，请勿外传”
   *                    cfg.selector    需要添加水印的选择器，默认为“.page-content”
   *                    cfg.isForce     是否强制添加，删除tr元素的背景等操作
   * @return {Undefined}       
   */
  function init(cfg) {
    cfg = cfg || {}

    var config = {
      txt: cfg.txt || '机密数据，请勿外传',
      selector: cfg.selector || '.page-content',
      isForce: (cfg.isForce === false ? false : true)
    }

    try {
      marker(config.txt, config.selector);
      config.isForce && resetBackground();
    } catch (e) {
      console.error('添加水印失败：', e);
    }
  }

  /**
   * 重置所有tr元素的背景
   * @return {[type]} [description]
   */
  function resetBackground() {
    var trList = document.querySelectorAll('tbody tr');
    for (var i = 0; i < trList.length; i++) {
      var color = i % 2 == 1 ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.05)';

      trList[i].style.backgroundColor = color;
    }
  }

  /**
   * 添加水印
   * @param  {String} txt      水印文案，默认为“机密数据，请勿外传”
   * @param  {String} selector 水印选择器，默认为“.page-content”
   * @return {Undefined}       
   */
  function marker(txt, selector) {
    //获取Canvas对象(画布)
    var canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 160;
    document.body.appendChild(canvas);
    //简单地检测当前浏览器是否支持Canvas对象，以免在一些不支持html5的浏览器中提示语法错误
    if (canvas.getContext) {
      //获取对应的CanvasRenderingContext2D对象(画笔)
      var ctx = canvas.getContext("2d");

      ctx.rotate(-30 * Math.PI / 180);
      //设置字体样式
      ctx.font = "12px";
      //设置字体填充颜色
      ctx.fillStyle = "rgba(100,100,0,0.2)";
      ctx.fillText(txt, -50, 156);
      var png = canvas.toDataURL('png');
      var domList = document.querySelectorAll(selector);

      for (var i = 0; i < domList.length; i++) {
        domList[i].style.background = '#fff url(' + png + ') ';
      }
    }
    document.body.removeChild(canvas);
  }
})()
