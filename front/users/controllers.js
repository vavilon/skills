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

        var s,
            g = {
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

        s = new sigma({
            graph: g,
            container: 'graph-container',
            settings: { labelColor: 'node' }
        });

        s.startForceAtlas2();
        setTimeout(function(){s.stopForceAtlas2();}, 4000);

        s.bind('clickNode', function(e) {
            var nodes = s.graph.nodes();
            var edges = s.graph.edges();
            for (i = 0; i < nodes.length; i++)
            {
                nodes[i].color = 'rgba(30, 30, 30, .1)';
            }
            for (i = 0; i < edges.length; i++) edges[i].color = 'rgba(100, 100, 100, .1)';
            var neighbors = s.graph.neighborhood(e.data.node.id);
            e.data.node.color = 'rgba(30, 30, 30, 1)';
            for (i = 0; i < neighbors.nodes.length; i++)
            {
                neighbors.nodes[i].color = 'rgba(30, 30, 30, 1)';
            }
            for (i = 0; i < neighbors.edges.length; i++) neighbors.edges[i].color = 'rgba(100, 100, 100, 1)';
            s.refresh();
        });
        s.bind('clickStage', function(e) {
            var nodes = s.graph.nodes();
            var edges = s.graph.edges();
            for (i = 0; i < nodes.length; i++)
            {
                nodes[i].color = 'rgba(30, 30, 30, 1)';
            }
            for (i = 0; i < edges.length; i++) edges[i].color = 'rgba(100, 100, 100, 1)';
            s.refresh();
        });
    });
});

app.controller('skillsListCtrl', ['$scope', '$http', function($scope, $http)
{
    $http.get('models/skills.json').success(function(data) {
        $scope.skills = data;
    })
}]);