var util = (function util(my){

  'use strict';

  var $html = $('html');

  /**
   * Environment detection. Returns information about the browser, OS, ADV master Area, etc.
   * Possible keywords:
   * isChrome, isSafari, isiOS, isMac
   * @param test
   * @returns {*}
   */
  my.env = function env(test){
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
  };

  my.featureDetect = function _featureDetect(){
    //add some classes to html
    if(my.env('isMac')){
      $html.addClass('mac');
    } else {
      $html.addClass('not-mac');
    }
    if(my.env('isiOS')){
      $html.addClass('iOS');
    } else {
      $html.addClass('not-iOS');
    }
    if(my.env('isSafari')){
      $html.addClass('safari');
    } else {
      $html.addClass('not-safari');
    }
  };

  /**
   * Loads a popup content.
   * @param id
   * @param onSuccess
   */
  my.load = function _load(id, onSuccess){
    $.ajax({
      url: 'content/' + id + '/index.html',
      success: onSuccess
    });
  };

  /**
   * Scrolls to a section of the page.
   * "No need to ask, he's a smooooth operator..."
   */
  my.scrollTo = (function scrollTo(){
    var raf = (function(){
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
          raf(tick);
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

  return my;

})(util || {});