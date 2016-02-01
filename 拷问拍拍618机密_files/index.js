;(function(){
	init();

	function init() {
		initPaperSlide()
		initEvent()
		initMusic("images/music_bg.mp3")
		initSound("images/music_hit.mp3")
		initShare()
	}

	function initEvent() {
		var shareBtn = document.querySelector('#J_sbtn'),
			goBtn = document.querySelector('#J_gotobtn'),
			againBtn = document.querySelector('#J_again_btn'),
			agameBtn = document.querySelector('#J_agame_btn'),
			continueBtn = document.querySelector('#J_continue_btn'),
			overBtn = document.querySelector('#J_over_btn'),
			logo = document.querySelector('#J_logo'),
			rhands = document.querySelector('#J_rhands'),
			stamps = document.querySelector('#J_stamps'),
			stamp2 = document.querySelector('#J_stamp2'),
			sealstamp = document.querySelector('#J_seal_stamp'),
			mainPage = document.querySelector('.p-2'),
			gamePage = document.querySelector('.p-3'),
			tutorialPage = document.querySelector('.p-4'),
			summaryPage = document.querySelector('.p-5'),
			tipsContainer = document.querySelector('#J_tips_container'),
			mainTitle = document.querySelector('#J_main_title')

		document.body.ontouchmove = function(e) {
	    	e.preventDefault();
	    };

		shareBtn.addEventListener('click', function(evt) {
			shareBtn.classList.add('out')
			goBtn.classList.add('out')
			shareBtn.addEventListener('webkitAnimationEnd', shareEvent)

			function shareEvent(evt) {
				shareBtn.removeEventListener('webkitAnimationEnd', shareEvent)
				var laterEles = document.querySelectorAll('.p-5 .later');

				for (var i = 0; i < laterEles.length; i++) {
					laterEles[i].classList.remove('hide')
				}

				shareBtn.classList.remove('out')
				shareBtn.classList.add('hide')
				goBtn.classList.remove('out')
				goBtn.classList.add('hide')

				summaryPage.classList.add('shareAnim')
			}
		})

		goBtn.addEventListener('click', function(evt) {
			window._paq && _paq.push(['trackEvent', 'GoTo', '618'])
		})

		againBtn.addEventListener('click', function(evt) {
			againBtn.classList.add('out')
			agameBtn.classList.add('out')
			logo.classList.add('out')
			summaryPage.classList.add('back')
			stamp2.classList.add('hide')
			sealstamp.classList.remove('hide')

			addAnimationEndEvent(againBtn, function(){
				againBtn.classList.remove('out')
				againBtn.classList.add('hide')
				agameBtn.classList.remove('out')
				agameBtn.classList.add('hide')
				logo.classList.remove('out')
				logo.classList.add('hide')
			})

			addAnimationEndEvent(rhands, function(){
				shareBtn.classList.remove('hide')
				goBtn.classList.remove('hide')
				stamps.classList.add('hide')
				stamp2.classList.remove('hide')
				sealstamp.classList.add('hide')
				// summaryPage.classList.remove('back', 'shareAnim')
				summaryPage.classList.remove('back')
				summaryPage.classList.remove('shareAnim')
			})
		})

		agameBtn.addEventListener('click', function(evt) {
			sealstamp.classList.add('hide')
			stamps.classList.add('hide')
			stamp2.classList.remove('hide')
			againBtn.classList.add('hide')
			agameBtn.classList.add('hide')
			logo.classList.add('hide')
			shareBtn.classList.remove('hide')
			goBtn.classList.remove('hide')
			summaryPage.classList.add('hide')
			// summaryPage.classList.remove('back', 'shareAnim')
			summaryPage.classList.remove('back')
			summaryPage.classList.remove('shareAnim')
			gamePage.classList.remove('hide')
			gamePage.classList.add('in')
			window.Game.reset()

			addAnimationEndEvent(gamePage, function() {
				gamePage.classList.remove('in')
			})
		})

		continueBtn.addEventListener('touchstart', function(evt) {
			evt.stopPropagation()
			tipsContainer.classList.remove('in')
			tipsContainer.classList.add('out')
			addAnimationEndEvent(tipsContainer, function() {
				tipsContainer.classList.remove('out')
				tipsContainer.classList.add('hide')
			})
		})

		overBtn.addEventListener('click', function(evt) {
			gamePage.classList.add('hide')
			tipsContainer.classList.remove('in')
			tipsContainer.classList.add('hide')
			summaryPage.classList.remove('hide')
			summaryPage.classList.add('in')
			addAnimationEndEvent(summaryPage, function() {
				summaryPage.classList.remove('in')
			})
		})

		tutorialPage.addEventListener('touchend', function(evt) {
			tutorialPage.classList.add('out')
			addAnimationEndEvent(tutorialPage, function() {
				tutorialPage.classList.remove('out')
				tutorialPage.classList.add('hide')
			})
		})

		addAnimationEndEvent(mainTitle, function(){
		})
		mainPage.addEventListener('touchend', function(evt) {
			mainPage.classList.add('hide')
			gamePage.classList.remove('hide')
			tutorialPage.classList.remove('hide')
		})

	}

	function initPaperSlide() {
		var paperCnt = document.querySelector('#J_papers'),
			lhand1 = document.querySelector('#J_lhands .lhand-1'),
			lhand2 = document.querySelector('#J_lhands .lhand-2')

		var touchInfo = {
			startX: 0,
			endX: 0
		}
		var isSwipe = false

		paperCnt.addEventListener('touchstart', function(e) {
			if (e.changedTouches.length == 0) return
			touchInfo.startX = e.changedTouches[0].pageX
		})

		paperCnt.addEventListener('touchend', function(e) {
			if (e.changedTouches.length == 0) return
			touchInfo.endX = e.changedTouches[0].pageX

			var offset = touchInfo.endX - touchInfo.startX,
				timer = null

			if (offset < -20 && !isSwipe) {
				isSwipe = true
				if (timer) {
					clearTimeout(timer)
				} else {
					timer = setTimeout(function(){
						slide()
					}, 30)
				}
			}
		})

		function slide() {
			var paperArr = document.querySelectorAll('#J_papers div'),
				index = paperCnt.getAttribute('data-idx') | 0;

			paperCnt.setAttribute('data-idx', (index+1)%3)
			paperArr[index].classList.add('move-step1')
			lhand1.classList.add('move-step1')
			lhand2.classList.add('move-step1')

			addAnimationEndEvent(lhand1, function() {
				for (var i = 0; i< 3; i++) {
					// paperArr[i].classList.remove('first','second','third')
					paperArr[i].classList.remove('first')
					paperArr[i].classList.remove('second')
					paperArr[i].classList.remove('third')
				}
				lhand1.classList.remove('move-step1')
				lhand2.classList.remove('move-step1')
				paperArr[index].classList.remove('move-step1')
				lhand1.classList.add('move-step2')
				lhand2.classList.add('move-step2')
				// paperArr[index].classList.add('third','move-step2')
				paperArr[index].classList.add('third')
				paperArr[index].classList.add('move-step2')
				paperArr[(index+1)%3].classList.add('first')
				paperArr[(index+2)%3].classList.add('second')

				addAnimationEndEvent(lhand1, function() {
					isSwipe = false;
					lhand1.classList.remove('move-step2')
					lhand2.classList.remove('move-step2')
					var moveEle = document.querySelectorAll('.move-step2')
					for (var i = 0; i < moveEle.length; i++) {
						moveEle[i].classList.remove('move-step2')
					}
				})
			})
		}
	}

	function addAnimationEndEvent(ele, func) {
		var fun = function() {
			ele.removeEventListener('webkitAnimationEnd', fun)
			func()
		}
		ele.addEventListener('webkitAnimationEnd', fun)
	}

	/**
	 * 音乐
	 */
	function initMusic(src) {
		window.$audio = document.querySelector('#J_bg_music')
		var baseUrl = location.protocol + "//" + location.host + location.pathname.replace(/[^\/]+$/, "")
        var trigger = 'ontouchend' in document? 'touchstart': 'click'
        var $music = document.querySelector('#J_music')

        // window.$audio = new Audio()
        $audio.autoplay = false
        $audio.loop = true
        // $audio.src = baseUrl + src

        $audio.addEventListener('play', play)
        // $audio.addEventListener('pause', pause)
        // $audio.addEventListener('ended', pause)
        $music.addEventListener('click', toggle)
        $audio.play()

        document.addEventListener(trigger, start)

        function start() {
			document.removeEventListener(trigger, start, false)
			if(!$audio.paused) return
			$audio.play()
        }
        
        function toggle() {
			if(!$audio.paused) {
				pause()
				$audio.pause()
				return
			}
			if ($audio.readyState != 4) return
			$audio.currentTime = 0
			$audio.play()
        }

        function play(e) {
			$music.className = 'music ne playing'
        }

        function pause(e) {
			$music.className = 'music ne'
        }
	}

	function initSound(src) {
		function SoundEffect(url) {
			this.audio = new Audio()
			this.audio.autoplay = false
			this.audio.loop = false
			this.audio.src = url
		}
		SoundEffect.prototype.play = function(time) {
			time = time || 0
			if (this.audio.readyState == 4) {
				this.audio.currentTime = time
			}
			this.audio.play()
		}
		SoundEffect.prototype.pause = function(time) {
			time = time || 0
			if (this.audio.readyState == 4) {
				this.audio.currentTime = time
			}
			this.audio.pause()
			if ($audio.readyState == 4) {
				$audio.play()	// hack android bug~
			}
		}
		SoundEffect.prototype.closeToTime = function(time) {
        	return Math.abs(this.audio.currentTime - time) < 0.5
		}

        var hitSound = new SoundEffect(src)

        window.playActMusic = function(act) {
			if (document.querySelector('#J_music').className == 'music ne') return	

			if (act == 'body') {
				hitSound.play(0)
			} else if (act == 'face') {
				hitSound.play(2)
			} else if (act == 'lrbody') {
				hitSound.play(6)
			} else if (act == 'headupdown') {
				hitSound.play(8)
			} else if (act == 'brother') {
				hitSound.play(10)
			}
		}

		setInterval(function() {
			// 戳身体
			if (hitSound.closeToTime(1)) {
				hitSound.pause(0)
			}
			// 耳光
			else if (hitSound.closeToTime(3)) {
				hitSound.pause(2)
			}
			// 左右划身体
			else if (hitSound.closeToTime(7)) {
				hitSound.pause(6)
			}
			// 向上滑头
			else if (hitSound.closeToTime(9)) {
				hitSound.pause(8)
			}
			// 向下拍头
			else if (hitSound.closeToTime(11)) {
				hitSound.pause(10)
			}
		}, 200)
	}

	/**
	 * 微信分享、关注公众号
	 */
	function initShare() {
		if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
		    initShareEvent();
		} else {
		    if (document.addEventListener) {
		        document.addEventListener("WeixinJSBridgeReady", initShareEvent, false);
		    } else if (document.attachEvent) {
		        document.attachEvent("WeixinJSBridgeReady", initShareEvent);
		        document.attachEvent("onWeixinJSBridgeReady", initShareEvent);
		    }
		}
		function initShareEvent(){
			var url = location.protocol + "//" + location.host + location.pathname.replace(/[^\/]+$/, "");
			WeixinJSBridge.on("menu:share:appmessage", function() {
				WeixinJSBridge.invoke("sendAppMessage", {
					img_url: url + "images/share.png",
					link: location.href,
					desc: "被删前速点：员工劲爆拍拍618机密",
					title: "拷问拍拍618机密"
				}, function(data){
					window._paq && _paq.push(['trackEvent', 'Share', 'sendAppMessage'])
				});
			});
			WeixinJSBridge.on("menu:share:timeline", function(h) {
				WeixinJSBridge.invoke("shareTimeline", {
					img_url: url + "images/share.png",
					img_width: "80",
					img_height: "80",
					link: location.href,
					desc: "被删前速点：员工劲爆拍拍618机密", 
					title: "被删前速点：员工劲爆拍拍618机密"
				}, function(data){
					window._paq && _paq.push(['trackEvent', 'Share', 'shareTimeline'])
				});
			});
		}
	}

})();