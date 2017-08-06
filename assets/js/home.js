(function() {

	var $body = $('body'),
		$popup = $body.find('#popup'),
		$menu_toggle = $body.find('a.menu-toggle'),
		$nav = $body.find('nav');

	var routes = {
		project: 'project/:id',
		closePopup: '!'
	};

	function _init() {

		//feature detection
		_featureDetection();

		//bind events
		_bindEvents();

		//load fastclick
		FastClick.attach(document.body);

		//setup routes
		router.setControllers(controller);
		router.setRoutes(routes);

		//route!
		router.route();
	}

	function _featureDetection(){
		//add some classes to html
		if(_env('isMac')){
			$('html').addClass('mac');
		} else {
			$('html').addClass('not-mac');
		}
		if(_env('isiOS')){
			$('html').addClass('iOS');
		} else {
			$('html').addClass('not-iOS');
		}
		if(_env('isSafari')){
			$('html').addClass('safari');
		} else {
			$('html').addClass('not-safari');
		}
	}

	/**
	 * Environment detection. Returns information about the browser, OS, ADV master Area, etc.
	 * Possible keywords:
	 * isChrome, isSafari, isiOS, isMac
	 * @param test
	 * @returns {*}
	 */
	function _env(test){
		var tests = {};
		tests.isChrome = function(){ return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);};
		tests.isSafari = function(){ return /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);};
		tests.isiOS = function(){ return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;};
		tests.isMac = function(){ return navigator.platform.toUpperCase().indexOf('MAC')>=0; };

		//make sure test exists
		if(typeof tests[test] === 'undefined'){
			throw "test '" + test + "' is not defined in Pivot.util.env";
		}

		return tests[test].apply();
	}

	function _bindEvents() {

		//toggle nav bar
		$menu_toggle.on('click', function(e){
			e.preventDefault();
			e.stopPropagation();
			if($menu_toggle.hasClass('active')){
				_closeMenu();
			} else {
				_openMenu();
			}
		});

		//project item
		$body.on('click', 'article', function (e) {
			router.go2('project', {id: $(this).data('id')});
		});

		//close button
		$body.on('click', '.close-popup i', function(){
			_close();
		});

		//nav
		$body.on('click', '[data-jump]', function(e){
			e.preventDefault();
			_scrollTo($(this).data('jump'));
		});

		//hover project
		$body.on('mouseover mouseenter', 'article', function(){
			var $this = $(this);
			$this.find('.text').addClass('hover');
		});
    $body.on('mouseout mouseleave', 'article', function(){
      var $this = $(this);
      $this.find('.text').removeClass('hover');
    });
	}

	function _load(id, onSuccess){
		$.ajax({
			url: 'content/' + id + '/index.html',
			success: onSuccess
		});
	}

	function _open(id){
		//prevent page scroll
		$body.css('overflow', 'hidden');
		_showProgressBar();
		_load(id, function(content){
			$popup.addClass(id);
			$popup.find('.content').html(content).css('display','block');
			var num_images = $popup.find('img').length,
				num_images_loaded = 0;
			$popup.imagesLoaded().always(function(){
				_hideProgressBar();
				$popup.addClass('loaded');
				$body.addClass('popup-open'); //prevent page scrolling
				setTimeout(function(){
					$body.find('.close-popup').css('display','block'); //show close button
				}, 200);
			}).progress(function(instance, image){
				num_images_loaded++;
				var percentage = (num_images_loaded / num_images) * 100;
				//we're always starting with 25% for the loader, so let's do percentage of remaining 75
				percentage = percentage * 0.80 + 20;
				_updateProgressBar(percentage);
			});
		});
	}

	/**
	 * @param {boolean=} doNotUpdateHash
	 * @private
	 */
	function _close(doNotUpdateHash){
		//re-enable page scroll
		$body.css('overflow', 'auto');
		$body.find('.close-popup').css('display','');
		$popup.find('.content').html('').css('display','');
		$popup.get(0).scrollTop = 0;
		$body.removeClass('popup-open blur');
		if(!doNotUpdateHash){
			window.location.hash = '!';
		}
	}

	function _showProgressBar(){
		_hideProgressBar();
		$body.prepend('<div class="progressbar"><div class="progress"></div><div class="barberpole"></div></div>');
	}

	function _hideProgressBar(){
		$body.find('.progressbar').remove();
	}

	function _updateProgressBar(percentage){
		$body.find('.progressbar .progress').css('width', percentage + '%');
	}

	function _openMenu(){
		$menu_toggle.addClass('active');
		$nav.css('display','block');
		$body.on('click.menu', _closeMenu);
	}

	function _closeMenu(){
		$body.off('click.menu');
		$menu_toggle.removeClass('active');
		$nav.css('display','');
	}

	var controller = {
		project: function(data){
			_open(data.id);
		},
		closePopup: function(){
			_close(true);
		}
	};

	//No need to ask, he's a smooth operator
	var _scrollTo = (function(){
		window.requestAnimFrame = (function(){
			return  window.requestAnimationFrame   ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame    ||
				function( callback ){
					window.setTimeout(callback, 1000 / 60);
				};
		})();

		function scrollToY(scrollTargetY, speed) {
			// scrollTargetY: the target scrollY property of the window
			// speed: time in pixels per second
			// easing: easing equation to use

			var scrollY = window.scrollY || document.documentElement.scrollTop,
				currentTime = 0;
				scrollTargetY = scrollTargetY || 0,
				speed = speed || 2000;

			// min time .1, max time 20 seconds
			var time = Math.max(.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, 20));

			// easing equation
			function easingEquation(pos) {
				return (-0.5 * (Math.cos(Math.PI * pos) - 1));
			}

			// add animation loop
			function tick() {
				currentTime += 1 / 60;

				var p = currentTime / time;
				var t = easingEquation(p);

				if (p < 1) {
					requestAnimFrame(tick);
					window.scrollTo(0, scrollY + ((scrollTargetY - scrollY) * t));
				} else {
					console.log('scroll done');
					window.scrollTo(0, scrollTargetY);
				}
			}

			// call it once to get started
			tick();
		}

		return function(id){
			var $elem = $('#' + id);
			scrollToY($elem.offset().top, 1200);
		};

	})();

	_init();

})();