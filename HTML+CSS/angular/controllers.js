var singlePageApp = angular.module('single_pageApp', []).config(function($routeProvider)
{
		$routeProvider.when('/my_page',
		{
			templateUrl:'HTML+CSS/profile.html',
		});
		$routeProvider.when('/all_users',
		{
			templateUrl:'HTML+CSS/profile_viewer_all.html',
		});
		$routeProvider.when('/all_skills',
		{
			templateUrl:'HTML+CSS/skills_viewer_all.html',
		});
		$routeProvider.when('/all_job',
		{
			templateUrl:'HTML+CSS/job_viewer_all.html',
		});
		$routeProvider.when('/decision',
		{
			templateUrl:'HTML+CSS/job_decision.html',
		});
		$routeProvider.when('/approve',
		{
			templateUrl:'HTML+CSS/job_approve.html',
		});
		$routeProvider.when('/check',
		{
			templateUrl:'HTML+CSS/job_check.html',
		});
		$routeProvider.when('/creat',
		{
			templateUrl:'HTML+CSS/job_create.html',
		});
		$routeProvider.when('/view_one',
		{
			templateUrl:'HTML+CSS/job_viewer_one.html',
		});
        $routeProvider.otherwise({redirectTo: '/my_page'});
});

singlePageApp.controller('skillsListCtrl', ['$scope', '$http', function($scope, $http)
{
    $http.get('models/skills.json').success(function(data) {
        $scope.skills = data;
    })
}]);
