
app = angular.module('eplanApp');

app.controller('PartEditController', function($scope, $http, $stateParams, eplanUtility) {
  var URL_ROOT = eplanUtility.getApiHost();
  // default pastList is empty
  var id = $stateParams.id;

	$scope.part = { partnr: "hallo:" + id };
  getPart(id);


  function getPart(id) {
    $http.get(URL_ROOT + '/api/v1/part/' + id)
      .then( 
        // success
        function(response) {
          $scope.part = response.data.data;
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