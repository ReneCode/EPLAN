var eplanApp = angular.module('eplanApp', []);

eplanApp.controller('MainController', function($scope, $http, $location) {

  var URL_ROOT = "http://localhost:64010";

  // todo: put that into a user-service
  var host = $location.host();
  if (host != 'localhost') {
    // change route to subdomain "<protocol>://api.<host>"
    // =>   different service / look at .htaccess !
    // remove the subdomain
    host = host.match(/[^\.]*\.[^.]*$/)[0];
    URL_ROOT = $location.protocol() + "://api." + host;
    var port = $location.port();
    if (port) {
      URL_ROOT += ":" + port;
    }
  }

	$scope.partList = {};
  getParts();

  $scope.searchParts = function() {
  	var searchText = $scope.searchText;
    getParts(searchText);
  };

  function getParts(searchText) {
    $http.get(URL_ROOT + '/api/v1/part', {params:{q:searchText}} )
      .then( 
        // success
        function(response) {
          $scope.partList = response.data.data;
        },
        // error
        function(response) {
          console.log("errror >>");
          console.log("data:", response.data);
          console.log("status:", response.status);
          console.log("headers:", response.headers);
          console.log("config:", response.config);
          console.log("statusText:", response.statusText);
        }
      ); 
  }

});

