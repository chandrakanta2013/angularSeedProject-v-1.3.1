var app = angular.module('user.api.services',[]);
app.service('userApiService', ['$cookies', '$cookieStore', '$http', '$state', function($cookies, $cookieStore, $http, $state) {
    var userApiService = {};
    userApiService.GetAllCountry = function() {        
        return $http({
            url: 'http://php54.indianic.com/vegas_venues/webservice/get_night_club_listing?&search_nightclub=&page_index=1',
            method: 'POST',
            data: $.param({

            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    };
    return userApiService;
}]);