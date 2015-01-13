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

/**
 *
 * @param skills    Объект, считанный из skills.json
 * @returns {{}|*}  Объект-обертка, содержащий свойства:
 *                      allLeaves   (array)     спосок ссылок на все листья
 *                      skills      (object)    объект, содержащий все скиллы, как свойства
 *                      root        (object)    ссылка на скилл "Абсолютные знания"
 *                      log()       (function)  выводит в консоль все свойства объекта (для дебага)
 *                  Свойства скилла:
 *                      title       (string)  название скилла
 *                      parents     (array)   список ссылок на родителей
 *                      allParents  (array)   список ссылок на всех родителей вплоть до root
 *                      children    (array)   список ссылок на детей
 *                      allChildren (array)   список ссылок на всех детей вплоть до листьев
 *                      isLeaf      (bool)    является ли листком (может отсутствовать)
 *                      leaves      (array)   список ссылок на листья скилла (только собственные)
 *                      allLeaves   (array)   список ссылок на все листья скилла (рекурсивно по детям)
 *
 *
 */
function getAllSkillsObject(skills)
{
    'use strict';
    var obj = {}; //объект-обертка для всех скиллов
    obj.leaves = []; //хранит ССЫЛКИ (не id) на все листья
    obj.skills = {}; //объект, в котором свойствами являются скиллы
    
    for (var id in skills)
    {
        //копируем имеющиеся свойства
        obj.skills[id] = obj.skills[id] || {}; //проверка нужна, потому что дальше объекты могут создаваться
        obj.skills[id].title = skills[id].title;
        obj.skills[id].parents = []; //хранит ССЫЛКИ (не id) на родителей
        obj.skills[id].leaves = obj.skills[id].leaves || [];
        for (var i = 0; i < skills[id].parents.length; i++)
        {
            obj.skills[skills[id].parents[i]] = obj.skills[skills[id].parents[i]] || {};
            obj.skills[id].parents.push(obj.skills[skills[id].parents[i]]);
        }

        for (i = 0; i < obj.skills[id].parents.length; i++)
        {
            obj.skills[id].parents[i].leaves = obj.skills[id].parents[i].leaves || [];
            if (skills[id].isLeaf) obj.skills[id].parents[i].leaves.push(obj.skills[id]);
        }
        if (skills[id].isLeaf) {
            obj.skills[id].isLeaf = skills[id].isLeaf;
            obj.leaves.push(obj.skills[id]);
        }

        //создаем массив ССЫЛОК (не id) на детей
        obj.skills[id].children = obj.skills[id].children || []; //проверка нужна, чтобы children сохранялись
        for (i = 0; i < obj.skills[id].parents.length; i++)
        {
            obj.skills[id].parents[i].children = obj.skills[id].parents[i].children || [];
            obj.skills[id].parents[i].children.push(obj.skills[id]);
        }
    }

    //рекурсия для добавления всех детей вплоть до листьев и всех листьев
    function addAllChildrenRec(to, from)
    {
        to.allChildren = to.allChildren || [];
        to.allLeaves = to.allLeaves || [];
        to.allChildren = to.allChildren.concat(from.children);
        if (from.leaves) to.allLeaves = to.allLeaves.concat(from.leaves);
        for (var chid in from.children)
        {
            addAllChildrenRec(to, from.children[chid]);
        }
    }

    //рекурсия для добавления всех родителей вплоть до корня
    function addAllParentsRec(to, from)
    {
        to.allParents = to.allParents || [];
        to.allParents = to.allParents.concat(from.parents);
        for (var pid in from.parents)
        {
            addAllParentsRec(to, from.parents[pid]);
        }
    }

    //добавление ссылок на всех детей и всех родителей
    for (id in obj.skills)
    {
        addAllChildrenRec(obj.skills[id], obj.skills[id]);
        addAllParentsRec(obj.skills[id], obj.skills[id]);
    }

    //для дебага
    obj.log = function() {
        for (var prop in obj) console.log(obj[prop]);
    };

    return obj;
}

angular.module('skills').controller('skills_show_controller',function($scope,$http,$routeParams){
    $http.get('/models/skills.json').success(function (skills) {

        var aso = getAllSkillsObject(skills);
        //aso.log();
        console.log(aso);

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
    });
}]);

app.controller('all_tasks_show_controller', ['$scope', '$http', function($scope, $http)
{
    $http.get('models/skills.json').success(function(data) {
        $scope.skills = data;
    });
}]);
