(function() {
    var app = angular.module('app', ['ngRoute']);

    app.config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/htmlInfo.html'
            })
            .when('/resources', {
                templateUrl: 'views/resources.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
}) ();
