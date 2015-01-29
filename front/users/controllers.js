//angular.module('skills').controller('users_show_controller',function($scope,$http,$routeParams){
//    $http.get('/models/tasks_list.json').success(function(projects) {
//        $scope.projects = projects;
//        $http.get('/models/skills.json').success(function (skills) {
//            $scope.skills = skills;
//            $http.get('/models/users/' + $routeParams.user_id + '.json').success(function (user) {
//                $scope.user = user;
//            }).error(function () {
//                $scope.user = null;
//            });
//        });
//    });
//});

/**
 *
 * @param skills    Объект, считанный из skills.json
 * @returns {{}|*}  Объект-обертка, содержащий свойства:
 *                      leaves      (array)     спосок ссылок на все листья
 *                      skills      (object)   объект, содержащий все скиллы, как свойства
 *                      root        (object)   ссылка на скилл "Абсолютные знания"
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
 *                      id          (string)  id скилла
 *
 */
function extendedSkills(skills)
{
    'use strict';
    this.leaves = []; //хранит ССЫЛКИ (не id) на все листья
    this.skills = {}; //объект, в котором свойствами являются скиллы

    for (var id in skills)
    {
        //копируем имеющиеся свойства
        this.skills[id] = this.skills[id] || {}; //проверка нужна, потому что дальше объекты могут создаваться
        this.skills[id].title = skills[id].title;
        this.skills[id].parents = []; //хранит ССЫЛКИ (не id) на родителей
        this.skills[id].leaves = this.skills[id].leaves || [];
        this.skills[id].allChildren = [];
        this.skills[id].allParents = [];
        this.skills[id].allLeaves = [];
        this.skills[id].id = id;

        for (var i = 0; i < skills[id].parents.length; i++)
        {
            this.skills[skills[id].parents[i]] = this.skills[skills[id].parents[i]] || {};
            if ($.inArray(this.skills[skills[id].parents[i]], this.skills[id].parents) === -1)
                this.skills[id].parents.push(this.skills[skills[id].parents[i]]);
        }

        for (i = 0; i < this.skills[id].parents.length; i++)
        {
            this.skills[id].parents[i].leaves = this.skills[id].parents[i].leaves || [];
            if (skills[id].isLeaf)
                if ($.inArray(this.skills[id], this.skills[id].parents[i].leaves) === -1)
                    this.skills[id].parents[i].leaves.push(this.skills[id]);
        }
        if (skills[id].isLeaf) {
            this.skills[id].isLeaf = skills[id].isLeaf;
            this.leaves.push(this.skills[id]);
        }

        //создаем массив ССЫЛОК (не id) на детей
        this.skills[id].children = this.skills[id].children || []; //проверка нужна, чтобы children сохранялись
        for (i = 0; i < this.skills[id].parents.length; i++)
        {
            this.skills[id].parents[i].children = this.skills[id].parents[i].children || [];
            if ($.inArray(this.skills[id], this.skills[id].parents[i].children) === -1)
                this.skills[id].parents[i].children.push(this.skills[id]);
        }
    }

    //рекурсия для добавления всех детей вплоть до листьев и всех листьев
    function addAllChildrenRec(to, from)
    {
        for (var i = 0; i < from.children.length; i++)
            if ($.inArray(from.children[i], to.allChildren) === -1)
                to.allChildren.push(from.children[i]);

        for (i = 0; i < from.leaves.length; i++)
            if ($.inArray(from.leaves[i], to.allLeaves) === -1)
                to.allLeaves.push(from.leaves[i]);

        for (var chid in from.children)
        {
            addAllChildrenRec(to, from.children[chid]);
        }
    }

    //рекурсия для добавления всех родителей вплоть до корня
    function addAllParentsRec(to, from)
    {
        for (var i = 0; i < from.parents.length; i++)
            if ($.inArray(from.parents[i], to.allParents) === -1)
                to.allParents.push(from.parents[i]);

        for (var pid in from.parents)
        {
            addAllParentsRec(to, from.parents[pid]);
        }
    }

    //добавление ссылок на всех детей и всех родителей
    for (id in this.skills)
    {
        addAllChildrenRec(this.skills[id], this.skills[id]);
        addAllParentsRec(this.skills[id], this.skills[id]);
    }

    //для дебага
    this.log = function() {
        for (var prop in this) console.log(this[prop]);
    };

    this.root = this.skills['root'];
}

