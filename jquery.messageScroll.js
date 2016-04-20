(function($) {
  var messageScroll = function(cfg) {
    this.config = $.extend({
      timer: 3000,
      wrapperHeight: 40,
      ele: undefined
    }, cfg);

    this.slide = -1;

    this.init();
  }

  messageScroll.prototype = {
    init: function() {
      this.render();
    },
    render: function() {
      this.getElement();
      this.setTimer();
    },
    getElement: function() {
      var $ele = $(this.config.ele);

      // 获取壳
      this.wrapper = $ele.find('.scroll-message-wrapper');
      // 获取slides
      this.slides = $ele.find('.scroll-message-slide');
    },
    setTimer: function() {
      var me = this;
      var firstSlide = $(me.slides[0]);

      if (me.slide == -1) {
        firstSlide.css({
          top: '0px'
        });
        me.slide++;
      }

      setInterval(function() {
        var curSlide = $(me.slides[me.slide]);
        var nextSlide;
        if (me.slide + 1 >= me.slides.length) {
          nextSlide = firstSlide;
          me.slide = 0;
        } else {
          nextSlide = $(me.slides[me.slide + 1]);
          me.slide++
        };
        
        curSlide.show();
        nextSlide.show();

        animate(0, 40, function(top) {
          curSlide.css({
            top: (0 - top) + 'px'
          });
          nextSlide.css({
            top: (me.config.wrapperHeight - top) + 'px'
          })
        }, function() {
          curSlide.css({
            top: top + 'px'
          });
          curSlide.hide();
        }, 200);
      }, me.config.timer)
    }
  }


  function animate(from, to, callback, done, time) {
    var frequence = 10;
    var totalTime = time || 200;
    var changeTimes = totalTime / frequence;
    var singleChange = (to - from) / changeTimes;
    var interval = setInterval(function() {
      from = from + singleChange;
      changeTimes--
      if (changeTimes < 0 || singleChange == 0) {
        clearInterval(interval);
        callback(to);
        done();
      } else {
        callback(from)
      }
    }, frequence)
  }

  $.extend($.fn, {
    messageScroll: function(cfg) {
      var ele = this;
      var config = $.extend({
        ele: ele
      }, cfg);

      return (new messageScroll(config))
    }
  });
})(Zepto || jQuery)
