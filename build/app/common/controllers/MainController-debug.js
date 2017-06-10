var app = angular.module('MainController',['ngCookies','defaultServices']);

app.controller('MainController', ['$scope', '$rootScope','$cookies','$cookieStore','$state','authService','resourceService','$http', function($scope, $rootScope,$cookies,$cookieStore,$state,authService,resourceService,$http) {
	$scope.signout = function() {
		authService.clearAuthentication();
		$state.go('login');
	};


	$http({
		method: 'GET',
		url: ''
	}).then(function successCallback(response) {
		//console.log(response)
		
	    // when the response is available
	}, function errorCallback(response) {
	    // called asynchronously if an error occurs
	    // or server returns response with an error status.
	});


}]);