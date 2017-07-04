(function() {
  function getPerformance() {
    var _p = window.performance,
      _t = _p && _p.timing,
      _n = _p && _p.navigation;

    if (!_p || !_t) return false;

    var data = {},
      dataFn = {
        // ======================== page ========================
        page_domain: function() {
          return window.location.hostname;
        },
        page_url: function() {
          return window.location.pathname;
        },
        userid_num: function() {},
        // ======================== navigation ========================
        navigation_redirectCount: function() {
          return _n && _n.redirectCount;
        },
        navigation_type: function() {
          return _n && _n.type;
        },
        // ======================== net time ========================
        time_net_redirect: function() {
          return (_t.redirectEnd - _t.redirectStart);
        },
        time_net_dns: function() {
          return (_t.domainLookupEnd - _t.domainLookupStart);
        },
        time_net_tcp: function() {
          return (_t.connectEnd - _t.connectStart);
        },
        time_net_request: function() {
          return (_t.responseStart - _t.requestStart);
        },
        time_net_response: function() {
          return (_t.responseEnd - _t.responseStart);
        },
        time_net_processing: function() {
          return (_t.loadEventStart - _t.responseEnd);
        },
        // ======================== app time ========================
        time_app_unload: function() {
          return (_t.unloadEventEnd - _t.unloadEventStart);
        },
        time_app_cache: function() {
          return (_t.domainLookupStart - _t.fetchStart);
        },
        time_app_ttfb: function() {
          return (_t.responseStart - _t.fetchStart);
        },
        time_app_onload: function() {
          return (_t.loadEventEnd - _t.loadEventStart);
        },
        // ======================== dom time ========================
        time_dom_loading: function() {
          return (_t.domLoading - _t.fetchStart);
        },
        time_dom_ready: function() {
          return (_t.domInteractive - _t.domLoading);
        },
        time_dom_contentLoading: function() {
          return (_t.domContentLoadedEventStart - _t.domInteractive);
        },
        time_dom_complied: function() {
          return (_t.domContentLoadedEventEnd - _t.domContentLoadedEventStart);
        },
        time_dom_loaded: function() {
          return (_t.domComplete - _t.domContentLoadedEventEnd);
        },
        time_dom_complete: function() {
          return (_t.domComplete - _t.domLoading);
        },
        // ======================== page time ========================
        time_page_loaded: function() {
          return (_t.loadEventEnd - _t.fetchStart);
        },
        time_page_paint: function() {
          return (_t.domInteractive - _t.fetchStart);
        }
      };
    for (var k in dataFn) {
      data[k] = dataFn[k]();
    }
    return data;
  }

  setTimeout(function() {
    var data = getPerformance();
    var message = 'time_dom_loaded: ' + data.time_dom_loaded + 'ms\ntime_page_loaded: ' + data.time_page_loaded + 'ms';

    console.log(message);
    alert(message);
  },1000)
})()
