/**
 * A shooting star object.
 * @param {number} x0 //starting point
 * @param {number} slope
 * @param {number} velocity
 * @constructor
 */
function ShootingStar($scope, x0, slope, velocity) {

  var vector = {
    x: x0,
    slope: slope,
    velocity: velocity
  };

  var is_animating = true;
  var animateInterval;

  var raf = (function(){
    return window.requestAnimationFrame   ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame    ||
      function( callback ){
        window.setTimeout(callback, 1000 / 60);
      };
  })();

  var css = {
    width: '200px',
    height: '1px',
    background: 'linear-gradient(to left, rgba(255,255,255,0), rgba(255,255,255,1))',
    transform: 'rotate3d(0, 0, 1, -45deg)',
    left: 0,
    bottom: 0,
    zIndex: 1000,
    position: 'absolute'
  };

  var element;

  function animate(){
    animateInterval = setInterval(function(){
      raf(function(){
        _updatePosition(el);
      });
    }, 10);

  }

  function _updatePosition(){
    var element = $main_mountain.get(0);
    var translateY = (1 + last_scroll * .25).toFixed(1);
    var transform = 'translate3d(-50%, ' + translateY + 'px, 0)';

    element.style.transform = transform;
    element.style.WebkitTransform = transform;
  }

  //create element

  //apply css



}