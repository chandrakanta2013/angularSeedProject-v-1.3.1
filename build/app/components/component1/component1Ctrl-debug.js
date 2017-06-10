App.controller('component1Ctrl', ['$scope', '$rootScope', 'MetaInformation','$http', function($scope, $rootScope, MetaInformation,$http) {
    $scope.name = 'Component One';

    $scope.seo = {
        "seo_title": "Home page",
        "seo_description": "Home page description",
        "seo_keywords": "Home page Keywords"
    };
    setMetaData($scope, $rootScope, MetaInformation, $scope.seo);
    $scope.variable = 'Variable Name';

}]);