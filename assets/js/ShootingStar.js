function ShootingStar($scope, zIndex, x0, angle, duration, brightness) {

  'use strict';

  var startTime = Date.now();

  var heightOfScope = $scope.innerHeight() + 200;
  var theta = angle * Math.PI / 180.0;
  var totalDistance = Math.round(heightOfScope * Math.sin(theta)) + 1000;
  var velocity = totalDistance / duration; //pixel/ms

  var animateInterval;

  var raf = (function() {
    return window.requestAnimationFrame   ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame    ||
      function( callback ){
        window.setTimeout(callback, 1000 / 60);
      };
  })();

  var $element;

  function createElement(){
    var randomId = 'shooting-star-' + Math.floor(Math.random()*10000000);
    $scope.prepend('<div id="' + randomId + '"></div>');
    setTimeout(function(){
      $element = $scope.find('#' + randomId);
      applyCSS();
      startAnimating();
    }, 10)
  }

  function applyCSS(){
    $element.css({
      width: '150px',
      height: '1px',
      background: 'linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,1))',
      left: 0,
      bottom: '100%',
      zIndex: zIndex,
      position: 'absolute',
      opacity: brightness
    });
  }

  function startAnimating() {
    animateInterval = setInterval(function(){
      raf(function(){

        var t = Date.now() - startTime;

        if(t >= duration) {
          //finished!
          clearInterval(animateInterval);
          $element.remove();
          return;
        }

        _updatePosition(t);
      });
    }, 10);
  }

  function _updatePosition(t) {

    var x = Math.round(velocity * t * Math.cos(theta) + x0);
    var y = Math.round(velocity * t * Math.sin(theta));

    var transform = 'translate3d(' + x + 'px, ' + y + 'px, 0) rotate3d(0, 0, 1, ' + angle + 'deg)';

    $element[0].style.transform = transform;
    $element[0].style.WebkitTransform = transform;
  }

  createElement();

}