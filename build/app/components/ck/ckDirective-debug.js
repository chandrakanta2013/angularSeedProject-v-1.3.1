App.directive('ckDirective', ['$scope', function($scope){
	return {
		template: '<h3>ck</h3>',
		restrict:'A',
		link: function($scope, iElm, iAttrs, controller) {
			angular.element(iElm).css({'color':'red'})
		},
		scope:{

        },
        controller: function($scope, $element, $attrs){

        },


	};
}]);