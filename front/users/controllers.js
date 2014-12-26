function getProjectsByID(projectID, projects) {
    for(var i = 0; i < projects.length; i++)
        if (projectID == projects[i].id) return projects[i];
}

function getSkillByID(id, skills) {
    var idArray = id.split(".");
    return getSkillByIDRec(idArray, 0, skills);
}

function getSkillByIDRec(id, index, skills) {
    if (index == id.length - 1) return skills[parseInt(id[index]) - 1];
    return getSkillByIDRec(id, index + 1, skills[parseInt(id[index]) - 1].subskills);
}

angular.module('skills').controller('users_show_controller',function($scope,$http,$routeParams){
    $http.get('/models/projects_list.json').success(function(projects) {
        $scope.projects = projects;
        $http.get('/models/skills.json').success(function (skills) {
            $scope.skills = skills;
            $http.get('/models/users/' + $routeParams.user_id + '.json').success(function (user) {
                $scope.user = user;

                $scope.userSkills = [];
                for (var id in $scope.user.skills)
                    $scope.userSkills.push(getSkillByID($scope.user.skills[id], $scope.skills));

                //Копирует проекты по ID из общего списка проектов в список конкретного юзера
                $scope.user.projects = [];
                for (var pID in $scope.user.projectsID)
                    $scope.user.projects.push(getProjectsByID($scope.user.projectsID[pID], $scope.projects));
            }).error(function () {
                $scope.user = null;
            });
        });
    });
});
