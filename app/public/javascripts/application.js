var eplanApp = angular.module('eplanApp', []);

eplanApp.controller('MainController', function($scope, $http) {
	$scope.partList = {};
  getParts();

  $scope.searchParts = function() {
  	var searchText = $scope.searchText;
    getParts(searchText);
  };

  function getParts(searchText) {

    var URL_ROOT = "http://localhost:64010";
    console.log("getParts");

    $http.get(URL_ROOT + '/api/v1/part', {params:{q:searchText}} )
      .then( 
        // success
        function(response) {
          console.log("success >>", response);
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

