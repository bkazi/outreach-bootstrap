(function() {
    var app = angular.module('app', ['ngRoute', 'ngAnimate', 'hljs']);

    app.config(function($routeProvider, hljsServiceProvider) {
        $routeProvider
            .when('#/', {
                templateUrl: 'views/intro.html'
            })
            .when('#/htmlInfo', {
                templateUrl: 'views/htmlInfo.html'
            })
            .when('#/cssInfo', {
                templateUrl: 'views/cssInfo.html'
            })
            .when('#/tutorial', {
                templateUrl: 'views/tutorial.html'
            })
            .when('#/resources', {
                templateUrl: 'views/resources.html'
            })
            .otherwise({
                redirectTo: '#/'
            });
        hljsServiceProvider.setOptions({
            // replace tab with 2 spaces
            tabReplace: '  '
        });
        // $locationProvider.html5Mode(true);
    });
}) ();
