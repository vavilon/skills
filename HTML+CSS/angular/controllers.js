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
        $routeProvider.otherwise({redirectTo: '/my_page'});
});

singlePageApp.controller('skillsListCtrl', ['$scope', '$http', function($scope, $http)
{
    $http.get('models/skills.json').success(function(data) {
        $scope.skills = data;
    })
}]);