angular.module('skills').controller('skills_show_controller',function($scope,$http,$filter){
    $http.get('/models/skills.json').success(function (skills) {

        $http.get('models/users.json').success(function(data) {
            $scope.users = data;
        });

        $scope.skillTitle = "";
        $scope.filteredSkills = [];

        $scope.highlightSkills = true;
        $scope.highlightNeeds = true;

        $scope.exs = new extendedSkills(skills);

        $scope.toogleExpandedForAll = function(expand) {
            for (var skill in $scope.exs.skills) {
                $scope.exs.skills[skill].expanded = expand;
            }
        };

        $scope.toogleExpandedForAll(true);

        $scope.expand = function(skill){
            skill.expanded = !skill.expanded;
        };

        $scope.isInUserSkills = function(skill) {
            return angular.isUndefined($scope.users) || ($.inArray(skill.id, $scope.users[0].skills) !== -1);
        };

        $scope.isInUserNeeds = function(skill) {
            return angular.isUndefined($scope.users) || ($.inArray(skill.id, $scope.users[0].needs) !== -1);
        };

        $scope.$watch('skillTitle', function(newval, oldval) {
            if ($scope.skillTitle && $scope.filteredSkills)
            $scope.filteredSkills = $filter('objectByKeyValFilterArr')($scope.exs.skills, 'title', newval);
            for (var skill in $scope.filteredSkills) {
                $scope.filteredSkills[skill].expanded = false;
            }
        });
    });
});

app.controller('usersListCtrl', ['$scope', '$http', '$filter', function($scope, $http, $filter)
{
    $scope.username = "";
    $scope.filteredUsers = [];

    $http.get('models/users.json').success(function(data) {
        $scope.users = data;
        $scope.lastExpandedUser = $scope.users[0];
    });
    $http.get('/models/skills.json').success(function(data) {
        $scope.skills = data;
    });

    var orderBy = $filter('orderBy');

    $scope.order = function(predicate, reverse) {
        $scope.users = orderBy($scope.users, predicate, reverse);
    };

    $scope.order('-exp', false);

    $scope.expand = function(user) {
        if ($scope.lastExpandedUser !== user) $scope.lastExpandedUser.expanded = false;
        user.expanded = !user.expanded;
        $scope.lastExpandedUser = user;
    };

    $scope.$watch('username', function(newval, oldval) {
        if ($scope.lastExpandedUser) $scope.lastExpandedUser.expanded = false;
    });
}]);

app.controller('skillsListCtrl', ['$scope', '$http', function($scope, $http)
{
    $http.get('models/skills.json').success(function(data) {
        $scope.skills = data;
    });
}]);

app.controller('all_tasks_show_controller', ['$scope', '$http', '$mdSidenav', function($scope, $http, $mdSidenav)
{
    $http.get('models/skills.json').success(function(skills) {
        $scope.skills = skills;
        $http.get('models/tasks_list.json').success(function(tasks){
            $scope.tasks = tasks;
            $scope.lastExpandedTask = $scope.tasks[Object.keys($scope.tasks)[0]];
            $scope.lastExpandedTask.expanded = false;

            $http.get('models/users.json').success(function(users){
                $scope.users = users;
            });
        });
    });


    $scope.findUser = function(id) {
        for(var user in $scope.users)
            if($scope.users[user].id === id) return $scope.users[user];
    };

    $scope.expand = function(task) {
        if ($scope.lastExpandedTask !== task) $scope.lastExpandedTask.expanded = false;
        task.expanded = !task.expanded;
        $scope.lastExpandedTask = task;
    };

    $scope.$watch('taskName', function(newval, oldval) {
        if ($scope.lastExpandedTask) $scope.lastExpandedTask.expanded = false;
    });

    $scope.toggleFilter = function() {
    };

    $scope.closeFilter = function() {
    };
}]);

app.controller('ProfileViewerOneCtrl', ['$scope', '$routeParams', '$http',
    function($scope, $routeParams, $http) {
        $http.get('models/users.json').success(function(data) {
            $scope.user = data[$routeParams.user_id];
        });
    }
]);
