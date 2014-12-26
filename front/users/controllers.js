function getObjectByID(objectID, objects) {
    for(var item in objects)
        if (objectID == item) return objects[item];
}

angular.module('skills').controller('users_show_controller',function($scope,$http,$routeParams){
    $http.get('/models/projects_list.json').success(function(projects) {
        $scope.projects = projects;
        $http.get('/models/skills.json').success(function (skills) {
            $scope.skills = skills;
            $http.get('/models/users/' + $routeParams.user_id + '.json').success(function (user) {
                $scope.user = user;
                //Копирует скилы по ID из общего списка проектов в список конкретного юзера
                $scope.userSkills = [];
                for (var id in $scope.user.skills)
                    $scope.userSkills.push(getObjectByID($scope.user.skills[id], $scope.skills));

                //Копирует проекты по ID из общего списка проектов в список конкретного юзера
                $scope.userProjects = [];
                for (var pID in $scope.user.projectsID)
                    $scope.userProjects.push(getObjectByID($scope.user.projectsID[pID], $scope.projects));
            }).error(function () {
                $scope.user = null;
            });
        });
    });
});
