App.controller('loginCtrl', ['$scope','authService','$cookies','$cookieStore','$state','$stateParams', function($scope, authService,$cookies, $cookieStore, $state, $stateParams){
	console.log($state.current.name);
	$scope.signin = function(){
		console.log(234324);
		authService.setAuthToken();
		$state.go("main.home");
	};	
}]);