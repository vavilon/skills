var app = angular.module('skills',[
    'ngRoute',
    'allProfilesFilters',
    'ngMaterial',
    'ngAnimate'
]);

app.config(function($locationProvider,$routeProvider){
    $locationProvider.html5Mode(true);

    $routeProvider
//        .when('/', {templateUrl: '/front/main.html'})
//        .when('/users/:user_id', {templateUrl: '/front/users/show.html', controller:'users_show_controller'})
        .when('/main', {templateUrl:'/front/main.html'})
        .when('/about_me', {templateUrl:'/front/users/about_me.html'})
        .when('/users', {templateUrl:'/front/users/all.html'})
        .when('/tasks', {templateUrl:'/front/tasks/all.html', controller:'all_tasks_show_controller'})
        .when('/tasks/:task_id', {templateUrl:'/front/tasks/view.html'})
        .when('/tasks/:task_id/decision', {templateUrl:'/front/tasks/decision.html'})
        .when('/tasks/:task_id/approve', {templateUrl:'/front/tasks/approve.html'})
        .when('/tasks/:task_id/check', {templateUrl:'/front/tasks/check.html'})
        .when('/tasks/:task_id/create', {templateUrl:'/front/tasks/create.html'})
        .when('/skills', {templateUrl:'/front/skills/skills.html', controller:'skills_show_controller'})
        .when('/users/:userId', {templateUrl: '/front/users/one.html', controller:'ProfileViewerOneCtrl'})
        .otherwise({redirectTo: '/main'});
});

app.controller('navbar_controller',['$scope', '$http', '$routeParams', '$location',
    function($scope, $http, $routeParams, $location) {
        $scope.selectedIndex = 0;
        $scope.goToMain = function(){$location.path('/main'); $scope.selectedIndex = 0;};
        $scope.goToSkills = function(){$location.path('/skills');};
        $scope.goToTasks = function(){$location.path('/tasks');};
        $scope.goToUsers = function(){$location.path('/users');};
    }]);

(function() {
    'use strict';
    app.directive('sigmajs', function () {
        //over-engineered random id, so that multiple instances can be put on a single page
        var divId = 'sigmjs-dir-container-' + Math.floor((Math.random() * 999999999999)) + '-' + Math.floor((Math.random() * 999999999999)) + '-' + Math.floor((Math.random() * 999999999999));
        return {
            restrict: 'E',
            template: '<div id="' + divId + '" style="width: 100%;height: 100%;"></div>',
            scope: {
                //@ reads the attribute value, = provides two-way binding, & works with functions
                graph: '=',
                width: '@',
                height: '@',
                releativeSizeNode: '='
            },
            link: function (scope, element, attrs) {
                // Let's first initialize sigma:
                var s = new sigma({
                    container: divId,
                    settings: {
                        labelThreshold: 5,
                        labelColor: 'node'
                    }
                });

                scope.$watch('graph', function (newVal, oldVal) {
                    if (scope.graph) {
                        s.graph.clear();
                        s.graph.read(scope.graph);
                        s.refresh();

                        s.startForceAtlas2();
                        setTimeout(function () {
                            s.killForceAtlas2();
                        }, 4000);

                        if (scope.releativeSizeNode) {
                            //this feature needs the plugin to be added
                            sigma.plugins.relativeSize(s, 2);
                        }
                    }
                });

                scope.$watch('width', function (newVal, oldVal) {
                    console.log("graph width: " + scope.width);
                    element.children().css("width", scope.width);
                    s.refresh();
                    window.dispatchEvent(new Event('resize')); //hack so that it will be shown instantly
                });
                scope.$watch('height', function (newVal, oldVal) {
                    console.log("graph height: " + scope.height);
                    element.children().css("height", scope.height);
                    s.refresh();
                    window.dispatchEvent(new Event('resize'));//hack so that it will be shown instantly
                });

                element.on('$destroy', function () {
                    s.graph.clear();
                    s.killForceAtlas2();
                });

                s.bind('clickNode', function (e) {
                    var i = 0;
                    var nodes = s.graph.nodes();
                    var edges = s.graph.edges();
                    for (i = 0; i < nodes.length; i++) {
                        nodes[i].color = 'rgba(30, 30, 30, 0.1)';
                    }
                    for (i = 0; i < edges.length; i++) edges[i].color = 'rgba(100, 100, 100, 0.1)';
                    var neighbors = s.graph.neighborhood(e.data.node.id);
                    e.data.node.color = 'rgba(30, 30, 30, 1)';
                    for (i = 0; i < neighbors.nodes.length; i++) {
                        neighbors.nodes[i].color = 'rgba(30, 30, 30, 1)';
                    }
                    for (i = 0; i < neighbors.edges.length; i++) neighbors.edges[i].color = 'rgba(100, 100, 100, 1)';
                    s.refresh();
                });

                s.bind('clickStage', function (e) {
                    var i = 0;
                    var nodes = s.graph.nodes();
                    var edges = s.graph.edges();
                    for (i = 0; i < nodes.length; i++) {
                        nodes[i].color = 'rgba(30, 30, 30, 1)';
                    }
                    for (i = 0; i < edges.length; i++) edges[i].color = 'rgba(100, 100, 100, 1)';
                    s.refresh();
                });

            }
        };
    });
})();