var eplanApp = angular.module('eplanApp', ['ui.router', 'ui.bootstrap']);

//
// Service
//
eplanApp.service("eplanUtility", function($location) {

  return {
    getApiHost: function() {
      var apiHost = "http://localhost:64010";
      var host = $location.host();
      if (host != 'localhost') {
        // change route to subdomain "<protocol>://api.<host>"
        // =>   different service / look at .htaccess !
        // remove the subdomain
        host = host.match(/[^\.]*\.[^.]*$/)[0];
        apiHost = $location.protocol() + "://api." + host;
        var port = $location.port();
        if (port) {
          apiHost += ":" + port;
        }
      }
      return apiHost;
    }
  }
});


eplanApp.directive('partRow', function() {
  return {
    templateUrl: 'templates/part-row-template.html'
  }
})


eplanApp.run([ '$state', function($state) {
  // start with state: index
  $state.transitionTo('index');
}

]);


eplanApp.config(function($stateProvider) {
  $stateProvider
    .state('index', {
      url: "index",
      views: {
        "index": {
          templateUrl: 'partials/part-list.html',
          controller: 'PartListController'
        }
      }
    })
    .state('edit', {
      url: "edit/:id",
      views: {
        "index": {
          templateUrl: 'partials/part-edit.html',
          controller: 'PartEditController'
        }
      }
    })
    .state('edit.technical', {
      parent: 'edit',
      views: {
        "editcontent": {
          templateUrl: 'partials/part-edit-technical.html',
        }
      }
    })
    .state('edit.common', {
      parent: 'edit',
      views: {
        "editcontent": {
          templateUrl: 'partials/part-edit-common.html',

        }
      }
    });

});

/*
eplanApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'partials/part-list.html',
      controller: 'PartListController'
    })
    .when("/edit", {
      templateUrl: 'partials/part-edit.html',
      controller: 'PartEditController'
    });

  }
]);

*/