App.controller('component2Ctrl', ['user','user1','user2','$scope', '$rootScope', 'MetaInformation','$http', function(user,user1,user2,$scope, $rootScope, MetaInformation,$http) {
    $scope.name = 'Components two';
    $scope.dataArr = user.data.data
    console.log($scope.dataArr)

    $scope.seo = {
        "seo_title": "Home page",
        "seo_description": "Home page description",
        "seo_keywords": "Home page Keywords"
    };
    setMetaData($scope, $rootScope, MetaInformation, $scope.seo);
    $scope.variable = 'Variable Name';

}]);