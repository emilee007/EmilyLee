window.Hero = function hero(){

  var $scope = $('#hero');

  var bottom = $scope.height();
  var right = $scope.width();

  var $main_mountain = $scope.find('object.main-mountain');
  var $side_mountains = $scope.find('object.side-mountains');

  var last_scroll = 0;

  var animateInterval;

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
      var x0 = rand(0, right);
      var angle = rand(30, 150);
      var duration = rand(1500, 2000);
      var brightness = rand(2, 5) / 10;

      new ShootingStar($scope, 1, x0, angle, duration, brightness);
    }, rand(500, 900))

  }

  function playShootingStars() {

    shootingStarInterval = setInterval(generateRandomShootingStar, 2500);

  }

  function animate(){
    if(animateInterval) return;
    animateInterval = setTimeout(function(){
      draw();
      animateInterval = null;
    }, 10);
  }

  function draw(){
    raf(function(){
      _updatePosMainMountain();
      _updatePosSideMountain();
    });
  }

  function _updatePosMainMountain(){
    var element = $main_mountain.get(0);
    var translateY = (1 + last_scroll * .25).toFixed(1);
    var transform = 'translate3d(-50%, ' + translateY + 'px, 0)';

    element.style.transform = transform;
    element.style.WebkitTransform = transform;
  }

  function _updatePosSideMountain(){
    var element = $side_mountains.get(0);
    var translateY = (1 + last_scroll * .4).toFixed(1);
    var transform = 'translate3d(-50%, ' + translateY + 'px, 0)';

    element.style.transform = transform;
    element.style.WebkitTransform = transform;
  }

  window.addEventListener("scroll", function() {
    last_scroll = window.scrollY;
    if(last_scroll < bottom){
      animate();
    }
  });

  function rand(min,max) {

    return Math.floor(Math.random()*(max-min+1)+min);

  }

  generateRandomShootingStar();
  playShootingStars();

};