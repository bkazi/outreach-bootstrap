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

    app.controller('TabController', ['$scope', function($scope) {
        $scope.tab = 0;

        $scope.isSet = function(curr) {
            return $scope.tab === curr;
        };

        $scope.setTab = function(newTab) {
            $scope.tab = newTab;
        };
    }]);
}) ();
