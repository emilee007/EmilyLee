(function() {

	var $body = $('body'),
		$grid = $body.find('.grid'),
		$popup = $body.find('#popup');

	function _init() {
		_bindEvents();
		//load fastclick
		FastClick.attach(document.body);
	}

	function _bindEvents() {

		//grid item
		$grid.on('click', '[rel]', function (e) {
			_loadPopup($(this));
		});

		//close button
		$body.on('click', '.close-popup', _hidePopup);

		//about link
		$body.on('click', '.about', function(e){
			e.preventDefault();
			_loadAbout();
			return false;
		});
	}

	function _loadPopup($el) {
		_showLoading($el);
		$.ajax({
			url: 'content/' + $el.attr('rel') + '/content.html',
			success: function(resp){
				_showPopup(resp);
			}
		}).always(function(){
			_hideLoading();
		});
	}

	function _loadAbout(){
		_showLoading($body);
		$.ajax({
			url: 'content/about.html',
			success: function(resp){
				_showPopup(resp);
			}
		}).always(function(){
			_hideLoading();
		});
	}

	function _showPopup(content, classes){
		$popup.find('.belt').html(content);
		$popup.addClass(classes);
		setTimeout(function(){
			$popup.scrollTop(0);
			setTimeout(function(){
				$body.addClass('popup-open');
			}, 50);
			setTimeout(function(){
				$body.find('.close-popup').css('display','block');
			}, 600);
		}, 10);
	}

	function _hidePopup(){
		$popup.scrollTop(0);
		$popup.find('.belt').html('');
		$body.removeClass('popup-open');
		$body.find('.close-popup').css('display','none');
	}

	function _showLoading($el){
		_hideLoading();
		$el.prepend('<div class="spinner"><i></i></div>');
		$el.addClass('loading');
	}

	function _hideLoading(){
		$grid.find('.spinner').remove();
		$grid.find('[rel]').removeClass('loading');
	}

	_init();

})();