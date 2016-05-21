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
		$grid.on('click', '[rel]', function (e) {
			_loadPopup($(this));
		});
		$popup.on('click', '.close', _hidePopup);
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

	function _showPopup(content){
		$popup.html(content);
		setTimeout(function(){
			$popup.scrollTop(0);
			setTimeout(function(){
				$body.addClass('popup-open');
			}, 50);
			setTimeout(function(){
				$popup.find('.close').css('display','block');
			}, 600);
		}, 10);
	}

	function _hidePopup(){
		$popup.scrollTop(0);
		$popup.html('');
		$body.removeClass('popup-open');
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