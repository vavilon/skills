angular.module('skills').controller('users_show_controller',function($scope,$http,$routeParams){
    $http.get('/models/projects_list.json').success(function(projects) {
        $scope.projects = projects;
        $http.get('/models/skills.json').success(function (skills) {
            $scope.skills = skills;
            $http.get('/models/users/' + $routeParams.user_id + '.json').success(function (user) {
                $scope.user = user;
            }).error(function () {
                $scope.user = null;
            });
        });
    });
});
