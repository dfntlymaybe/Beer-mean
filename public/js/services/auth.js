app.factory('auth', ['$http', '$rootScope','$q',  function($http, $rootScope, $q){
  var auth = {};

  auth.currentUser = null;

  auth.setCurrentUser = function (user) {
    auth.currentUser = user;
    $rootScope.$broadcast("currentUserChange", user);
  };

  auth.getCurrentUser = function() {
    return $http.get('/currentUser').then(function (response) {
      debugger;
      auth.setCurrentUser(response.data.username);
    });
  }

  auth.register = function(user){
    return $http.post('/register', user).then(function (response) {
      debugger;
      auth.setCurrentUser(response.data.username);
    }, function (error) {
      return $q.reject(error)
    });
  };

  auth.logOut = function(){
    return $http.get('/logout').then(function (data){
      auth.setCurrentUser(null);
    })
  }

  auth.logIn = function(user){
    return $http.post('/login', user).then(function (response) {
      auth.setCurrentUser(response.data.username);
    }, function (error) {
      return $q.reject(error)
    });
  };


  return auth;
}]);