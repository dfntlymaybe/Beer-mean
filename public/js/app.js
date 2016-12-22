var app = angular.module('beerList', ['ui.router']);

app.config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('home', {
    url: '/home',
    controller: 'MainCtrl',
    templateUrl: '/templates/home.html'
  })
  .state('beer', {
  url: '/beers/:id',
  controller: 'BeersCtrl',
  templateUrl: '/templates/beer.html'
})
  .state('register', {
  url: '/register',
  controller: 'AuthCtrl',
  templateUrl: '/templates/register.html'
})
  .state('login', {
    url: '/login',
    templateUrl: '/templates/login.html',
    controller: 'AuthCtrl'
  })

  $urlRouterProvider.otherwise('home');
}]);