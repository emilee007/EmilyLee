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
		util.featureDetect();

		//init hero
		new Hero();

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
			util.scrollTo($(this).data('jump'));
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

  /**
	 * Open popup.
   * @param id
   * @private
   */
	function _open(id){
		//prevent page scroll
		$body.css('overflow', 'hidden');
		_showProgressBar();
		util.load(id, function(content){
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
		$nav.addClass('open');
		$body.on('click.menu', _closeMenu);
	}

	function _closeMenu(){
		$body.off('click.menu');
		$menu_toggle.removeClass('active');
		$nav.removeClass('open');
	}

	var controller = {
		project: function(data){
			_open(data.id);
		},
		closePopup: function(){
			_close(true);
		}
	};

	_init();

})();