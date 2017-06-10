var app = angular.module('commonDirectives', []);
app.directive('pageTitle', ['$rootScope', '$timeout', function($rootScope, $timeout){

//coommon directive
	return {
    link: function(scope, element) {
      var listener = function(event, toState, toParams, fromState, fromParams) {
        // Default title - load on Dashboard 1
        var title = 'Project Name';
        // Create your own title pattern
        if (toState.data.pageTitle) {title = toState.data.pageTitle;}
        $timeout(function() {
          element.text(title);
        });
      };
      $rootScope.$on('$stateChangeStart', listener);
    }
  };
}]);
