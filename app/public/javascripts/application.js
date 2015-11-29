var eplanApp = angular.module('eplanApp', []);

eplanApp.controller('MainController', function($scope, $http) {
	$scope.partList = [];

	var URL_ROOT = "http://localhost:3010";

  $http.get(URL_ROOT + '/api/v1/part').
    success(function(data, status, headers, config) {
      $scope.partList = data.data;
    });	


  $scope.searchParts = function() {
  	var searchText = $scope.searchText;
  	console.log("search parts for:", searchText);
  };

});

