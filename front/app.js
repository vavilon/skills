var app = angular.module('skills',[
    'ngRoute',
    'allProfilesFilters',
    'ngMaterial',
    'ngAnimate'
]);

app.config(function($locationProvider,$routeProvider,$mdThemingProvider){
    $locationProvider.html5Mode(true);

    $routeProvider
        .when('/main', {templateUrl:'/front/main.html', controller: 'mainPageCtrl'})
        .when('/about_me', {templateUrl:'/front/users/about_me.html'})
        .when('/users', {templateUrl:'/front/users/all.html'})
        .when('/tasks', {templateUrl:'/front/tasks/all.html', controller:'all_tasks_show_controller'})
        .when('/tasks/:task_id', {templateUrl:'/front/tasks/view.html', controller:'OneTaskCtrl'})
        .when('/tasks/:task_id/decision', {templateUrl:'/front/tasks/decision.html'})
        .when('/tasks/:task_id/approve', {templateUrl:'/front/tasks/approve.html'})
        .when('/tasks/:task_id/check', {templateUrl:'/front/tasks/check.html'})
        .when('/tasks/:task_id/create', {templateUrl:'/front/tasks/create.html'})
        .when('/skills', {templateUrl:'/front/skills/skills.html', controller:'skills_show_controller'})
        .when('/users/:user_id', {templateUrl: '/front/users/one.html', controller:'ProfileViewerOneCtrl'})
        .otherwise({redirectTo: '/main'});

    $mdThemingProvider.theme('default')
        .primaryColor('indigo', {
            'default': '500',
            'hue-1': '300',
            'hue-2': '800',
            'hue-3': 'A100'})
        .accentColor('pink', {
            'default': '400',
            'hue-1': '300',
            'hue-2': '800',
            'hue-3': 'A100'})
        .warnColor('red', {
            'default': '500',
            'hue-1': '300',
            'hue-2': '800',
            'hue-3': 'A100'});
});

app.filter('objectByKeyValFilter', function () {
    return function (input, filterKey, filterVal) {
        var filteredInput = {};
        angular.forEach(input, function(value, key) {
            if(value[filterKey] && (new RegExp(filterVal, "i")).test(value[filterKey])) {
                filteredInput[key]= value;
            }
        });
        return filteredInput;
    }});

app.filter('objectByKeyValFilterArr', function () {
    return function (input, filterKey, filterVal) {
        var filteredInput = [];
        angular.forEach(input, function(value, key) {
            if(value[filterKey] && (new RegExp(filterVal, "i")).test(value[filterKey])) {
                filteredInput.push(value);
            }
        });
        return filteredInput;
    }});

app.factory('navbarSelectedIndex', function() {
    var selectedIndex = 0;
    var service = {};
    service.set = function(index) {
        selectedIndex = index;
    };
    service.get = function() {
        return selectedIndex;
    };
    return service;
});

app.controller('navbar_controller',['$scope', '$http', '$routeParams', '$location', 'navbarSelectedIndex',
    function($scope, $http, $routeParams, $location, navbarSelectedIndex) {
        $http.get('models/users.json').success(function(data) {
            $scope.users = data;
        });
        $scope.getNavbarSelectedIndex = navbarSelectedIndex.get;
        if((new RegExp('/main')).test($location.url())) navbarSelectedIndex.set(0);
        else if((new RegExp('/skills')).test($location.url())) navbarSelectedIndex.set(1);
        else if((new RegExp('/tasks')).test($location.url())) navbarSelectedIndex.set(2);
        else if((new RegExp('/users')).test($location.url())) navbarSelectedIndex.set(3);
        $scope.goToMain = function(){$location.path('/main'); navbarSelectedIndex.set(0);};
        $scope.goToSkills = function(){$location.path('/skills'); navbarSelectedIndex.set(1);};
        $scope.goToTasks = function(){$location.path('/tasks'); navbarSelectedIndex.set(2);};
        $scope.goToUsers = function(){$location.path('/users'); navbarSelectedIndex.set(3);};
    }]);