var app = angular.module('skills',['ngRoute']);

app.config(function($locationProvider,$routeProvider){
    $locationProvider.html5Mode(true);

    $routeProvider
        .when('/', {templateUrl: '/front/main.html'})
        .when('/users/:user_id', {templateUrl: '/front/users/show.html', controller:'users_show_controller'})
        .when('/my_page', {templateUrl:'/front/profile.html'})
        .when('/all_users', {templateUrl:'/front/profile_viewer_all.html'})
        .when('/all_skills', {templateUrl:'/front/skills_viewer_all.html'})
        .when('/all_job', {templateUrl:'/front/job_viewer_all.html'})
        .when('/decision', {templateUrl:'/front/job_decision.html'})
        .when('/approve', {templateUrl:'/front/job_approve.html'})
        .when('/check', {templateUrl:'/front/job_check.html'})
        .when('/creat', {templateUrl:'/front/job_create.html'})
        .when('/view_one', {templateUrl:'/front/job_viewer_one.html'})
        .otherwise({redirectTo: '/'});
});

