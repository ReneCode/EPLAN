
app = angular.module('eplanApp');

app.controller('PartListController', function($scope, $http, eplanUtility) {
  var URL_ROOT = eplanUtility.getApiHost();
  // default pastList is empty
	$scope.partList = {};
  // get Parts without any filter
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