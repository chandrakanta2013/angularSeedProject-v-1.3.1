App.directive('<%- sourcefile %>Directive', ['$scope', function($scope){
	return {
		template: '<h3><%- sourcefile %></h3>',
		restrict:'A',
		link: function($scope, iElm, iAttrs, controller) {
			
		},
		scope:{

        },
        controller: function($scope, $element, $attrs){

        },


	};
}]);