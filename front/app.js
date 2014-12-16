var app = angular.module('skills',['ngRoute']);

app.config(function($locationProvider,$routeProvider){
    $locationProvider.html5Mode(true);

    $routeProvider
        .when('/', {templateUrl: '/front/main.html'})
        .when('/users/:user_id', {templateUrl: '/front/users/show.html', controller:'users_show_controller'})
        .otherwise({redirectTo: '/'});
});