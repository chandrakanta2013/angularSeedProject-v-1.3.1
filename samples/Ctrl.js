App.controller('<%- sourcefile %>Ctrl', ['$scope','$http','$rootScope','MetaInformation','GLOBALS','SETTINGS', function($scope,$http,$rootScope,MetaInformation,GLOBALS,SETTINGS) {
    $scope.name = '<%- sourcefile %>';
    $scope.seo = {
        "seo_title": "<%- sourcefile %>",
        "seo_description": "<%- sourcefile %> description",
        "seo_keywords": "<%- sourcefile %> Keywords"
    };
    setMetaData($scope, $rootScope, MetaInformation, $scope.seo);
}]);