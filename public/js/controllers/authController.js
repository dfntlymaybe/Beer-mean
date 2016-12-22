
app.controller('AuthCtrl', ['$scope', '$state', 'auth', function($scope, $state, auth){

  $scope.register = function () {
    auth.register($scope.user).then(function(){
      $state.go('home');
    });
  };

  $scope.logOut = function(){
    auth.logOut().then(function(){

      $state.go('home');
    });
  }

  $scope.logIn = function(){
    auth.logIn($scope.user).then(function (){
      $state.go('home');
    }, function(error){
      $scope.error = error.data;
    });
  };

}]);