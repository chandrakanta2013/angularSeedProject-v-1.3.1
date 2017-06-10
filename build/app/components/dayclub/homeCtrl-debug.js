App.controller('dayclubCtrl', ['getNightclubData2','getNightclubData1','getNightclubData','$scope', 'userApiService', 'MetaInformation','$http','$rootScope', function(getNightclubData2,getNightclubData1,getNightclubData,$scope, userApiService, MetaInformation,$http,$rootScope) {
    $scope.name = 'Home pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome pageHome ';

  
                //console.log('testing:'+ JSON.stringify(getNightclubData))
                console.log('testing1:'+ JSON.stringify(getNightclubData1))
                console.log('testing2:'+ JSON.stringify(getNightclubData2))

   //console.log('data: '+getNightclubData.data);
   // $scope.nc = resourceService.GetAllCountry().then(function(success){
   //  console.log('testt:'+ success.data)
   // });
    $scope.seo = {
        "seo_title": "Dayclubs",
        "seo_description": "Home page description",
        "seo_keywords": "Home page Keywords"
    };
    setMetaData($scope, $rootScope, MetaInformation, $scope.seo);
    $scope.variable = 'Variable Name';

}]);