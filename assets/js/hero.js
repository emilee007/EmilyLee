window.Hero = function hero(){

  var $scope = $('#hero');

  var bottom = $scope.height();
  var right = $scope.width();

  var $main_mountain = $scope.find('object.main-mountain');
  var $side_mountains = $scope.find('object.side-mountains');
  var mainMtn = $main_mountain.get(0);
  var sideMtn = $side_mountains.get(0);

  var last_scroll = 0;

  var animateTimeout;

  var shootingStarInterval;

  var raf = (function(){
    return window.requestAnimationFrame   ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame    ||
      function( callback ){
        window.setTimeout(callback, 1000 / 60);
      };
  })();

  function generateRandomShootingStar() {

    setTimeout(function(){

      var x0 = rand(50, right - 50);
      var angle = rand(30, 150);
      var duration = rand(1500, 2000);
      var brightness = rand(2, 5) / 10;

      new ShootingStar($scope, 1, x0, angle, duration, brightness);

    }, rand(0, 400))

  }

  function playShootingStars() {

    if(shootingStarInterval) return;
    shootingStarInterval = setInterval(generateRandomShootingStar, 1200);

  }

  function stopShootingStars() {

    clearInterval(shootingStarInterval);
    shootingStarInterval = null;

  }

  function animate(){
    if(animateTimeout){
      return;
    }
    animateTimeout = setTimeout(function(){

      last_scroll = window.scrollY;

      if(last_scroll < bottom){
        raf(function(){
          _updateMtns();
        });
        playShootingStars();
      } else {
        stopShootingStars();
      }

      animateTimeout = null;
    }, 20);
  }

  function _updateMtns(){

    var translateY = Math.round((1 + last_scroll * .25));
    var transform = 'translate3d(-50%, ' + translateY + 'px, 0)';

    mainMtn.style.transform = transform;
    mainMtn.style.WebkitTransform = transform;

    sideMtn.style.transform = transform;
    sideMtn.style.WebkitTransform = transform;
  }

  function rand(min,max) {

    return Math.floor(Math.random()*(max-min+1)+min);

  }

  window.addEventListener("scroll", animate);

  generateRandomShootingStar();
  playShootingStars();

  return {
    playShootingStars: playShootingStars,
    stopShootingStars: stopShootingStars
  }

};