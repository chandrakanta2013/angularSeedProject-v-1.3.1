App.directive('homeDirective', ['$scope', function($scope){
	return {
		link: function($scope, iElm, iAttrs, controller) {
			angular.element(iElm).css({'color':'red'})
		}
	};
}]);