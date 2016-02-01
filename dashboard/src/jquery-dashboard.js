/*
 * author: wilee
 * import: jQuery.cookie, jQuery.pinyinEngine, jQuery.popover
 */
(function($){
    function renderAllNav(options) {
        options = options || {};
        var defaultConfig = {
            $document : $(document),
            $body : $(document.body),
            $logoTheme : $('#logo-theme'),
            $logoImg : $('#logo_img'),
            $navSlideBtn : $('#nav_slide_btn'),
            $navPanel : $('#nav_panel'),
            $navPanelUsername : $('#nav_panel_username'),
            $navPanelUsernameIcon : $('#nav_panel_username .panel-username-icon'),
            $navPanelDetail : $('#nav_panel_detail'),
            $searchLabel : $('#sidenav_search_label'),
            $searchInput : $('#sidenav_search_input'),
            $sidenav : $('#sidenav'),
            $sidenavHome : $('#sidenav_item_home'),
            $sidenavItemLinks : $([]),
            $sidenavCollectList:$('#sidenav_collect_list'),
            $content : $('#content'),
            $sidenavItems: $('.sidenav-item-link'),
            $headStationMsg: $('#head-station-msg'),
            $headStationMsgNum: $('#nav-msg-num'),
            $headStationMsgWrapper: $('#station-msg-num-wrapper'),
            defaultTheme :  $.cookie('SHOP_THEME'),
            defaultSidenav : $.cookie('SHOP_SIDENAV'),
            defaultCollect : $.cookie('SHOP_COLLECTION') || options.defaultCollectList,
            currentOn : "default",//当前的模块默认default
            $robot : $('#popover-robot'),
            $navChangeListeners: options.navChangeListeners || []
        }

        $('._btn-expand').click(function(){
            $(this).hide().nextAll().show();
            $('._btn-expand-up').show();
        }); 
        $('._btn-expand-up').click(function(){
            $('._btn-expand').nextAll().hide();
            $('._btn-expand').show();
        }); 

        $('.home-nav-item').hover(function(){
            $('.nav-reply-content').show()
        }, function(){
            $('.nav-reply-content').hide();
        });

        var RenderNav = function(config){

            config = config || {};

            this.config = $.extend(defaultConfig,config);

            this.sidenavType = 'default';

            this.curSlectedLinkEle;

            this.curCollect = [];

            //对应模块的logo
            this.config.logo = {
              default: {
                  grey:{
                      logo:  'http://shop.meilishuo.com/shop/static/img/common/logo_grey.png',
                      css:'theme-grey'
                  },
                  dark:{
                      logo:  'http://shop.meilishuo.com/shop/static/img/common/logo_dark.png',
                      css:'theme-dark'
                  },
                  red:{
                      logo:  'http://shop.meilishuo.com/shop/static/img/common/logo_red.png',
                      css:'theme-red'
                  }
              },
              vip: {
                  grey:{
                      logo:  'http://shop.meilishuo.com/shop/static/img/vip/vip_logo.png',
                      css:'theme-grey'
                  },
                  dark:{
                      logo:  'http://shop.meilishuo.com/shop/static/img/vip/vip_logo.png',
                      css:'theme-dark'
                  },
                  red:{
                      logo:  'http://shop.meilishuo.com/shop/static/img/vip/vip_logo.png',
                      css:'theme-red'
                  }
              }
            }
        }
        RenderNav.prototype = {
            init : function(){

                this.setDefault();

                this.eventBind();

            },
            setDefault : function(){

                this.config.$sidenavItemLinks = this.config.$sidenav.find('.sidenav-item-link');

                this.pinyinEngine = $.fn.pinyinEngine();

                this.setNavLinkView(window.location.pathname + window.location.hash);

                this.setCollect(this.config.defaultCollect);

                this.setTheme(this.config.defaultTheme||'grey');

                if(this.config.defaultSidenav == 'none'){
                    this.changeNavType({
                        hideLinkGroup:true
                    });
                }

                //this.setMessageLoop();
            },
            setCollect : function(defaultCollect){
                var me = this,
                    defaultCollect = defaultCollect || '',
                    curCollect = defaultCollect.split(',');

                for(var i = 0;i<curCollect.length;i++){
                    me.addCollect(curCollect[i]);
                }
            },
            getCollectHTML : function(curNav){
                var curNav = curNav || {},
                    curEle = curNav.ele,
                    cutUrl = $(curNav.ele).attr('href'),
                    curText = $(curNav.ele).find('.link-text').text();
                return '<dd href="'+cutUrl+'" class="sidenav-collect-link">'+
                            '<i class="fa">·</i>'+
                            '<span class="link-text">'+curText+'</span>'+
                            '<i class="delete-collect right fa fa-close"></i>'+
                        '</dd>';
            },
            deleteCollect : function(link, curCollectEle){
                var me = this;
                var curNav = me.getNavByLink(link),result = [];

                if( curNav
                    && curNav.ele
                    && curNav.type == 'normal'
                    && $.inArray(link,me.curCollect) > -1
                ){
                    $(curNav.ele).removeClass('collect');
                    $(curCollectEle).remove();

                    for(var i = 0;i<me.curCollect.length;i++){
                        if(me.curCollect[i] != link){
                            result.push(me.curCollect[i]);
                        }
                    }

                    me.curCollect = result;

                    $.cookie('SHOP_COLLECTION',me.curCollect.join(','), { expires: 365, path: '/' });

                    if(me.curCollect.length == 0){me.config.$sidenavCollectList.hide();}
                }
            },
            addCollect : function(link){
                var me = this;
                var curNav = me.getNavByLink(link),curHtml;

                if( curNav
                    && curNav.ele
                    && curNav.type == 'normal'
                    && $.inArray(link,me.curCollect) == -1
                ){
                    curHtml = me.getCollectHTML(curNav);
                    me.config.$sidenavCollectList.show().find('.sidenav-collect-link-group').append(curHtml);
                    $(curNav.ele).addClass('collect');
                    me.curCollect.push(link);
                    $.cookie('SHOP_COLLECTION',me.curCollect.join(','), { expires: 365, path: '/' })
                }
            },
            changeNavType : function(config){
                var me = this,
                    config = config || {};

                me.sidenavType = this.sidenavType == 'default' ? 'none' : 'default';
                me.config.$sidenav.find('.sidenav-item-link').show();
                me.config.$body.toggleClass('sidenav-none').toggleClass('sidenav-default');
                me.config.$navSlideBtn.toggleClass('fa-caret-left').toggleClass('fa-caret-right');

                me.config.$document.find('.sidenav-none .sidenav-item.active').removeClass('active');

                if(!config.hideLinkGroup){
                    me.config.$document.find('.sidenav-none .sidenav-item-active').addClass('active');
                }

                me.config.$sidenavCollectList.removeClass('active');

                $(me).trigger('changeNav',config)

                $.cookie('SHOP_SIDENAV', me.sidenavType, { expires: 365, path: '/' });
                $(me.config.$navChangeListeners).each(function(index, listener){
                    $(listener).trigger('navChange');
                })
            },
            isNavFold: function(){
                return $('body').hasClass('sidenav-none');
            },
            setTheme : function(theme){
                var me,
                    themeConfig = this.config.logo[ this.config.currentOn || 'default'][theme];

                if(themeConfig){
                    this.config.$document.find('html').removeClass('theme-grey').removeClass('theme-dark').removeClass('theme-red').addClass(themeConfig.css);
                    this.config.$logoImg.attr({
                        src:themeConfig.logo
                    })

                    $(me).trigger('setTheme',{
                        theme:theme
                    })

                    $.cookie('SHOP_THEME', theme, { expires: 365, path: '/' });
                }

            },
            getNavByLink : function(link){
                var me = this , flag = false , curItem ,
                    matchUrl = function(testLink, curLink){
                        if(curLink && curLink.indexOf('?') > -1){
                            curLink  = curLink.substr(0, curLink.indexOf('?'))
                        }
                        return (testLink && testLink.indexOf && testLink.indexOf(curLink) > -1)
                    },result;

                me.config.$sidenavItemLinks.each(function(index, item){
                    curItem = $(item),curItemLink = curItem.attr('href');
                    if(matchUrl(link, curItemLink)){
                        flag = true;
                        result = {
                            ele:curItem,
                            type:'normal'
                        }
                        return false;
                    }
                })

                if(!flag && matchUrl(link, me.config.$sidenavHome.attr('href'))){
                    result = {
                        ele:me.config.$sidenavHome,
                        type:'home'
                    }
                }

                return result;
            },
            setNavLinkView : function(link, isJump){
                var me = this,
                    noJump = !isJump,
                    link = link || (window.location.pathname + window.location.hash);

                var curNav = me.getNavByLink(link);
                var noNeedActive = (me.sidenavType == 'none');

                if(curNav && curNav.type == 'normal'){
                    me.selectedNavLink(curNav.ele, {noJump:noJump, noNeedActive: !!noNeedActive});
                }else if(curNav && curNav.type == 'home'){
                    me.selectedHome();
                }
            },
            selectedHome : function(){
                var me = this;

                me.config.$sidenav.find('.sidenav-item.active').removeClass('active');
                me.config.$sidenav.find('.sidenav-item-link.selected').removeClass('selected');
                me.config.$sidenav.find('.sidenav-item-active').removeClass('sidenav-item-active');
                me.config.$sidenavHome.addClass('active');
                me.config.$sidenavHome.find('.sidenav-item-title').addClass('selected');

                me.curSlectedLinkEle = me.config.$sidenavHome;
            },
            selectedNavLink : function(ele, config){
                var me = this,config = config || {},
                    curSidenavLink = $(ele),
                    targetLink = curSidenavLink.attr('href');
                if(curSidenavLink && curSidenavLink.hasClass && curSidenavLink.hasClass('sidenav-item-link')){
                    me.config.$sidenav.find('.sidenav-item.active').removeClass('active');
                    me.config.$sidenav.find('.sidenav-item-active').removeClass('sidenav-item-active');
                    me.config.$sidenav.find('.sidenav-item-link.selected').removeClass('selected');
                    me.config.$sidenavHome.find('.sidenav-item-title').removeClass('selected');
                    me.config.$sidenav.find('.candidate-selected').removeClass('candidate-selected');
                    curSidenavLink.addClass('selected');
                    curSidenavLink.parents('.sidenav-item').addClass('sidenav-item-active');
                    if(!config || !config.noNeedActive){ curSidenavLink.parents('.sidenav-item').addClass('active'); }

                    if(targetLink && !config.noJump){ window.location.href = targetLink; };

                    me.curSlectedLinkEle = curSidenavLink;
                }else{
                    me.selectedHome();
                }
            },
            searchHanzi : function(text, searchText){
                var result = false;

                this.pinyinEngine.resetCache();
                this.pinyinEngine.setCache([text],!result);
                this.pinyinEngine.search(searchText, function (data) {
                    result = data;
                });

                return result;
            },
            searchNav:function(searchText){
                var me = this;
                if(!searchText){ return }

                // 搜索结果放入此数组
                me.searchedItemLinks = [];
                this.config.$sidenavItems.removeClass('candidate-selected');

                this.config.$sidenavItemLinks.each(function(index, item){
                    var $item = $(item),
                        curText = $item.text(),
                        searchResult = me.searchHanzi(curText, searchText);
                    if(curText && searchResult){
                        $item.show();
                        me.searchedItemLinks.push($item[0]);
                    }else{
                        $item.hide();
                    }
                });

                // 把查选出来的第一个候选中
                me.searchedItemLinks.length &&
                    $(me.searchedItemLinks[0]).addClass('candidate-selected');
            },
            isWindowHidden : function(){
                var hiddenProp = 'hidden' in document ? 'hidden' : function() {
                    var r = null;
             
                    ['webkit', 'moz', 'ms', 'o'].forEach(function(prefix) {
                        if((prefix + 'Hidden') in document) {
                            return r = prefix + 'Hidden';
                        }
                    });
             
                    return r;
                }();

                if(hiddenProp){
                    return document[hiddenProp]
                }else{
                    return false;
                }
            },
            loopMessage : {
                loopTime : 30000,//默认时间，300秒
                stageMin : 10000, //最小轮询时间
                stageMax : 60000, //最大轮询时间
                incLooptime : function(){
                    var curLoopTime;
                    var loopTime = this.loopMessage.loopTime;
                    var stageMax = this.loopMessage.stageMax;
                    
                    curLoopTime = loopTime + 5000;

                    if(curLoopTime > stageMax){
                        this.loopMessage.loopTime = stageMax;
                        return stageMax;
                    }else{
                        this.loopMessage.loopTime = curLoopTime;
                        return curLoopTime;
                    }
                },
                decLooptime : function(){
                    var curLoopTime;
                    var loopTime = this.loopMessage.loopTime;
                    var stageMin = this.loopMessage.stageMin;
                    
                    curLoopTime = loopTime - 5000;

                    if(curLoopTime < stageMin){
                        this.loopMessage.loopTime = stageMin;
                        return stageMin;
                    }else{
                        this.loopMessage.loopTime = curLoopTime;
                        return curLoopTime;
                    }
                }
            },
            setMessageLoop : function(){
                var me = this;

               if(me.config.$headStationMsg.length == 1){
                    var _timeouttimer = null
                        , _timer;

                    var getMessageInfo = function(loopTime){
                        _timeouttimer = setTimeout(function(){
                            var curLoopTime = me.loopMessage.loopTime;
                            var curWindowHidden = me.isWindowHidden();

                            getMessageInfo(curLoopTime);

                            if(curWindowHidden){ return }//如果当前标签没有激活，则不用发请求了

                            $.get('/data/message/stationmsg', function (res){
                                if(res.code == 0){
                                   if(res.info.new_unread_num > 0){
                                        if(res.info.new_unread_num == 1 ){
                                            me.config.$headStationMsgWrapper.html(res.info.message||'您有<span class="color-red red_f">1</span>新消息！');
                                        }else{
                                            me.config.$headStationMsgWrapper.html('您有<span class="color-red red_f">'+res.info.new_unread_num+'</span>新消息！'); 
                                        }
                                      
                                        me.config.$headStationMsgNum.text(res.info.unread_num); 
                                        me.config.$headStationMsgNum.show();
                                        me.config.$headStationMsg.slideDown('normal');
                                      
                                        clearTimeout(_timer);
                                        _timer = setTimeout(function(){
                                            me.config.$headStationMsg.slideUp('normal');
                                        }, 5000);

                                        me.loopMessage.decLooptime.apply(me);//减小轮询时间
                                   }else{
                                        me.loopMessage.incLooptime.apply(me);//增加轮询时间
                                   }
                                }
                            },'json');

                        },loopTime)
                    }

                    getMessageInfo(0);//启动轮询
                }
            },
            eventBind : function(){
                var me = this,searchTimer;

                me.config.$navSlideBtn.on('click',function(evt){
                    me.changeNavType({
                        hideLinkGroup: true
                    });
                })

                me.config.$navPanel.on('mouseenter',function(evt){
                    evt.stopPropagation();
                    me.config.$navPanelDetail.addClass('actived');
                    me.config.$navPanelUsernameIcon.addClass('fa-chevron-up').removeClass('fa-chevron-down')
                })

                me.config.$navPanel.on('mouseleave',function(evt){
                    evt.stopPropagation();
                    me.config.$navPanelDetail.removeClass('actived');
                    me.config.$navPanelUsernameIcon.addClass('fa-chevron-down').removeClass('fa-chevron-up')
                })

                me.config.$body.on('click',function(evt){
                    me.config.$navPanelDetail.removeClass('actived');
                    me.config.$navPanelUsernameIcon.addClass('fa-chevron-down').removeClass('fa-chevron-up');
                })

                me.config.$navPanelDetail.on('click',function(evt){
                    evt.stopPropagation();
                })

                me.config.$sidenavHome.on('click',function(evt){
                    var curSidenav = $(this),
                        targetLink = curSidenav.attr('href');
                    me.selectedHome();
                    if(targetLink){ window.location.href = targetLink };
                })

                me.config.$sidenav.on('click','.sidenav-item',function(evt){
                    var curSidenav = $(this);
                    if(curSidenav.hasClass('active')){
                        curSidenav.removeClass('active');
                    }else{
                        me.config.$sidenav.find('.sidenav-item.active').removeClass('active');
                        curSidenav.addClass('active');
                    }
                })

                me.config.$sidenav.on('click','.sidenav-item-link',function(evt){
                    var curSidenavLink = $(this),
                        targetBlank = curSidenavLink.data('target-blank');

                    if(targetBlank != 1){
                        evt.preventDefault();
                        me.selectedNavLink(curSidenavLink);
                    }

                })

                me.config.$sidenav.on('click','.sidenav-item-link-group',function(evt){
                    evt.stopPropagation();
                })

                me.config.$content.on('click',function(evt){
                    me.config.$searchInput.removeClass('active');
                    me.config.$document.find('.sidenav-none .sidenav-item.active').removeClass('active');
                    me.config.$document.find('.sidenav-none .sidenav-collect.active').removeClass('active');
                })

                me.config.$searchLabel.on('click',function(){
                    me.config.$searchInput.toggleClass('active').focus();
                })

                me.config.$logoTheme.on('click',function(evt){
                    var targetEle = $(evt.target),
                        curTheme = targetEle.data('theme');
                    if(curTheme){
                        me.config.$logoTheme.find('.active').removeClass('active');
                        me.setTheme(curTheme);
                        targetEle.addClass('active')
                    }
                })
                me.config.$searchInput.on('keyup',function(evt){
                    var ENTER_KEYCODE = 13,
                        UP_KEYCODE = 38,
                        DOWN_KEYCODE = 40,
                        searchText = $(this).val().replace(/(\s+)|(\s+$)/g,'');
                    if (evt.keyCode == ENTER_KEYCODE ||
                            evt.keyCode == UP_KEYCODE || evt.keyCode == DOWN_KEYCODE) {
                        return;
                    }

                    if(me.sidenavType == 'none'){
                        me.changeNavType();
                    }

                    if(searchText || searchText !== ''){
                        me.config.$sidenav.find('.sidenav-item').addClass('active');

                        clearTimeout(searchTimer);

                        searchTimer = setTimeout(function(){
                            me.searchNav(searchText);
                        },100)
                    }else{
                        me.config.$sidenav.find('.sidenav-item-link').show();
                    }

                    me.config.$sidenav.addClass('searching');
                })
                me.config.$searchInput.on('keyup',function(evt){

                    var ENTER_KEYCODE = 13,
                        UP_KEYCODE = 38,
                        DOWN_KEYCODE = 40,
                        searchedItemLinks = me.searchedItemLinks;

                        // 如果查询结果为空，则直接结束
                        if (!searchedItemLinks ||  !searchedItemLinks.length) {
                            return;
                        }

                        // 按钮候选中的nav
                    var $sidenavCandidateItems = $('.sidenav-item-link.candidate-selected'),
                        sidenavCandidateItems = $sidenavCandidateItems[0],
                        searchedItemsLen = searchedItemLinks.length,

                        // 判断按钮候选中的nav在查询结果中的位置
                        currentIndex = searchedItemLinks.indexOf(sidenavCandidateItems),

                        //获取当前所选位置的前后nav, 此处不能改为++/--
                        $nextCandidateItem = $(searchedItemLinks[currentIndex + 1]),
                        $prevCandidateItem = $(searchedItemLinks[currentIndex - 1]);

                    // 判断按键
                    switch (evt.keyCode) {
                        case ENTER_KEYCODE:

                            // 把选中的页面打开
                            $sidenavCandidateItems.trigger('click');
                            break;
                        case DOWN_KEYCODE:

                            // 如果查询结果是小与2个，则不响应上下按键
                            if (searchedItemsLen < 2) {
                                break;
                            }
                            if ($nextCandidateItem.length) {
                                $sidenavCandidateItems.removeClass('candidate-selected');
                                $nextCandidateItem.addClass('candidate-selected');
                            }
                            break;
                        case UP_KEYCODE:

                            // 如果查询结果是小与2个，则不响应上下按键
                            if (searchedItemsLen < 2) {
                                break;
                            }
                            if ($prevCandidateItem.length) {
                                $sidenavCandidateItems.removeClass('candidate-selected');
                                $prevCandidateItem.addClass('candidate-selected');
                            }
                            break;
                        default:
                            break;
                    }
                    return;
                })
                me.config.$searchInput.on('focus',function(evt){
                    me.config.$searchInput.addClass('active')
                })
                me.config.$searchInput.on('blur',function(evt){
                    setTimeout(function(){
                        me.config.$sidenav.removeClass('searching');

                        me.config.$searchInput.removeClass('active');
                        me.config.$sidenav.find('.sidenav-item-link').show();

                        me.selectedNavLink(me.curSlectedLinkEle,{noJump:true});
                    },100)
                })
                me.config.$sidenav.on('click','.sidenav-collect',function(evt){
                    var curEle = $(this);
                    curEle.toggleClass('active');
                })
                me.config.$sidenav.on('click','.sidenav-collect-link-group',function(evt){
                    evt.stopPropagation();
                })
                me.config.$sidenav.on('click','.sidenav-collect-link',function(evt){
                    var curEle = $(this),
                        curLink = curEle.attr('href');
                    if(curLink){
                        me.setNavLinkView(curLink, true);
                    }
                })
                me.config.$sidenav.on('click','.add-collect',function(evt){
                    var curEle = $(this),
                        curLink = curEle.parent().attr('href');
                    evt.stopPropagation();
                    evt.preventDefault();

                    me.addCollect(curLink);
                })
                me.config.$sidenav.on('click','.delete-collect',function(evt){
                    var curEle = $(this),
                        curCollectEle = curEle.parent(),
                        curLink = curCollectEle.attr('href');
                    evt.stopPropagation();

                    me.deleteCollect(curLink,curCollectEle);
                })

                me.config.$robot.on('mouseover', function(evt) {
                    var curEle = $(this);
                    /*curEle.popover({
                        title: "联系美丽说客服",
                        html: true,
                        content: function(){
                            var phoneCallEles = '<p class="title">联系方式</p>'
                                + '<p class="pnumber detail"><i class="iconfont icon-tel"></i> 400-0800-588</p>'
                                + '<p class="qq detail"><i class="iconfont icon-qq"></i> 800066168 <span class="tips color-pink">(QQ咨询更高效)</span></p>'
                                + '<p class="email detail"><i class="iconfont icon-mail"></i> <a href="mailto:service@meilishuo.com">service@meilishuo.com</a></p>';

                            var serviceTime = '<p class="title">咨询时间</p>'
                                + '<p class="pnumber detail"><i class="iconfont icon-time-fill"></i> 周一至周五(09:00-20:00)</p>';

                            // var robot = '<p class="title">智能客服</p>'
                            //     + '<p class="detail robot">'
                            //     + '<i class="iconfont icon-manager"></i>'
                            //     + '<a href="http://www.meilishuo.com/help/robot?source=pc_business" target="_blank"> 点我咨询</a></p>';

                            var robot = "";

                            var content = '<div class="phone-feedback">'
                                    + phoneCallEles + serviceTime + robot
                                    + '</div>';
                            return content;
                        }
                    })*/
                })
            }
        }

        return  new RenderNav(options);
    }
    $.fn.extend({

    	renderNav : function(options){

            options = options || {};

            options.defaultCollectList = "/deal/order/,/goods/select_category/,/discount/list/,/activity/,/dc/shop/,/finance/";

            var navAction = renderAllNav(options);

    		navAction.init();

    		return navAction;
    	}
        
    });

})(jQuery)