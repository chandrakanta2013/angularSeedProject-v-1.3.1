var ModuleName = 'DEMO';
var App = angular.module(ModuleName, [
    "ui.router",
    "route",
    "ngCookies",
    "oc.lazyLoad",
    "ngSanitize",
    "LocalStorageModule",
    "ui.bootstrap",
    "ngMaterial",
    "ngAnimate",
    "constants",
    "commonDirectives",
    "defaultServices",
    "MainController" ,
    "authenticationServices",
    "user.api.services"
    ]);

App.run(['$rootScope', '$state', '$stateParams', '$cookieStore', '$cookies', 'authService',
    function($rootScope, $state, $stateParams, $cookieStore, $cookies, authService) {
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            if (toState.name.indexOf('main') > -1 && authService.isAuthenticated() == '') {
                event.preventDefault();
                $state.go('login');
                return;
            } else if (toState.name == 'main' && authService.isAuthenticated() != '') {
                event.preventDefault();
                $state.go('main.home');
                return;
            } else if (toState.name.indexOf('login') > -1 && authService.isAuthenticated() != '') {
                event.preventDefault();
                $state.go('main.home');
                return;
            }
        });
    }
    ]);


App.config(['$controllerProvider', function($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();
}]);


App.config(['$stateProvider', '$urlRouterProvider', '$locationProvider','$httpProvider','GLOBALS','SETTINGS', function($stateProvider, $urlRouterProvider, $locationProvider,$httpProvider,GLOBALS,SETTINGS) {

    console.log('path: '+SETTINGS[GLOBALS.ENV].siteUrl)
    $urlRouterProvider.otherwise( function($injector, $location) {
        var $state = $injector.get('$state');
        var Storage = $injector.get('authService');
        if (Storage.isAuthenticated()) {
            $state.go('main.home');
        }
        else {
            $state.go('login');
        }
    });
    if (history.pushState) {
        $locationProvider.hashPrefix('!');
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: true
        });
    } else {        
        $locationProvider.hashPrefix('!');
        $locationProvider.html5Mode({
            enabled: false,
            requireBase: false
        });
    }
    $httpProvider.interceptors.push('interceptHttp');
}]);



/* Init global settings and run the app */
App.run(["$rootScope", "$state","trafficCop", function($rootScope, $state, trafficCop) {
    $rootScope.$state = $state; // state to be accessed from view 
    $rootScope.trafficCop = trafficCop; 
    
    
   
}]);

angular.element(document).ready(function() {
  angular.bootstrap(document, [ModuleName]);
});

function setMetaData($scope, $rootScope, MetaInformation, seo) {
    if (typeof seo != "undefined") {
        if (typeof seo.seo_title != "undefined") {
            MetaInformation.setMetaTitle(seo.seo_title);
        }
        if (typeof seo.seo_description != "undefined") {
            MetaInformation.setMetaDescription(seo.seo_description)
        }
        if (typeof seo.seo_keywords != "undefined") {
            MetaInformation.setMetaKeyword(seo.seo_keywords)
        }
        $rootScope.metaData = MetaInformation;
    }
}
