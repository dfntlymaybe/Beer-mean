app.controller('BeersCtrl', ['$scope','beers' ,'$stateParams',  function($scope, beers, $stateParams) {
  
  $scope.test = "yooo"

  $scope.beer = beers.findById($stateParams.id);

  $scope.postComment = function(beer){
    console.log($scope.commentData.commentInput)
    var comment = {userName: $scope.userName, text: $scope.comment}
    beers.saveComment(beer, comment); 
    $scope.userName = '';
    $scope.comment = '';
  }

  $scope.removeComment = function(beer, comment){
    //console.log(beer._id + ' ' + comment._id);
    beers.deleteComment(beer, comment);
  }
}]);