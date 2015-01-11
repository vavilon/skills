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

angular.module('skills').controller('skills_show_controller',function($scope,$http,$routeParams){
    $http.get('/models/skills.json').success(function (skills) {

        var g = {
                nodes: [],
                edges: []
            };

        //Заполняем граф узлами
        for (var sid in skills)
            g.nodes.push({
                id: sid,
                label: skills[sid].title,
                x: Math.random(),
                y: Math.random(),
                size: 1,
                color: 'rgba(30, 30, 30, 1)'
            });

        //Заполняем граф связями
        var i = 0;
        for (var sid in skills) {
            if (skills[sid].parents) {
                for (var j = 0; j < skills[sid].parents.length; j++) {
                    g.edges.push({
                        id: 'e' + i,
                        source: sid,
                        target: skills[sid].parents[j],
                        size: 1,
                        color: 'rgba(100, 100, 100, 1)',
                        type: 'arrow'
                    });
                    i++;
                }
            }
        }

        $scope.sigmaGraph = g;

    });
});

app.controller('usersListCtrl', ['$scope', '$http', '$filter', function($scope, $http, $filter)
{
    $http.get('models/users.json').success(function(data) {
        $scope.users = data;
    })

    var orderBy = $filter('orderBy');

    $scope.order = function(predicate, reverse) {
        $scope.users = orderBy($scope.users, predicate, reverse);
    };

    $scope.order('-ExPe',false);

}]);

app.controller('skillsListCtrl', ['$scope', '$http', function($scope, $http)
{
    $http.get('models/skills.json').success(function(data) {
        $scope.skills = data;
    })
}]);
