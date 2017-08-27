window.Projects = function($scope){

  var $articles = $scope.find('article');

  console.log($articles);
  console.log($scope);

  function show(){

    $scope.removeClass('loading');

    $articles.each(function(k,v){

      var $this = $(this);

      setTimeout(function(){

        $this.css('display', 'block');

      }, k * 150);
    });

  }

  return {
    show: show
  };

};