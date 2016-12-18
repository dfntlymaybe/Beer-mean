
  app.controller('MainCtrl', ['$scope','beers', function($scope, beers){

    $scope.commentData = {};

    var clearForm = function(){
      $scope.name = "";
      $scope.style = "";
      $scope.abv = "";
      $scope.image = "";
    };

    beers.getAll().then(function () {
      $scope.beerList = beers.beers;
    });

    //Rating when creating new beer
    $scope.newRateOptions = [
    { id: 1, label: '1 Star'}, 
    { id: 2, label: '2 Stars'},
    { id: 3, label: '3 Stars'},
    { id: 4, label: '4 Stars'},
    { id: 5, label: '5 Stars'}
    ];

    $scope.newSelected = $scope.newRateOptions[4];

    //Rating existing beer item
    $scope.exsRateOptions = [
    { id: 1, label: '1 Star'}, 
    { id: 2, label: '2 Stars'},
    { id: 3, label: '3 Stars'},
    { id: 4, label: '4 Stars'},
    { id: 5, label: '5 Stars'}
    ];

    $scope.exsSelected = $scope.exsRateOptions[0];

    $scope.rateExsBeer = function(beer, rating){
      beers.rate(beer, rating.id);
    };

    $scope.addBeer = function(){
      beers.create({
        name: $scope.name,
        style: $scope.style,
        abv: $scope.abv,
        img_url: $scope.image,
        rating: $scope.newSelected.id
      });
      clearForm();
    };

    $scope.deleteBeer = function(beer){
      beers.delete(beer);
    }

    $scope.calcAvr = function(beer){
      //beerService.beers.indexOf(beer)
      return beers.calculateAvarage(beer);
    };

    $scope.sortRating = function(){
      beers.sortByRating();
    };

    // $scope.login = function(username, passWord){
    //   var credentials = {name: username, pass: passWord}
    //   beers.login(credentials);
    // }


    }]);

