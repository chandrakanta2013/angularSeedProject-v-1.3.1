App.controller('nightclubCtrl', ['$scope', '$rootScope', 'MetaInformation','$http', function($scope, $rootScope, MetaInformation,$http) {
    $scope.name = 'Home page';

    $http({
            url: 'http://php54.indianic.com/vegas_venues/webservice/get_coolstuff_category_list?&search_coolstuff_category=',
            method: 'POST',
            cache: false,
            params: '',
            headers: {}
        })
        .then(function(success) {
            console.log(success.data);
        }, function(error) {

        });


    $scope.seo = {
        "seo_title": "Cool stuff",
        "seo_description": "Home page description",
        "seo_keywords": "Home page Keywords"
    };
    setMetaData($scope, $rootScope, MetaInformation, $scope.seo);
    $scope.variable = 'Variable Name';

}]);