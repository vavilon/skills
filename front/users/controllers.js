
function getSkillTitle(id, skills) {
    var idArray = id.split(".");
    return getSkillTitleRec(idArray, 0, skills);
}

function getSkillTitleRec(id, index, skills) {
    if (index == id.length - 1) return skills[parseInt(id[index]) - 1].title;
    return getSkillTitleRec(id, index + 1, skills[parseInt(id[index]) - 1].subskills);
}

angular.module('skills').controller('users_show_controller',function($scope,$http,$routeParams){
    $http.get('/models/skills.json').success(function(skills){
        $scope.skills = skills;
        $http.get('/models/users/'+$routeParams.user_id+'.json').success(function(user){
            $scope.user = user;
            $scope.userSkillsTitles = [];
            for (var id in $scope.user.skills)
                $scope.userSkillsTitles.push(getSkillTitle($scope.user.skills[id], $scope.skills));
        }).error(function(){
            $scope.user = null;
        })
    })
});