/**
 * 打人的主场景
 */
;(function(){
	'use strict'

	window.Game = {
		init: function() {
			var clientWidth = document.body.clientWidth,
				clientHeight = document.body.clientHeight

			this.tips = document.querySelector('#J_tips_container')
			this.hitNum = 0
			this.tipsNum = 0
			this.isAnimate = false
			this.randomTips()

			this.canvas = document.querySelector('#J_game_stage')
			this.canvas.width = 640
			this.canvas.height = this.canvas.width * clientHeight / clientWidth
			this.stage = new createjs.Stage(this.canvas)

			this.initMan()
			this.bindEvents()

			createjs.Ticker.timingMode = createjs.Ticker.RAF
			createjs.Touch.enable(Game.stage)
			createjs.Ticker.addEventListener("tick", Game.stage)
		},
		initMan: function() {
			window.manbody = new ManBody()
			window.manlhand = new ManLHand()
			window.manrhand = new ManRHand()
			window.manshoulder = new ManShoulder()
			window.manneck = new ManNeck()
			window.manhead = new ManHead()
			this.hitImage = new createjs.Bitmap(loader.getResult('hiteffect'))
			this.hitImage.visible = false
			this.stage.addChild(this.hitImage)
		},
		randomTips: function() {
			this.tipsClass = ['w1', 'w2', 'w3', 'w4', 'w5'],
			this.tipsClass.sort(function() {
				return 0.5 - Math.random()
			})
		},
		judgeGame: function() {
			this.hitNum++
			this.isAnimate = true
			this.startX = 0
			this.startY = 0
			if (this.hitNum % 6 == 0) {
				// this.tips.querySelector('.words').classList.remove('w1', 'w2', 'w3', 'w4', 'w5')
				this.tips.querySelector('.words').classList.remove('w1')
				this.tips.querySelector('.words').classList.remove('w2')
				this.tips.querySelector('.words').classList.remove('w3')
				this.tips.querySelector('.words').classList.remove('w4')
				this.tips.querySelector('.words').classList.remove('w5')
				this.tips.querySelector('.words').classList.add(this.tipsClass[this.tipsNum])
				this.tips.classList.remove('hide')
				this.tips.classList.add('in')
				this.tipsNum = this.tipsNum > 3 ? 0 : (this.tipsNum + 1)
			}
		},
		reset: function() {
			this.hitNum = 0
			this.tipsNum = 0
			this.isAnimate = false
			this.randomTips()
		},
		bindEvents: function() {
			var nowX = 0,
				nowY = 0,
				SWAP_DIST = 50

			this.startX = 0
			this.startY = 0

			// 戳身体
			manbody.sprite.addEventListener('click', function(evt) {
				if (isOnArea(manbody.hitArea.body, this.startX, this.startY) && !this.isAnimate) {
					playActMusic('body')
					manhead.setStatus('hitbody')
					manneck.sprite.visible = false
					manlhand.setStatus('shake')
					manrhand.setStatus('shake')
					showHitEffect(this)
					this.judgeGame()
				}
			}.bind(this))

			// 戳肩膀
			manshoulder.sprite.addEventListener('click', function(evt) {
				if (isOnArea(manshoulder.hitArea.topbody, this.startX, this.startY) && !this.isAnimate) {
					playActMusic('body')
					manhead.setStatus('down')
					this.judgeGame()
				}
			}.bind(this))

			// 戳裆部
			this.stage.addEventListener('stagemousedown', function(evt) {
				if (evt.stageY > manhead.sprite.y + 510) {
					this.startX = evt.stageX - manbody.sprite.x,
					this.startY = evt.stageY - manbody.sprite.y
					
					if (isOnArea(manbody.hitArea.brother, this.startX, this.startY) && !this.isAnimate) {
						playActMusic('brother')
						manbody.setStatus('shake')
						manshoulder.setStatus('shake')
						manhead.setStatus('hitdown')
						manlhand.setStatus('shake')
						manrhand.setStatus('shake')
						this.judgeGame()
					}
				} else if (evt.stageY > manhead.sprite.y + 420) {
					this.startX = evt.stageX - manshoulder.sprite.x,
					this.startY = evt.stageY - manshoulder.sprite.y
				} else {
					this.startX = evt.stageX - manhead.sprite.x,
					this.startY = evt.stageY - manhead.sprite.y
				}

			}.bind(this))
			this.stage.addEventListener('stagemousemove', function(evt) {
				if (evt.stageY > manhead.sprite.y + 450) { // 抽身体
					nowX = evt.stageX - manbody.sprite.x
					nowY = evt.stageY - manbody.sprite.y

					if (!isOnArea(manbody.hitArea.allbody, nowX, nowY)) return
					if (this.startX == 0) return;
					if ((nowX - this.startX) > SWAP_DIST && !this.isAnimate) {
						playActMusic('lrbody')
						manbody.setStatus('right')
						manhead.setStatus('hitlr')
						manlhand.setStatus('shake')
						manrhand.setStatus('shake')
						this.judgeGame()
					} else if ((this.startX - nowX) > SWAP_DIST && !this.isAnimate) {
						playActMusic('lrbody')
						manbody.setStatus('left')
						manhead.setStatus('hitlr')
						manlhand.setStatus('shake')
						manrhand.setStatus('shake')
						this.judgeGame()
					}
				} else { // 扇耳光
					nowX = evt.stageX - manhead.sprite.x
					nowY = evt.stageY - manhead.sprite.y

					var distY = nowY - this.startY

					if (!isOnArea(manhead.hitArea.allface, nowX, nowY)) return
					if (this.startX == 0) return;

					if ((nowX - this.startX) > SWAP_DIST && distY < SWAP_DIST && !this.isAnimate) {
						playActMusic('face')
						manhead.setStatus('right')
						this.judgeGame()
					} else if ((this.startX - nowX) > SWAP_DIST && distY < SWAP_DIST && !this.isAnimate) {
						playActMusic('face')
						manhead.setStatus('left')
						this.judgeGame()
					} else if (distY > 100 && !this.isAnimate) {
						playActMusic('headupdown')
						manhead.setStatus('down')
						this.judgeGame()
					} else if (distY < - 100 && !this.isAnimate) {
						playActMusic('headupdown')
						manhead.setStatus('up')
						this.judgeGame()
					}
				}
			}.bind(this))

			// 戳头
			manhead.sprite.addEventListener('click', function(evt) {
				this.startX = evt.stageX - manhead.sprite.x,
				this.startY = evt.stageY - manhead.sprite.y

				if (isOnArea(manhead.hitArea.forehead, this.startX, this.startY)) {
					manhead.setStatus('up')
				}
			}.bind(this))

			manhead.sprite.addEventListener('animationend', function(evt) {
				this.isAnimate = false
				manneck.sprite.visible = true
				if (manhead.status == 'down') {
					setTimeout(function(){
						manhead.reset()
					}, 200)
				} else {
					manhead.setPosition()
				}
				this.hitImage.visible = false
			}.bind(this))

			function showHitEffect(context) {
				var hImage = context.hitImage
				hImage.x = context.startX + manbody.sprite.x - hImage.image.width / 2 - 20
				hImage.y = context.startY + manbody.sprite.y - hImage.image.height / 2
				hImage.visible = true
			}

		}
	}

	window.ManBody = (function() {

		var data = {
			width: 430,
			height: 540
		}

		var hitArea = {
			body: [150, 90, 310, 240],
			allbody: [90, 90, 350, 520],
			brother: [160, 250, 280, 440]
		}

		var frames = [
			[0, 0, 430, 540],
			[0, 540, 430, 540],
			[0, 1080, 430, 540],
			[0, 1620, 430, 540],
			[0, 2160, 430, 540],
			[0, 2700, 430, 540],
			[0, 3240, 430, 540]
		]

		var animations = {
			stand: 0,
			left: [1, 2, 'stand', 6],
			right: [3, 4, 'stand', 6],
			shake: [5, 6, 'stand', 6]
		}

		function ManBody() {
			var spriteSheet = new createjs.SpriteSheet({
				images: [loader.getResult('manbody')],
				frames: frames,
				framerate: 1,
				animations: animations
			})

			this.sprite = new createjs.Sprite(spriteSheet)
			this.status = 'stand'
			this.hitArea = hitArea
			this.setPosition()

			Game.stage.addChild(this.sprite)
		}

		ManBody.prototype = {
			setPosition: function() {
				this.sprite.x = (Game.canvas.width - data.width) / 2
				this.sprite.y = Game.canvas.height - data.height
			},
			setStatus: function(status) {
				status = status || 'stand'
				this.status = status
				this.sprite.gotoAndPlay(status)
			}
		}

		return ManBody
	})();

	window.ManShoulder = (function() {
		var data = {
			width: 560,
			height: 350
		}

		var hitArea = {
			topbody: [160, 240, 400, 350]
		}

		var frames = [
			[0, 0, 560, 350],
			[0, 350, 560, 350],
			[0, 700, 560, 350]
		]

		var animations = {
			stand: 0,
			shake: [1, 2, 'stand', 6]
		}

		function ManShoulder() {
			var spriteSheet = new createjs.SpriteSheet({
				images: [loader.getResult('manshoulder')],
				frames: frames,
				framerate: 1,
				animations: animations
			})

			this.sprite = new createjs.Sprite(spriteSheet)
			this.status = 'stand'
			this.hitArea = hitArea
			this.setPosition()

			Game.stage.addChild(this.sprite)
		}

		ManShoulder.prototype = {
			setPosition: function() {
				this.sprite.x = (Game.canvas.width - data.width) / 2
				this.sprite.y = Game.canvas.height - data.height - 490
			},
			setStatus: function(status) {
				status = status || 'stand'
				this.status = status
				this.sprite.gotoAndPlay(status)
			}
		}

		return ManShoulder
	})();

	window.ManHead = (function() {
		var data = {
			width: 420,
			height: 420
		}

		var hitArea = {
			forehead: [170, 180, 280, 250],
			allface: [80, 120, 340, 420]
		}

		var frames = [
			// 正常脸
			[0, 0, data.width, data.height],
			// 白脸
			[0, 420, data.width, data.height],
			// 向下抽
			[0, 840, data.width, data.height],
			[0, 1260, data.width, data.height],
			// 向上抽
			[0, 1680, data.width, data.height],
			[0, 2100, data.width, data.height],
			// 抽身体
			[0, 2520, data.width, data.height],
			[0, 2940, data.width, data.height],
			// 戳裆部
			[0, 3360, data.width, data.height],
			[0, 3780, data.width, data.height],
			// 右耳光
			[0, 4200, data.width, data.height],
			[0, 4620, data.width, data.height],
			// 左耳光
			[0, 5040, data.width, data.height],
			[0, 5460, data.width, data.height],
			// 戳身体
			[0, 5880, data.width, data.height]
		]

		var animations = {
			normal: 0,
			white: 1,
			down: [2, 3, 'downdone', 6],
			downdone: [3, 3, 'normal', 2],
			up: [4, 5, 'updone', 8],
			updone: [5, 5, 'normal', 2],
			hitlr: [6, 7, 'normal', 6],
			hitdown: [8, 9, 'normal', 6],
			right: [10, 11, 'rightdone', 10],
			rightdone: [11, 11, 'normal', 2],
			left: [12, 13, 'leftdone', 10],
			leftdone: [13, 13, 'normal', 2],
			hitbody: [14, 14, 'normal', 3]
		}

		function ManHead() {
			var spriteSheet = new createjs.SpriteSheet({
				images: [loader.getResult('manhead')],
				frames: frames,
				framerate: 1,
				animations: animations
			})

			this.sprite = new createjs.Sprite(spriteSheet)
			this.hitArea = hitArea
			this.status = 'normal'
			this.setPosition()

			Game.stage.addChild(this.sprite)
		}

		ManHead.prototype = {
			setPosition: function() {
				this.sprite.x = (Game.canvas.width - data.width) / 2 + 10
				this.sprite.y = Game.canvas.height - data.height - 580
			},
			setStatus: function(status) {
				status = status || 'normal'
				this.status = status
				if (status == 'hitbody' || status == 'hitlr') {
					this.sprite.y = Game.canvas.height - data.height - 490
				} else if (status == 'down') {
					this.sprite.y = Game.canvas.height - data.height - 570
				} else {
					this.setPosition()
				}
				this.sprite.gotoAndPlay(status)
			},
			reset: function() {
				this.setStatus()
				this.setPosition()
			}
		}

		return ManHead
	})();
	
	window.ManNeck = (function() {
		var data = {
			width: 114,
			height: 108
		}

		var frames = [
			[0, 0, 114, 108]
		]

		var animations = {
			stand: 0
		}

		function ManNeck() {
			var spriteSheet = new createjs.SpriteSheet({
				images: [loader.getResult('manneck')],
				frames: frames,
				framerate: 1,
				animations: animations
			})

			this.sprite = new createjs.Sprite(spriteSheet)
			this.status = 'stand'
			this.setPosition()

			Game.stage.addChild(this.sprite)
		}

		ManNeck.prototype = {
			setPosition: function() {
				this.sprite.x = (Game.canvas.width - data.width) / 2 + 10
				this.sprite.y = Game.canvas.height - data.height - 530
			},
			setStatus: function(status) {
				status = status || 'stand'
				this.status = status
				if (status == 'hide') {
					this.sprite.x = Game.canvas.width
					this.sprite.y = Game.canvas.height
				} else {
					this.setPosition()
					this.sprite.gotoAndStop(status)
				}
			}
		}

		return ManNeck
	})();

	window.ManLHand = (function() {
		var data = {
			width: 170,
			height: 170
		}

		var frames = [
			[0, 0, data.width, data.height],
			[0, 340, data.width, data.height],
			[0, 680, data.width, data.height]
		]

		var animations = {
			normal: 0,
			hit: [1, 1, 'normal', 3],
			shake: [2, 2, 'normal', 3]
		}

		function ManLHand() {
			var spriteSheet = new createjs.SpriteSheet({
				images: [loader.getResult('manhand')],
				frames: frames,
				framerate: 1,
				animations: animations
			})

			this.sprite = new createjs.Sprite(spriteSheet)
			this.status = 'normal'
			this.setPosition()

			Game.stage.addChild(this.sprite)
		}

		ManLHand.prototype = {
			setPosition: function() {
				this.sprite.x = (Game.canvas.width - data.width) / 2 + 210
				this.sprite.y = Game.canvas.height - data.height - 815
			},
			setStatus: function(status) {
				status = status || 'normal'
				this.status = status
				this.sprite.gotoAndPlay(status)
			}
		}

		return ManLHand
	})();

	window.ManRHand = (function() {
		var data = {
			width: 170,
			height: 170
		}

		var frames = [
			[0, 170, data.width, data.height],
			[0, 510, data.width, data.height],
			[0, 850, data.width, data.height]
		]

		var animations = {
			normal: 0,
			hit: [1, 1, 'normal', 3],
			shake: [2, 2, 'normal', 3]
		}

		function ManRHand() {
			var spriteSheet = new createjs.SpriteSheet({
				images: [loader.getResult('manhand')],
				frames: frames,
				framerate: 1,
				animations: animations
			})

			this.sprite = new createjs.Sprite(spriteSheet)
			this.status = 'normal'
			this.setPosition()

			Game.stage.addChild(this.sprite)
		}

		ManRHand.prototype = {
			setPosition: function() {
				this.sprite.x = (Game.canvas.width - data.width) / 2 - 195
				this.sprite.y = Game.canvas.height - data.height - 815
			},
			setStatus: function(status) {
				status = status || 'normal'
				this.status = status
				this.sprite.gotoAndPlay(status)
			}
		}

		return ManRHand
	})();

	window.loader = (function() {
	 	var imagesForGame = [
			{ src: 'man_body_sprite.png', id: 'manbody' },
			{ src: 'man_shoulder_sprite.png', id: 'manshoulder' },
			{ src: 'man_head_sprite.png', id: 'manhead' },
			{ src: 'man_hand_sprite.png', id: 'manhand' },
			{ src: 'man_neck.png', id: 'manneck' },
			{ src: 'hit_effect.png', id: 'hiteffect' }
	 	]

		var	manifest = imagesForGame

	 	return {
	 		load: function(options) {
	 			this.queue = new createjs.LoadQueue(false, 'images/')

	 			options = options || {}

	 			options.onfileload && this.queue.on("fileload", options.onfileload)
				options.onprogress && this.queue.on("progress", options.onprogress)
			 	options.oncomplete && this.queue.on("complete", options.oncomplete)
			 	options.onerror && this.queue.on("error", options.onerror)

			 	this.queue.loadManifest(manifest)
	 		},
	 		getResult: function(id) {
	 			return this.queue.getResult(id)
	 		}
	 	}
	})();

	/**
	 * 判断点击是否在指定区域
	 */
	function isOnArea(areaArr, px, py) {
		return (areaArr[0] < px && areaArr[2] > px && areaArr[1] < py && areaArr[3] > py);
	}

	function initGame() {
		//加载资源
		window.loader.load({
			oncomplete: function() {
				window.Game.init()
			},
			onerror: function() {
				location.reload()
			}
		})
	}

	initGame()

})();