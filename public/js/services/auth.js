app.factory('auth', ['$http',  function($http){
  var auth = {};

  auth.register = function(user){
    return $http.post('/register', user).success(function (data) {
     
      var temp ={};
      angular.copy(data, temp);
      //now what ??
    });
  };

  return auth;
}]);