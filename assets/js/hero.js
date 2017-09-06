window.Hero = function hero(){

  var $scope = $('#hero');

  var bottom = $scope.height();

  var $main_mountain = $scope.find('object.main-mountain');
  var $side_mountains = $scope.find('object.side-mountains');
  var $front_trees = $scope.find('object.front-trees');

  var last_scroll = 0;

  var animateInterval;

  var raf = (function(){
    return  window.requestAnimationFrame   ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame    ||
      function( callback ){
        window.setTimeout(callback, 1000 / 60);
      };
  })();

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

};