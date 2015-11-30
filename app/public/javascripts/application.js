var eplanApp = angular.module('eplanApp', []);

eplanApp.controller('MainController', function($scope, $http) {
	$scope.partList = [];
  getParts();

  $scope.searchParts = function() {
  	var searchText = $scope.searchText;
  	console.log("search parts for:", searchText);
    getParts(searchText);
  };

  function getParts(searchText) {

    var URL_ROOT = "http://localhost:64010";

    $http.get(URL_ROOT + '/api/v1/part', {params:{q:searchText}} ).
      success(function(data, status, headers, config) {
        $scope.partList = data.data;
      }); 

  }

});

