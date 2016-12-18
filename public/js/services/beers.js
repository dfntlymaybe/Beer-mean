// app.factory('beerService', function(){

  //Main Beers List (Dummy Data)
  // var beersArray = [
  //   {id: 0, name: "Maccabi", abv: 5, style: "All malt", img_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Makabi_beer.jpg/263px-Makabi_beer.jpg", rating:[3,5]},
  //   {id: 1, name: "Guinness", abv: 5.6, style: "Dark", img_url: "https://www.guinness.com/media/1552/blonde_bg3__resized_1600-h.jpg?anchor=center&mode=crop&quality=75&width=750", rating:[3,1,1]},
  //   {id: 2, name: "VB", abv: 4.5, style: "Blended", img_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/VB-stubbie.jpg/330px-VB-stubbie.jpg", rating:[4,2]},
  //   {id: 3, name: "Bucks", abv: 4.9, style: "light", img_url: "http://res.cloudinary.com/ratebeer/image/upload/w_120,c_limit/beer_64264.jpg", rating:[4]},
  //   {id: 4, name: "Heineken", abv: 5.2, style: "Unblended", img_url: "http://beerforayear.files.wordpress.com/2012/02/heineken_bottle_white.jpg", rating:[4, 2, 1, 1]},
  //   {id: 5, name: "Tuborg", abv: 4.7, style: "Singl Malt", img_url: "http://liquorsky.com/wp-content/uploads/2015/07/BE37.png", rating:[5]}
  // ];


/*************Main Service Handles all the client side logic*****************/

app.factory('beers', ['$http', function ($http) {

  var beerService = {
    beers: [],

  };

  //Helper func to show average rating to the users
  beerService.calculateAvarage = function(beer){
      sum = 0;
      for(rate in beer.rating){
        sum += beer.rating[rate];
      }
        var avarage = sum / beer.rating.length;
      return Math.round(avarage);
    };

  //Sort array by average rating
  beerService.sortByRating = function(){
      var first = beerService.beers[0];
      var last = beerService.beers[beerService.beers.length-1];
      var c = -1;
      if( beerService.calculateAvarage(first) < beerService.calculateAvarage(last)){
        c=1;
      }
      beerService.beers = beerService.beers.sort(function(a, b){
        if (beerService.calculateAvarage(a) > beerService.calculateAvarage(b)){
          return -c;
        }
        if (beerService.calculateAvarage(a) < beerService.calculateAvarage(b)){
          return c;
        }
        return 0;
      });
  };

  beerService.findById = function(id){
    for(beer in beerService.beers){
      if(id == beerService.beers[beer]._id){
        return beerService.beers[beer];
      }
    }
     
  }


  //Ask for the Beers from the server(DB)
  beerService.getAll = function () {
    return $http.get('/beers').success(function (data) {
      angular.copy(data, beerService.beers);
    });
  };

  //Send create new Beer request to srver
  beerService.create = function (beer) {
    
    $http.post('/beers', beer).success(function (data) {
     
      var temp ={};
      angular.copy(data, temp);
      beerService.beers.push(temp);
    });
  };

  //Send new rating to beer item request to the server
  beerService.rate = function(beer, rating){

    var temp = {};
    angular.copy(beer, temp);
    beer.rating.push(rating);
    $http.put('/beers', beer).success(function (data) {

      beerService.beers[beerService.beer.indexOf(temp)] = beer;

    });

  };

  //Send delete beer request to the server
  beerService.delete = function (beer) {

    $http.delete('/beers/' + beer._id).success( function(data) {

      beerService.beers.splice(beerService.beers.indexOf(beer), 1);

    });
  
  };

  beerService.deleteComment = function(beer, comment){

    //delete the comment from the DB
    $http.delete('/beers/' + beer._id +'/reviews/' + comment._id).success( function(data) {

    //delete the comment from the array
    var beerIndex = beerService.beers.indexOf(beer);
    var commentIndex = beerService.beers[beerIndex].reviews.indexOf(comment);
    beerService.beers[beerIndex].reviews.splice(commentIndex, 1);

    });
  };

  beerService.saveComment = function(beer, comment){
    $http.post('/beers/' + beer._id + '/reviews', comment).success(function (data) {

      var temp ={};
      angular.copy(data, temp);
      beerService.beers[beerService.beers.indexOf(beer)].reviews.push(temp);
      console.log(temp);
     //console.log(beerService.beers);
      // var temp ={};
      // angular.copy(data, temp);

      // beerService.beers.push(temp);
    });
  }

  // beerService.login = function(credentials){
  //   $http.post('/login', credentials).success(function (data) {
      
  //   }
  // }
   // for(beer in beersArray){
   //  beerService.create(beersArray[beer]);
   // }

  return beerService;
}]);
