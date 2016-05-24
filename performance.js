(function(window) {
  // 如果不存在 performance.timing 就直接返回
  if (!window.performance || !window.performance.timing) {
    return;
  }

  // 5/100 的概率可以进行统计
  if (Math.random() * 100 > 5) {
    return;
  }

  if (window.addEventListener) {

    window.addEventListener('load', function() {

      setTimeout(function(){

        analyseTiming();

      },0);

    }, false);

  } else if (window.attachEvent) {

    window.attachEvent('onload', function() {

     setTimeout(function(){

        analyseTiming();

      },0);

    });

  }

  function analyseTiming() {

    var timinhObj = performance.timing;

    //向服务器要发送的数据
    var data = {

      //domain
      domain : function() {
        return window.location.hostname;
      },

      //current url
      urlname : function() {
        return encodeURIComponent(window.location.pathname);
      },

      /**
       * Total Page Load time
       * 页面加载耗时
       * loadEventEnd:文档load结束的时间。如果load事件没有触发，那么该接口就返回0
       * navigationStart:当前浏览器窗口的前一个网页关闭，发生unload事件时的Unix毫秒时间戳。如果没有前一个网页，则等于fetchStart属性
       * fetchStart:如果一个新的资源获取被发起，则fetchStart必须返回用户代理开始检查其相关缓存的那个时间，其他情况则返回开始获取该资源的时间
       */
      pageloadtime : function() {
        return (timinhObj.loadEventEnd - timinhObj.navigationStart);
      },

      /**
       * app Cache time
       * DNS 缓存时间
       * domainLookupStart:返回用户代理对当前文档所属域进行DNS查询开始的时间。如果此请求没有DNS查询过程，如长连接，资源cache,甚至是本地资源等。 那么就返回 fetchStart的值
       * fetchStart:如果一个新的资源获取被发起，则fetchStart必须返回用户代理开始检查其相关缓存的那个时间，其他情况则返回开始获取该资源的时间
       */
      appCache : function() {
        return (timinhObj.domainLookupStart - timinhObj.fetchStart);
      },

      /**
       * DNS time
       * DNS 查询时间
       * domainLookupEnd:DNS 域名查询完成的时间，如果使用了本地缓存（即无 DNS 查询）或持久连接，则与 fetchStart 值相等
       * domainLookupStart:DNS 域名查询开始的时间，如果使用了本地缓存（即无 DNS 查询）或持久连接，则与 fetchStart 值相等
       */
      dnstime : function() {
        return (timinhObj.domainLookupEnd - timinhObj.domainLookupStart);
      },

      /**
       * TCP time
       * TCP 建立连接完成握手的时间
       * connectEnd:HTTP（TCP）完成建立连接的时间（完成握手），如果是持久连接，则与fetchStart值相等
       * connectStart:HTTP（TCP）开始建立连接的时间，如果是持久连接，则与fetchStart值相等
       */
      tcptime : function() {
        return (timinhObj.connectEnd - timinhObj.connectStart);
      },

      /**
       * request time
       * 请求开始到结束的时间
       * responseStart:开始接收响应的时间（获取到第一个字节），包括从本地读取缓存
       * requestStart: HTTP 请求读取真实文档开始的时间（完成建立连接），包括从本地读取缓存
       */
      requestime : function() {
        return (timinhObj.responseStart - timinhObj.requestStart);
      },

      /**
       * response time
       * 响应时间
       * responseEnd:HTTP 响应全部接收完成的时间（获取到最后一个字节），包括从本地读取缓存
       * responseStart:开始接收响应的时间（获取到第一个字节），包括从本地读取缓存
       */
      responsetime : function() {
        return (timinhObj.responseEnd - timinhObj.responseStart);
      },

      /**
       * DOM time
       * 解析DOM树的时间
       * domComplete: DOM树解析完成，且资源也准备就绪的时间
       * domLoading:开始解析渲染DOM树的时间，此时Document.readyState变为loading，并将抛出readystatechange相关事件
       */
      domtime : function() {
        return (timinhObj.domComplete - timinhObj.domLoading);
      },

      /**
       * onLoad time
       * 执行 onload 回调函数的时间
       * loadEventEnd:load 事件的回调函数执行完毕的时间
       * loadEventStart:load 事件发送给文档，也即 load 回调函数开始执行的时间,注意如果没有绑定 load 事件，值为 0
       */
      loadtime : function() {
        return (timinhObj.loadEventEnd - timinhObj.loadEventStart);
      }

    }

    //拼接参数
    var queryString = '';

    for( var item in data){

      queryString += item + '=' + data[item]() + '&';

    }

    //发送请求
    sendRequest(queryString);

  }


  function sendRequest(query) {

    var distUrl = 'http://www.qufenqi.com/felog?';

    new Image().src = distUrl + query;

  }
  
})(window)