App.controller('ckCtrl', ['$scope','$http','$rootScope', function($scope,$http,$rootScope) {
    $scope.name = 'Chandrakanta';
    $scope.seo = {
        "seo_title": "ck",
        "seo_description": "ck description",
        "seo_keywords": "ck Keywords"
    };
    setMetaData($scope, $rootScope, MetaInformation, $scope.seo);
}]);